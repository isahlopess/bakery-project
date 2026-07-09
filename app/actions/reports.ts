"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

function getLocalHour(date: Date) {
  return new Date(date.getTime() - 3 * 60 * 60 * 1000).getUTCHours();
}

function getLocalCurrentHour() {
  return new Date(Date.now() - 3 * 60 * 60 * 1000).getUTCHours();
}

function getLocalCutoff(daysLimit: number) {
  const cutoff = new Date(Date.now() - 3 * 60 * 60 * 1000);
  if (daysLimit === 1) {
    cutoff.setUTCHours(0, 0, 0, 0);
  } else {
    cutoff.setUTCDate(cutoff.getUTCDate() - (daysLimit - 1));
    cutoff.setUTCHours(0, 0, 0, 0);
  }
  return new Date(cutoff.getTime() + 3 * 60 * 60 * 1000);
}

export async function getRevenueData(daysLimit = 7) {
  const session = await auth();
  if (!session) throw new Error("Não autorizado");

  const settings = await prisma.storeSettings.findFirst() || { openTime: "06:00", closeTime: "20:00" };
  const openHour = parseInt(settings.openTime.split(":")[0]);
  const closeHour = parseInt(settings.closeTime.split(":")[0]);

  const cutoff = getLocalCutoff(daysLimit);
  
  const orders = await prisma.order.findMany({
    where: {
      status: "CONCLUIDO",
      createdAt: { gte: cutoff }
    },
    select: { total: true, createdAt: true }
  });

  const categories: string[] = [];
  const revenueMap: Record<string, number> = {};
  const ordersMap: Record<string, number> = {};
  
  if (daysLimit === 1) {
    for (let i = openHour; i <= closeHour; i++) {
      const hStr = `${i.toString().padStart(2, '0')}:00`;
      categories.push(hStr);
      revenueMap[hStr] = 0;
      ordersMap[hStr] = 0;
    }
    orders.forEach(order => {
      const h = getLocalHour(order.createdAt);
      const hStr = `${h.toString().padStart(2, '0')}:00`;
      if (revenueMap[hStr] !== undefined) {
        revenueMap[hStr] += order.total;
        ordersMap[hStr]++;
      }
    });
  } else {
    for (let i = daysLimit - 1; i >= 0; i--) {
      const d = new Date(Date.now() - 3 * 60 * 60 * 1000);
      d.setUTCDate(d.getUTCDate() - i);
      const dateString = `${d.getUTCDate().toString().padStart(2, '0')}/${(d.getUTCMonth() + 1).toString().padStart(2, '0')}`;
      categories.push(dateString);
      revenueMap[dateString] = 0;
      ordersMap[dateString] = 0;
    }
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt.getTime() - 3 * 60 * 60 * 1000);
      const dateString = `${orderDate.getUTCDate().toString().padStart(2, '0')}/${(orderDate.getUTCMonth() + 1).toString().padStart(2, '0')}`;
      if (revenueMap[dateString] !== undefined) {
        revenueMap[dateString] += order.total;
        ordersMap[dateString]++;
      }
    });
  }

  return {
    categories,
    series: categories.map(c => revenueMap[c]),
    ordersSeries: categories.map(c => ordersMap[c])
  };
}

