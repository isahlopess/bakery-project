"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getIngredients() {
  return await prisma.ingredient.findMany({
    orderBy: { nome: "asc" }
  });
}

export async function createIngredient(data: { nome: string; custoPacote: number; quantidadePacote: number; unidade: string; categoria?: string }) {
  const custo = data.custoPacote / data.quantidadePacote;
  await prisma.ingredient.create({
    data: {
      nome: data.nome,
      custoPacote: data.custoPacote,
      quantidadePacote: data.quantidadePacote,
      unidade: data.unidade,
      categoria: data.categoria || "GERAL",
      custo
    }
  });
  revalidatePath("/admin", "layout");
  return { success: true };
}

export async function updateIngredient(id: number, data: { nome?: string; custoPacote?: number; quantidadePacote?: number; unidade?: string; categoria?: string }) {
  const ingredient = await prisma.ingredient.findUnique({ where: { id } });
  if (!ingredient) throw new Error("Insumo não encontrado");

  const custoPacote = data.custoPacote ?? ingredient.custoPacote;
  const quantidadePacote = data.quantidadePacote ?? ingredient.quantidadePacote;
  const custo = custoPacote / quantidadePacote;

  await prisma.ingredient.update({
    where: { id },
    data: {
      nome: data.nome,
      custoPacote,
      quantidadePacote,
      unidade: data.unidade,
      categoria: data.categoria,
      custo
    }
  });
  revalidatePath("/admin", "layout");
  return { success: true };
}

export async function deleteIngredient(id: number) {
  try {
    await prisma.ingredient.delete({ where: { id } });
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Não é possível excluir um insumo que está sendo usado em uma receita." };
  }
}

export async function getProductsWithRecipes() {
  return await prisma.product.findMany({
    include: {
      recipes: {
        include: { ingredient: true }
      }
    },
    orderBy: { nome: "asc" }
  });
}

export async function saveRecipe(productId: number, rendimento: number, items: { ingredientId: number; quantidade: number }[]) {
  await prisma.$transaction([
    prisma.product.update({ where: { id: productId }, data: { rendimento } }),
    prisma.recipeItem.deleteMany({ where: { productId } }),
    ...items.map(item => 
      prisma.recipeItem.create({
        data: {
          productId,
          ingredientId: item.ingredientId,
          quantidade: item.quantidade
        }
      })
    )
  ]);
  
  revalidatePath("/admin", "layout");
  return { success: true };
}
