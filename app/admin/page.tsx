import prisma from "@/lib/prisma";
import { Clock, TrendingUp, PackageCheck, DollarSign } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  
  const formattedRevenue = `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-[#1A110C] mb-2">Visão Geral</h1>
        <p className="text-[#1A110C]/60">Acompanhe o desempenho da padaria e os pedidos recentes.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#1A110C]/5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A110C]/50 uppercase tracking-wider mb-1">Receita Fictícia</p>
            <p className="text-2xl font-bold text-[#1A110C]">{formattedRevenue}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#1A110C]/5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--color-pao-dourado)]/20 flex items-center justify-center text-[var(--color-pao-escuro)]">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A110C]/50 uppercase tracking-wider mb-1">Total de Pedidos</p>
            <p className="text-2xl font-bold text-[#1A110C]">{totalOrders}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#1A110C]/5 flex items-center gap-4 opacity-50">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A110C]/50 uppercase tracking-wider mb-1">Tempo Médio</p>
            <p className="text-2xl font-bold text-[#1A110C]">15 min</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#1A110C]/5 flex items-center gap-4 opacity-50">
          <div className="w-14 h-14 rounded-full bg-[var(--color-terracota)]/10 flex items-center justify-center text-[var(--color-terracota)]">
            <PackageCheck className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A110C]/50 uppercase tracking-wider mb-1">Estoque Crítico</p>
            <p className="text-2xl font-bold text-[#1A110C]">0 itens</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-[#1A110C]/5 overflow-hidden">
        <div className="p-6 border-b border-[#1A110C]/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#1A110C]">Pedidos Recentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FDFBF7] text-[#1A110C]/50 text-xs uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">Ticket</th>
                <th className="px-6 py-4 font-bold">Cliente</th>
                <th className="px-6 py-4 font-bold">Itens</th>
                <th className="px-6 py-4 font-bold">Total</th>
                <th className="px-6 py-4 font-bold">Data</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A110C]/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#1A110C]/40 font-medium">
                    Nenhum pedido recebido ainda.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-[var(--color-terracota)]">
                        #{order.id.toString().padStart(4, '0')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1A110C]">{order.customerName}</p>
                      <p className="text-xs text-[#1A110C]/50">{order.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[200px]">
                        {order.items.map(item => (
                          <div key={item.id} className="text-sm text-[#1A110C]/80 truncate">
                            {item.quantidade}x {item.nome}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-[#1A110C]">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1A110C]/60">
                      {new Date(order.createdAt).toLocaleString('pt-BR', { 
                        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
