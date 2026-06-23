"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

const checkoutSchema = z.object({
  customerName: z.string().min(3, "Nome completo é obrigatório"),
  customerEmail: z.string().email("E-mail inválido").optional().or(z.literal("")),
  customerPhone: z.string().min(10, "Telefone inválido"),
  customerAddress: z.string().min(5, "Endereço completo é obrigatório"),
  observation: z.string().optional(),
  items: z.array(z.object({
    id: z.number(),
    nome: z.string(),
    quantidade: z.number().min(1),
  })).min(1, "Carrinho vazio"),
});

export async function processCheckout(formData: any) {
  try {
    const data = checkoutSchema.parse(formData);

    const productIds = data.items.map(item => item.id);
    const productsInDb = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { recipes: { include: { ingredient: true } } }
    });

    const stockErrors: string[] = [];
    let calculatedTotal = 0;

    const validatedItems = data.items.map(item => {
      const dbProduct = productsInDb.find(p => p.id === item.id);
      if (!dbProduct) {
        stockErrors.push(`Produto "${item.nome}" não encontrado.`);
        return null;
      } 
      if (dbProduct.estoque < item.quantidade) {
        stockErrors.push(`Estoque insuficiente para "${item.nome}". Temos apenas ${dbProduct.estoque} un.`);
        return null;
      }
      
      calculatedTotal += (dbProduct.preco * item.quantidade);
      
      let calcCost = 0;
      if (dbProduct.recipes) {
        calcCost = dbProduct.recipes.reduce((sum, r) => sum + (r.quantidade * r.ingredient.custo), 0);
      }

      return {
        nome: dbProduct.nome,
        preco: dbProduct.preco,
        quantidade: item.quantidade,
        custoUnitario: calcCost,
        dbId: dbProduct.id
      };
    }).filter(Boolean) as any[];

    if (stockErrors.length > 0) {
      return { success: false, errors: stockErrors };
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerName: data.customerName,
          customerEmail: data.customerEmail || null,
          customerPhone: data.customerPhone,
          customerAddress: data.customerAddress,
          observation: data.observation || null,
          total: calculatedTotal,
          status: "NOVO",
          items: {
            create: validatedItems.map(item => ({
              nome: item.nome,
              preco: item.preco,
              quantidade: item.quantidade,
              custoUnitario: item.custoUnitario
            }))
          }
        }
      });

      for (const item of validatedItems) {
        await tx.product.update({
          where: { id: item.dbId },
          data: { estoque: { decrement: item.quantidade } }
        });
      }

      return newOrder;
    });

    revalidatePath("/admin", "layout");
    return { success: true, orderId: order.id };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues.map((e) => e.message) };
    }
    console.error("Checkout error:", error);
    return { success: false, errors: ["Ocorreu um erro interno. Tente novamente."] };
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Não autorizado." };
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Falha ao atualizar o status do pedido." };
  }
}
