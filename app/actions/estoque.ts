"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProduto(productId: number, novaQuantidade: number, novoPreco: number) {
  await prisma.product.update({
    where: { id: productId },
    data: { 
      estoque: novaQuantidade,
      preco: novoPreco
    },
  });
  revalidatePath("/admin/estoque");
  revalidatePath("/admin");
}
