"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getLucroData() {
  const session = await auth();
  if (!session) throw new Error("Não autorizado");

  const products = await prisma.product.findMany({
    include: { recipes: { include: { ingredient: true } } }
  });

  const costMap: Record<string, number> = {};
  products.forEach(p => {
    let cost = 0;
    p.recipes.forEach(r => {
      cost += r.quantidade * r.ingredient.custo;
    });

    const rendimento = p.rendimento || 1;
    costMap[p.nome.trim().toLowerCase()] = cost / rendimento;
  });

  const orders = await prisma.order.findMany({
    include: {
      items: true
    },
    where: {
      status: "CONCLUIDO"
    }
  });

  let totalFaturamento = 0;
  let totalCusto = 0;
  let itemsData: Record<string, { nome: string; quantidadeVendida: number; receita: number; custo: number }> = {};

  orders.forEach(order => {
    order.items.forEach(item => {
      const currentCost = costMap[item.nome.trim().toLowerCase()] || 0;
      
      totalFaturamento += item.preco * item.quantidade;
      totalCusto += currentCost * item.quantidade;
      
      if (!itemsData[item.nome]) {
        itemsData[item.nome] = { nome: item.nome, quantidadeVendida: 0, receita: 0, custo: 0 };
      }
      itemsData[item.nome].quantidadeVendida += item.quantidade;
      itemsData[item.nome].receita += item.preco * item.quantidade;
      itemsData[item.nome].custo += currentCost * item.quantidade;
    });
  });

  const lucroBruto = totalFaturamento - totalCusto;
  const margemPercentual = totalFaturamento > 0 ? (lucroBruto / totalFaturamento) * 100 : 0;

  const produtosFormatados = Object.values(itemsData).map(p => ({
    ...p,
    lucro: p.receita - p.custo,
    margem: p.receita > 0 ? ((p.receita - p.custo) / p.receita) * 100 : 0
  })).sort((a, b) => b.lucro - a.lucro);

  return {
    totalFaturamento,
    totalCusto,
    lucroBruto,
    margemPercentual,
    produtos: produtosFormatados
  };
}
