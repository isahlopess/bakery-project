"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DollarSign, TrendingUp, Clock, PackageCheck, Sun, Moon, Sunset, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DashboardClientProps {
  totalRevenue: number;
  totalOrders: number;
  lowStockCount: number;
  recentOrders: {
    id: number;
    customerName: string;
    customerPhone: string | null;
    total: number;
    status: string;
    createdAt: string;
    items: { id: number; nome: string; quantidade: number }[];
  }[];
  dailySales: number[];
  insightText: string;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Bom dia", icon: Sun, desc: "Hora de abrir as fornalhas!" };
  if (hour < 18) return { text: "Boa tarde", icon: Sunset, desc: "O movimento está a todo vapor." };
  return { text: "Boa noite", icon: Moon, desc: "Bom descanso, até amanhã cedo!" };
}

function AnimatedCounter({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  if (prefix === "R$ ") {
    return <>{prefix}{display.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")},00</>;
  }
  return <>{prefix}{display}</>;
}

function SalesChart({ data }: { data: number[] }) {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const today = new Date().getDay();
  const categories = data.map((_, i) => days[(today - (data.length - 1 - i) + 7) % 7]);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "45%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#1A110C",
          cssClass: "opacity-50 font-bold",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#1A110C",
          cssClass: "opacity-35 font-bold",
        },
        formatter: (val) => Math.round(val).toString(),
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#D9A05B"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    colors: ["#B5572B"],
    grid: {
      borderColor: "rgba(26, 17, 12, 0.06)",
      strokeDashArray: 4,
      yaxis: {
        lines: { show: true },
      },
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const val = series[seriesIndex][dataPointIndex];
        const category = w.globals.labels[dataPointIndex];
        return `
          <div class="px-4 py-3 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-[#1A110C]/10" style="backdrop-filter: blur(12px);">
            <div class="flex items-center gap-2 mb-1">
              <span class="w-2 h-2 rounded-full bg-[#D9A05B]"></span>
              <span class="text-xs font-bold text-[#1A110C]/60 uppercase tracking-wider">${category}</span>
            </div>
            <p class="text-lg font-bold text-[#1A110C] leading-none">${val} pedido${val !== 1 ? 's' : ''}</p>
          </div>
        `;
      },
    },
  };

  const series = [
    {
      name: "Vendas",
      data: data,
    },
  ];

  return (
    <div className="w-full h-full -ml-4">
      <ReactApexChart options={options} series={series} type="bar" height="100%" />
    </div>
  );
}

const statusColors: Record<string, string> = {
  NOVO: "bg-blue-100 text-blue-700",
  PREPARANDO: "bg-amber-100 text-amber-700",
  PRONTO: "bg-teal-100 text-teal-700",
  CONCLUIDO: "bg-[#1A110C]/5 text-[#1A110C]/50",
};

const statusLabels: Record<string, string> = {
  NOVO: "Novo",
  PREPARANDO: "Preparando",
  PRONTO: "Pronto",
  CONCLUIDO: "Concluído",
};

