"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
async function saveImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const extension = file.name.split('.').pop() || 'png';
  const fileName = `${Date.now()}-${Math.round(Math.random() * 10000)}.${extension}`;
  const filePath = path.join(uploadDir, fileName);
  
  await fs.writeFile(filePath, buffer);
  
  return `/uploads/${fileName}`;
}

import { Prisma } from "@prisma/client";

export async function createProduto(formData: FormData) {
  const nome = formData.get("nome") as string;
  const desc = formData.get("desc") as string;
  const preco = parseFloat(formData.get("preco") as string);
  const estoque = parseInt(formData.get("estoque") as string, 10);
  const categoria = formData.get("categoria") as string;
  const tipo = formData.get("tipo") as string || "paes";
  const tag = formData.get("tag") as string | null;
  const imageFile = formData.get("imagem") as File | null;

  let imagemUrl = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80";

  if (imageFile && imageFile.size > 0) {
    imagemUrl = await saveImage(imageFile);
  } else {
    const imagemText = formData.get("imagemUrl") as string;
    if (imagemText) imagemUrl = imagemText;
  }

  await prisma.product.create({
    data: {
      nome,
      desc,
      preco,
      estoque,
      categoria,
      tipo,
      tag,
      imagem: imagemUrl,
      ordemExibicao: 999,
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/estoque");
  revalidatePath("/admin");
}

export async function updateProduto(formData: FormData) {
  const id = parseInt(formData.get("id") as string, 10);
  const nome = formData.get("nome") as string;
  const preco = parseFloat(formData.get("preco") as string);
  const estoque = parseInt(formData.get("estoque") as string, 10);
  const categoria = formData.get("categoria") as string;
  const tipo = formData.get("tipo") as string || "paes";
  const imageFile = formData.get("imagem") as File | null;

  const dataToUpdate: Prisma.ProductUpdateInput = {
    nome,
    preco,
    estoque,
    categoria,
    tipo,
  };

  if (imageFile && imageFile.size > 0) {
    dataToUpdate.imagem = await saveImage(imageFile);
  }

  await prisma.product.update({
    where: { id },
    data: dataToUpdate,
  });

  revalidatePath("/");
  revalidatePath("/admin/estoque");
  revalidatePath("/admin");
}

export async function reorderProdutos(updates: { id: number; ordemExibicao: number }[]) {
  const queries = updates.map((update) => 
    prisma.product.update({
      where: { id: update.id },
      data: { ordemExibicao: update.ordemExibicao }
    })
  );

  await prisma.$transaction(queries);

  revalidatePath("/");
  revalidatePath("/admin/estoque");
}

export async function deleteProduto(id: number) {
  await prisma.product.delete({
    where: { id }
  });

  revalidatePath("/");
  revalidatePath("/admin/estoque");
  revalidatePath("/admin");
}
