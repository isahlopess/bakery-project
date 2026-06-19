import prisma from "@/lib/prisma";
import DashboardClient from "@/components/admin/DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const products = await prisma.product.findMany();
  const lowStockCount = products.filter((p) => p.estoque <= 5).length;

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;

  const now = new Date();
  const daysOfWeek = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  
  const salesWithDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(now);
    day.setDate(day.getDate() - (6 - i));
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    const count = orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= day && d < nextDay;
    }).length;
    return { count, dayName: daysOfWeek[day.getDay()] };
  });

  const dailySales = salesWithDays.map((s) => s.count);

  let insightText = "O movimento está começando. Fique de olho nas tendências desta semana para ajustar a produção!";
  const bestDayObj = [...salesWithDays].sort((a, b) => b.count - a.count)[0];
  
  if (bestDayObj && bestDayObj.count > 0) {
    insightText = `O dia de maior movimento foi ${bestDayObj.dayName} com ${bestDayObj.count} pedidos! Uma ótima oportunidade para focar a produção nesse dia da semana.`;
  }

  const serializedOrders = orders.map((o) => ({
    id: o.id,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    total: o.total,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((item) => ({
      id: item.id,
      nome: item.nome,
      quantidade: item.quantidade,
    })),
  }));

  return (
    <DashboardClient
      totalRevenue={totalRevenue}
      totalOrders={totalOrders}
      lowStockCount={lowStockCount}
      recentOrders={serializedOrders}
      dailySales={dailySales}
      insightText={insightText}
    />
  );
}

