"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateEstoque(productId: number, novaQuantidade: number) {
  await prisma.product.update({
    where: { id: productId },
    data: { estoque: novaQuantidade },
  });
  revalidatePath("/admin/estoque");
  revalidatePath("/admin");
}
