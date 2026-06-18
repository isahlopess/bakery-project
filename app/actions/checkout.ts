"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";

const checkoutSchema = z.object({
  customerName: z.string().min(3, "Nome completo é obrigatório"),
  customerEmail: z.string().email("E-mail inválido").optional().or(z.literal("")),
  customerPhone: z.string().min(10, "Telefone inválido"),
  items: z.array(z.object({
    id: z.number(),
    nome: z.string(),
    preco: z.number(),
    quantidade: z.number().min(1),
  })).min(1, "Carrinho vazio"),
  total: z.number().min(0.01)
});

export async function processCheckout(formData: z.infer<typeof checkoutSchema>) {
  try {
    const data = checkoutSchema.parse(formData);

    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail || null,
        customerPhone: data.customerPhone,
        total: data.total,
        status: "NOVO",
        items: {
          create: data.items.map(item => ({
            nome: item.nome,
            preco: item.preco,
            quantidade: item.quantidade
          }))
        }
      }
    });

    return { success: true, orderId: order.id };
  } catch (error: any) {
    if (error instanceof z.ZodError || error.name === 'ZodError') {
      const issues = error.issues || error.errors || [];
      return { success: false, errors: issues.map((e: any) => e.message) };
    }
    console.error("Checkout error:", error);
    return { success: false, errors: ["Ocorreu um erro interno. Tente novamente."] };
  }
}
