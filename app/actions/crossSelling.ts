"use server";

import prisma from "@/lib/prisma";

export async function getCrossSellingRecommendations(cartItemIds: number[]) {
  try {
    const availableProducts = await prisma.product.findMany({
      where: {
        estoque: { gt: 0 },
        id: { notIn: cartItemIds }
      }
    });

    if (availableProducts.length === 0) return [];

    const cartProducts = await prisma.product.findMany({
      where: { id: { in: cartItemIds } },
      select: { nome: true, tipo: true }
    });

    const isSaltyOrBread = (name: string) => /pão|salgado|esfiha|baguete|croissant|empada/i.test(name);
    const isSweet = (name: string) => /bolo|sonho|doce|rosca|tartelette|chocolate/i.test(name);
    const isBeverage = (name: string) => /suco|café|cappuccino|bebida|chá/i.test(name);

    let saltyCount = 0;
    let sweetCount = 0;
    let beverageCount = 0;

    cartProducts.forEach(p => {
      if (isSaltyOrBread(p.nome)) saltyCount++;
      if (isSweet(p.nome)) sweetCount++;
      if (isBeverage(p.nome)) beverageCount++;
    });

    const availableSalty = availableProducts.filter(p => isSaltyOrBread(p.nome));
    const availableSweet = availableProducts.filter(p => isSweet(p.nome));
    const availableBeverages = availableProducts.filter(p => isBeverage(p.nome));

    const getRandom = <T>(arr: T[]): T | null => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

    const recommendations: typeof availableProducts = [];

    if (saltyCount > sweetCount) {
      const sweet = getRandom(availableSweet);
      const bev = getRandom(availableBeverages);
      if (sweet) recommendations.push(sweet);
      if (bev) recommendations.push(bev);
    } else if (sweetCount > saltyCount) {
      const salty = getRandom(availableSalty);
      const bev = getRandom(availableBeverages);
      if (salty) recommendations.push(salty);
      if (bev) recommendations.push(bev);
    } else {
      const salty = getRandom(availableSalty);
      const sweet = getRandom(availableSweet);
      if (salty) recommendations.push(salty);
      if (sweet) recommendations.push(sweet);
    }

    const fillGaps = () => {
      const allShuffled = availableProducts.sort(() => 0.5 - Math.random());
      for (const p of allShuffled) {
        if (recommendations.length >= 2) break;
        if (!recommendations.find(r => r.id === p.id)) {
          recommendations.push(p);
        }
      }
    };
    
    fillGaps();

    return recommendations.slice(0, 2);

  } catch (error) {
    console.error("Erro ao buscar cross-selling:", error);
    return [];
  }
}
