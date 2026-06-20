"use server";

import prisma from "@/lib/prisma";

export async function getRevenueData(daysLimit = 7) {
  const settings = await prisma.storeSettings.findFirst() || { openTime: "06:00", closeTime: "20:00" };
  const openHour = parseInt(settings.openTime.split(":")[0]);
  const closeHour = parseInt(settings.closeTime.split(":")[0]);

  const cutoff = new Date();
  if (daysLimit === 1) {
    cutoff.setHours(0, 0, 0, 0);
  } else {
    cutoff.setDate(cutoff.getDate() - (daysLimit - 1));
    cutoff.setHours(0, 0, 0, 0);
  }
  
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
      const orderDate = new Date(order.createdAt);
      const h = orderDate.getHours();
      const hStr = `${h.toString().padStart(2, '0')}:00`;
      if (revenueMap[hStr] !== undefined) {
        revenueMap[hStr] += order.total;
        ordersMap[hStr]++;
      }
    });
  } else {
    for (let i = daysLimit - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      categories.push(dateString);
      revenueMap[dateString] = 0;
      ordersMap[dateString] = 0;
    }
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const dateString = `${orderDate.getDate().toString().padStart(2, '0')}/${(orderDate.getMonth() + 1).toString().padStart(2, '0')}`;
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
  const settings = await prisma.storeSettings.findFirst() || { openTime: "06:00", closeTime: "20:00" };
  const openHour = parseInt(settings.openTime.split(":")[0]);
  const closeHour = parseInt(settings.closeTime.split(":")[0]);

  const cutoff = new Date();
  if (daysLimit === 1) {
    cutoff.setHours(0, 0, 0, 0);
  } else {
    cutoff.setDate(cutoff.getDate() - (daysLimit - 1));
    cutoff.setHours(0, 0, 0, 0);
  }

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: cutoff } },
    select: { createdAt: true }
  });

  const currentHour = new Date().getHours();
  
  const hourCounts: Record<number, number> = {};
  
  for (let i = openHour; i <= closeHour; i++) {
    hourCounts[i] = 0;
  }

  orders.forEach(order => {
    const orderDate = new Date(order.createdAt);
    const hour = orderDate.getHours();
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
  const currentOrders = isStoreOpen ? (hourCounts[currentHour] || 0) : 0;
  
  let currentHeat = 0;
  if (maxOrders > 0 && isStoreOpen) {
    currentHeat = Math.round((currentOrders / maxOrders) * 100);
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
  const cutoff = new Date();
  if (daysLimit === 1) cutoff.setHours(0, 0, 0, 0);
  else { cutoff.setDate(cutoff.getDate() - (daysLimit - 1)); cutoff.setHours(0, 0, 0, 0); }

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
  const cutoff = new Date();
  if (daysLimit === 1) cutoff.setHours(0, 0, 0, 0);
  else { cutoff.setDate(cutoff.getDate() - (daysLimit - 1)); cutoff.setHours(0, 0, 0, 0); }

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
  const cutoff = new Date();
  if (daysLimit === 1) cutoff.setHours(0, 0, 0, 0);
  else { cutoff.setDate(cutoff.getDate() - (daysLimit - 1)); cutoff.setHours(0, 0, 0, 0); }

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