export default function DashboardClient({
  totalRevenue,
  totalOrders,
  lowStockCount,
  recentOrders,
  dailySales,
  insightText,
}: DashboardClientProps) {
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;
  const [visibleCount, setVisibleCount] = useState(10);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    {
      label: "Receita Total",
      value: totalRevenue,
      prefix: "R$ ",
      icon: DollarSign,
      bgClass: "bg-gradient-to-br from-emerald-600 to-teal-500",
      iconBg: "bg-white/20",
      iconColor: "text-white",
      textColor: "text-white",
      labelColor: "text-white/80",
    },
    {
      label: "Total de Pedidos",
      value: totalOrders,
      prefix: "",
      icon: TrendingUp,
      bgClass: "bg-gradient-to-br from-orange-500 to-amber-500",
      iconBg: "bg-white/20",
      iconColor: "text-white",
      textColor: "text-white",
      labelColor: "text-white/80",
    },
    {
      label: "Tempo Médio",
      value: 15,
      prefix: "",
      suffix: " min",
      icon: Clock,
      bgClass: "bg-gradient-to-br from-blue-600 to-indigo-500",
      iconBg: "bg-white/20",
      iconColor: "text-white",
      textColor: "text-white",
      labelColor: "text-white/80",
    },
    {
      label: "Estoque Crítico",
      value: lowStockCount,
      prefix: "",
      icon: PackageCheck,
      bgClass: "bg-gradient-to-br from-red-600 to-rose-500",
      iconBg: "bg-white/20",
      iconColor: "text-white",
      textColor: "text-white",
      labelColor: "text-white/80",
    },
  ];

  const activeExtratoOrders = recentOrders.filter((o) => o.status !== "CONCLUIDO");

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const last7DaysOrders = recentOrders.filter(order => {
    const d = new Date(order.createdAt);
    return d >= sevenDaysAgo;
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex items-center gap-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-pao-dourado)]/20 to-[var(--color-terracota)]/10 flex items-center justify-center">
          <GreetingIcon className="w-7 h-7 text-[var(--color-pao-dourado)]" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1A110C]">{greeting.text}, Admin</h1>
          <p className="text-[#1A110C]/50 text-sm">{greeting.desc}</p>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative overflow-hidden ${stat.bgClass} p-6 rounded-3xl shadow-md transition-transform hover:-translate-y-1 duration-300 group`}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${stat.iconBg} flex items-center justify-center ${stat.iconColor} backdrop-blur-sm`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <p className={`text-xs font-bold ${stat.labelColor} uppercase tracking-wider mb-1`}>{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>
                    <AnimatedCounter value={stat.value} prefix={stat.prefix} />
                    {stat.suffix || ""}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 glass-panel rounded-3xl p-6 flex flex-col"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#1A110C] mb-1">Vendas da Semana</h2>
              <p className="text-sm text-[#1A110C]/40">Pedidos nos últimos 7 dias</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-3 max-w-xl w-full sm:w-auto">
              <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600 flex-shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-0.5">Insight Automático</p>
                <p className="text-xs text-emerald-600/90 leading-relaxed">
                  {insightText}
                </p>
              </div>
            </div>
          </div>
          <div className="h-64 flex-1">
            <SalesChart data={dailySales} />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#FFFAF0] rounded-t-xl p-6 shadow-[0_4px_15px_rgba(26,17,12,0.05)] border border-[#1A110C]/10 border-b-0 relative mb-4"
        >
          <div className="absolute left-0 right-0 top-full h-3 bg-repeat-x z-10" style={{ backgroundImage: "linear-gradient(-45deg, transparent 75%, #FFFAF0 75%), linear-gradient(45deg, transparent 75%, #FFFAF0 75%)", backgroundSize: "12px 12px" }} />
          <div className="text-center border-b-2 border-dashed border-[#1A110C]/20 pb-4 mb-6">
            <h2 className="text-xl font-bold text-[#1A110C] font-mono uppercase tracking-widest">Extrato</h2>
            <p className="text-xs text-[#1A110C]/40 font-mono mt-1">Últimas Movimentações</p>
          </div>
          <div className="space-y-4 font-mono">
            {activeExtratoOrders.slice(0, 5).map((order, i) => (
              <div key={order.id} className="flex items-start gap-3 relative">
                {i < Math.min(activeExtratoOrders.length, 5) - 1 && (
                  <div className="absolute left-[11px] top-7 w-[2px] h-[calc(100%+4px)] bg-[#1A110C]/5" />
                )}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  order.status === "NOVO" ? "bg-blue-100" : order.status === "PREPARANDO" ? "bg-amber-100" : "bg-emerald-100"
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    order.status === "NOVO" ? "bg-blue-500" : order.status === "PREPARANDO" ? "bg-amber-500" : "bg-emerald-500"
                  }`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#1A110C] truncate">
                    <span className="text-[var(--color-terracota)]">#{order.id.toString().padStart(4, "0")}</span>
                    {" "}{order.customerName.toUpperCase()}
                  </p>
                  <p className="text-xs text-[#1A110C]/50">
                    {mounted ? new Date(order.createdAt).toLocaleString("pt-BR", {
                      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
                    }) : "..."}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#1A110C]/80 whitespace-nowrap">
                  R$ {order.total.toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}
            {activeExtratoOrders.length === 0 && (
              <p className="text-sm text-[#1A110C]/40 text-center py-8">Nenhum pedido pendente no momento.</p>
            )}
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="flex justify-start md:justify-center mb-10 overflow-x-auto pb-4 custom-scrollbar"
      >
        <div className="inline-flex items-center gap-1 p-2 bg-white/40 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgba(26,17,12,0.04)] border border-white/60 relative group/container whitespace-nowrap">
          {[
            { label: "Novo Pedido", icon: PackageCheck, color: "text-emerald-700", hoverBg: "hover:bg-emerald-50", iconBg: "bg-emerald-100", href: "/" },
            { label: "Atualizar Estoque", icon: TrendingUp, color: "text-amber-700", hoverBg: "hover:bg-amber-50", iconBg: "bg-amber-100", href: "/admin/estoque" },
            { label: "Relatórios", icon: DollarSign, color: "text-blue-700", hoverBg: "hover:bg-blue-50", iconBg: "bg-blue-100", href: "/admin" },
            { label: "Suporte", icon: Clock, color: "text-purple-700", hoverBg: "hover:bg-purple-50", iconBg: "bg-purple-100", href: "/admin/configuracoes" },
          ].map((action, i) => (
            <div key={i} className="flex items-center">
              <Link 
                href={action.href} 
                className={`relative flex items-center gap-3 p-2 pr-3 rounded-full transition-all duration-500 ease-out group peer ${action.hoverBg}`}
              >
                <div className={`w-12 h-12 rounded-full ${action.iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-300`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <div className="overflow-hidden max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 group-hover:pl-1 transition-all duration-500 ease-out">
                  <span className="font-bold text-[#1A110C] text-sm block tracking-wide">
                    {action.label}
                  </span>
                </div>
              </Link>
              {i < 3 && (
                <div className="w-6 h-[2px] bg-[#1A110C]/10 mx-1 rounded-full relative overflow-hidden transition-colors duration-500">
                  <div className="absolute inset-0 w-full h-full bg-[var(--color-terracota)] -translate-x-full peer-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-panel rounded-3xl overflow-hidden"
      >
        <div className="p-6 border-b border-[#1A110C]/5 flex justify-between items-center bg-white/30 backdrop-blur-sm">
          <h2 className="text-xl font-serif font-bold text-[#1A110C]">Pedidos Recentes</h2>
          <div className="bg-[#1A110C]/5 px-3 py-1.5 rounded-full border border-[#1A110C]/10 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--color-terracota)] animate-pulse"></span>
            <span className="text-[11px] font-bold text-[#1A110C]/70 uppercase tracking-wider">{totalOrders} no total</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-creme)]/50 text-[#1A110C]/40 text-xs uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">Ticket</th>
                <th className="px-6 py-4 font-bold">Cliente</th>
                <th className="px-6 py-4 font-bold hidden md:table-cell">Itens</th>
                <th className="px-6 py-4 font-bold">Total</th>
                <th className="px-6 py-4 font-bold hidden sm:table-cell">Data</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A110C]/5">
              {last7DaysOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-[#1A110C]/40 font-medium">
                    Nenhum pedido recebido nos últimos 7 dias.
                  </td>
                </tr>
              ) : (
                last7DaysOrders.slice(0, visibleCount).map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--color-creme)]/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-[var(--color-terracota)]">
                        #{order.id.toString().padStart(4, "0")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1A110C] text-sm">{order.customerName}</p>
                      <p className="text-xs text-[#1A110C]/40">{order.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="max-w-[200px]">
                        {order.items.map((item) => (
                          <div key={item.id} className="text-sm text-[#1A110C]/70 truncate">
                            {item.quantidade}x {item.nome}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-[#1A110C] text-sm">
                      R$ {order.total.toFixed(2).replace(".", ",")}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1A110C]/50 hidden sm:table-cell">
                      {mounted ? new Date(order.createdAt).toLocaleString("pt-BR", {
                        day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
                      }) : "..."}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {visibleCount < last7DaysOrders.length && (
            <div className="p-4 border-t border-[#1A110C]/5 flex justify-center bg-white/50">
              <button 
                onClick={() => setVisibleCount(prev => prev + 10)}
                className="px-6 py-2 rounded-full border border-[#1A110C]/10 text-sm font-bold text-[#1A110C]/60 hover:bg-[#1A110C]/5 hover:text-[#1A110C] transition-colors"
              >
                Carregar mais pedidos recentes
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