export async function getPeakHours(daysLimit = 30) {
  const session = await auth();
  if (!session) throw new Error("Não autorizado");

  const settings = await prisma.storeSettings.findFirst() || { openTime: "06:00", closeTime: "20:00" };
  const openHour = parseInt(settings.openTime.split(":")[0]);
  const closeHour = parseInt(settings.closeTime.split(":")[0]);

  const cutoff = getLocalCutoff(daysLimit);

  const orders = await prisma.order.findMany({
    where: { status: "CONCLUIDO", createdAt: { gte: cutoff } },
    select: { createdAt: true }
  });

  const currentHour = getLocalCurrentHour();
  
  const hourCounts: Record<number, number> = {};
  
  for (let i = openHour; i <= closeHour; i++) {
    hourCounts[i] = 0;
  }

  orders.forEach(order => {
    const hour = getLocalHour(order.createdAt);
    if (daysLimit === 1 && hour > currentHour) return;
    
    if (hourCounts[hour] !== undefined) hourCounts[hour]++;
  });

  let peakHour = openHour;
  let maxOrders = 0;
  for (let i = openHour; i <= closeHour; i++) {
    if (hourCounts[i] > maxOrders) {
      maxOrders = hourCounts[i];
      peakHour = i;
    }
  }

  const isStoreOpen = currentHour >= openHour && currentHour <= closeHour;
  
  let currentHeat = 0;
  
  if (daysLimit === 1) {
    const endHour = Math.min(currentHour, closeHour);
    if (currentHour >= openHour) {
      const hoursElapsed = Math.max(1, endHour - openHour + 1);
      let sumSoFar = 0;
      for (let i = openHour; i <= endHour; i++) {
          sumSoFar += (hourCounts[i] || 0);
      }
      const avgSoFar = sumSoFar / hoursElapsed;
      if (maxOrders > 0) {
          currentHeat = Math.round((avgSoFar / maxOrders) * 100);
      }
    }
  } else {
    const numOpenHours = closeHour - openHour + 1;
    let totalOrdersCount = 0;
    for (let i = openHour; i <= closeHour; i++) {
        totalOrdersCount += (hourCounts[i] || 0);
    }
    const avgOrders = totalOrdersCount / numOpenHours;
    if (maxOrders > 0) {
        currentHeat = Math.round((avgOrders / maxOrders) * 100);
    }
  }

  const heatmapData = Object.entries(hourCounts).map(([hour, count]) => ({
    x: `${hour}h`,
    y: count
  }));

  return {
    heatmapData: heatmapData,
    peakHour: `${peakHour.toString().padStart(2, '0')}:00`,
    currentHourStr: `${currentHour.toString().padStart(2, '0')}:00`,
    currentHeat,
    maxOrders,
    isStoreOpen
  };
}

export async function getAverageProcessTime(daysLimit = 30) {
  const session = await auth();
  if (!session) throw new Error("Não autorizado");

  const cutoff = getLocalCutoff(daysLimit);

  const orders = await prisma.order.findMany({
    where: { status: "CONCLUIDO", createdAt: { gte: cutoff } },
    select: { createdAt: true, updatedAt: true }
  });

  if (orders.length === 0) return 0;

  let totalMinutes = 0;
  orders.forEach(order => {
    const diffMs = new Date(order.updatedAt).getTime() - new Date(order.createdAt).getTime();
    totalMinutes += diffMs / (1000 * 60);
  });

  return Math.round(totalMinutes / orders.length);
}

export async function getProductMetrics(daysLimit = 30) {
  const session = await auth();
  if (!session) throw new Error("Não autorizado");

  const cutoff = getLocalCutoff(daysLimit);

  const items = await prisma.orderItem.findMany({
    where: { order: { createdAt: { gte: cutoff }, status: "CONCLUIDO" } },
    include: { order: true }
  });

  const productCounts: Record<string, { quantity: number, revenue: number }> = {};

  items.forEach(item => {
    if (!productCounts[item.nome]) {
      productCounts[item.nome] = { quantity: 0, revenue: 0 };
    }
    productCounts[item.nome].quantity += item.quantidade;
    productCounts[item.nome].revenue += (item.preco * item.quantidade);
  });

  const sortedProducts = Object.entries(productCounts)
    .map(([nome, data]) => ({ nome, ...data }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return sortedProducts;
}

export async function getGeneralKPIs(daysLimit = 30) {
  const session = await auth();
  if (!session) throw new Error("Não autorizado");

  const cutoff = getLocalCutoff(daysLimit);

  const orders = await prisma.order.findMany({
    where: { status: "CONCLUIDO", createdAt: { gte: cutoff } }
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalRevenue,
    totalOrders,
    averageTicket
  };
}
