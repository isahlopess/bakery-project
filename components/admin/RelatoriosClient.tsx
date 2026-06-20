"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { TrendingUp, Clock, Package, DollarSign, Activity, Flame, Medal, Sparkles, Filter, Download } from "lucide-react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface RelatoriosClientProps {
  revenueData: { categories: string[]; series: number[]; ordersSeries: number[] };
  peakHoursData: { heatmapData: {x: string, y: number}[]; peakHour: string; currentHourStr: string; currentHeat: number; maxOrders: number; isStoreOpen: boolean };
  avgProcessTime: number;
  productMetrics: { nome: string; quantity: number; revenue: number }[];
  generalKPIs: { totalRevenue: number; totalOrders: number; averageTicket: number };
  currentPeriod: string;
}

export default function RelatoriosClient({
  revenueData,
  peakHoursData,
  avgProcessTime,
  productMetrics,
  generalKPIs,
  currentPeriod
}: RelatoriosClientProps) {
  const router = useRouter();

  const isToday = currentPeriod === "1";
  const periodTextInsight = isToday ? "Neste dia" : currentPeriod === "7" ? "Nesta semana" : "Neste mês";

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/admin/relatorios?period=${e.target.value}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const revenueChartOptions: ApexCharts.ApexOptions = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false }, fontFamily: "inherit" },
    colors: ["#B5572B"],
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    xaxis: { categories: revenueData.categories, labels: { style: { colors: "rgba(26, 17, 12, 0.5)", fontWeight: 600 } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (val) => `R$ ${val}`, style: { colors: "rgba(26, 17, 12, 0.5)", fontWeight: 600 } } },
    grid: { borderColor: "rgba(26, 17, 12, 0.05)", strokeDashArray: 4 },
    tooltip: { 
      theme: "light",
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        if (!series || !series[seriesIndex] || series[seriesIndex][dataPointIndex] === undefined) return '';
        const val = series[seriesIndex][dataPointIndex];
        const category = revenueData.categories[dataPointIndex];
        return `
          <div style="padding: 12px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(26, 17, 12, 0.1); border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: rgba(26, 17, 12, 0.5); margin-bottom: 4px;">${isToday ? 'Horário: ' : 'Data: '}${category}</p>
            <p style="font-size: 16px; font-weight: bold; color: #1A110C; font-family: serif;">${formatCurrency(val)}</p>
          </div>
        `;
      }
    }
  };

  const heatmapOptions: ApexCharts.ApexOptions = {
    chart: { type: "heatmap", toolbar: { show: false }, fontFamily: "inherit" },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 4,
        useFillColorAsStroke: false,
        colorScale: {
          ranges: [
            { from: 0, to: 0, name: 'Frio', color: '#FDFBF7' },
            { from: 1, to: 5, name: 'Morno', color: '#fcd34d' },
            { from: 6, to: 15, name: 'Quente', color: '#f59e0b' },
            { from: 16, to: 1000, name: 'Pico', color: '#dc2626' }
          ]
        }
      }
    },
    dataLabels: { enabled: false },
    stroke: { width: 1, colors: ["rgba(26, 17, 12, 0.05)"] },
    xaxis: { labels: { style: { colors: "rgba(26, 17, 12, 0.5)", fontSize: "10px", fontWeight: "bold" } }, axisBorder: { show: false }, axisTicks: { show: false } },
    tooltip: { 
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        const val = series[seriesIndex][dataPointIndex];
        const category = w.globals.labels[dataPointIndex];
        return `
          <div style="padding: 12px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(26, 17, 12, 0.1); border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: rgba(26, 17, 12, 0.5); margin-bottom: 4px;">Horário: ${category}</p>
            <p style="font-size: 16px; font-weight: bold; color: #1A110C; font-family: serif;">${val} pedidos</p>
          </div>
        `;
      }
    }
  };

  const gaugeOptions: ApexCharts.ApexOptions = {
    chart: { type: "radialBar", fontFamily: "inherit" },
    labels: ['Temperatura'],
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: { size: "70%" },
        track: { background: "rgba(26, 17, 12, 0.05)", strokeWidth: "100%" },
        dataLabels: {
          name: { offsetY: 20, color: "rgba(26, 17, 12, 0.5)", fontSize: "12px", fontWeight: "bold" },
          value: { offsetY: -10, color: "#B5572B", fontSize: "36px", fontWeight: "bold", formatter: (val) => `${val}%` }
        }
      }
    },
    fill: { type: "gradient", gradient: { shade: "dark", type: "horizontal", gradientToColors: ["#ef4444"], stops: [0, 100] } },
    stroke: { lineCap: "round" },
    colors: ["#f59e0b"]
  };

  const revenueSparklineOptions: ApexCharts.ApexOptions = {
    chart: { type: "area", sparkline: { enabled: true } },
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.0, stops: [0, 100] } },
    colors: ["#ffffff"],
    tooltip: { 
      theme: "light",
      fixed: { enabled: false },
      x: { show: false },
      y: { formatter: (val) => `R$ ${Math.round(val)}`, title: { formatter: () => "" } },
      marker: { show: false }
    }
  };

  const ordersSparklineOptions: ApexCharts.ApexOptions = {
    chart: { type: "area", sparkline: { enabled: true } },
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.0, stops: [0, 100] } },
    colors: ["#ffffff"],
    tooltip: { 
      theme: "light",
      fixed: { enabled: false },
      x: { show: false },
      y: { formatter: (val) => `${val} PEDIDOS`, title: { formatter: () => "" } },
      marker: { show: false }
    }
  };
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-[calc(100vh-6rem)] print:bg-white print:p-0">
      <div className="print:hidden space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1A110C] mb-2 print:text-black">Relatórios Avançados</h1>
          <p className="text-[#1A110C]/50 text-sm md:text-base font-medium print:text-gray-500">Análise de métricas, faturamento e fluxo da padaria.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center gap-3 print:hidden">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A110C]/40" />
            <select 
              value={currentPeriod}
              onChange={handlePeriodChange}
              className="pl-9 pr-4 py-2.5 bg-white border border-[#1A110C]/10 rounded-xl text-sm font-bold text-[#1A110C] shadow-sm appearance-none cursor-pointer hover:border-[#1A110C]/30 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-pao-dourado)]"
            >
              <option value="1">Hoje</option>
              <option value="7">Últimos 7 Dias</option>
              <option value="30">Últimos 30 Dias</option>
            </select>
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1A110C] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#2B1B12] transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1A110C] to-[#2B1B12] p-8 md:p-10 text-white shadow-xl flex flex-col justify-between print:break-inside-avoid print:shadow-none print:border print:border-gray-200 print:text-black print:bg-none print:bg-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-terracota)]/20 blur-3xl rounded-full print:hidden" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-pao-dourado)]/10 blur-3xl rounded-full print:hidden" />
          <div className="relative z-10">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md print:bg-gray-100 print:border-gray-300 print:text-gray-700">
               <Sparkles className="w-4 h-4 text-[var(--color-pao-dourado)] print:text-black" />
               Insight Automático
             </div>
             <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 leading-tight print:text-black">
               {periodTextInsight}, o <span className="text-[var(--color-pao-dourado)] print:text-black">{productMetrics[0]?.nome || "seu produto principal"}</span> é o grande destaque.
             </h2>
             <p className="text-white/70 font-medium text-sm md:text-base max-w-xl leading-relaxed print:text-gray-600">
               Sua loja gerou {formatCurrency(generalKPIs.totalRevenue)} em {generalKPIs.totalOrders} pedidos. Com um ticket médio de {formatCurrency(generalKPIs.averageTicket)}, sugerimos criar combos promocionais por volta das {peakHoursData.peakHour} para maximizar os lucros durante o seu horário de pico.
             </p>
          </div>
          <div className="relative z-10 mt-8 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6 print:border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 print:bg-emerald-100 print:text-emerald-700">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 print:text-gray-500">Crescimento</p>
                <p className="font-bold text-white text-sm print:text-black">Saudável</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/10 print:bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 print:bg-blue-100 print:text-blue-700">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 print:text-gray-500">Tempo Médio de Resposta</p>
                <p className="font-bold text-white text-sm print:text-black">{avgProcessTime} min / pedido</p>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-[2.5rem] flex flex-row items-center shadow-xl print:shadow-none print:border print:border-gray-200 print:bg-none relative overflow-hidden">
            <div className="relative z-10 flex flex-col justify-center min-w-0 flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-4 shadow-inner print:bg-emerald-100 print:text-emerald-700 print:shadow-none">
                <DollarSign className="w-6 h-6" />
              </div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/80 mb-1 print:text-gray-500">Receita Total</p>
              <h4 className="text-2xl sm:text-3xl font-bold text-white font-serif truncate print:text-black" title={formatCurrency(generalKPIs.totalRevenue)}>{formatCurrency(generalKPIs.totalRevenue)}</h4>
            </div>
            <div className="flex-1 h-16 ml-4 opacity-80 print:hidden relative z-10 flex items-center">
              {typeof window !== 'undefined' && <Chart options={revenueSparklineOptions} series={[{ data: revenueData.series }]} type="area" height={60} width="100%" />}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-gradient-to-br from-[#B5572B] to-[#8c401f] p-6 rounded-[2.5rem] flex flex-row items-center shadow-xl print:shadow-none print:border print:border-gray-200 print:bg-none relative overflow-hidden">
            <div className="relative z-10 flex flex-col justify-center min-w-0 flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-4 shadow-inner print:bg-orange-100 print:text-orange-700 print:shadow-none">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/80 mb-1 print:text-gray-500">Total de Pedidos</p>
              <h4 className="text-2xl sm:text-3xl font-bold text-white font-serif print:text-black">{generalKPIs.totalOrders} <span className="text-lg font-medium opacity-70 font-sans">concl.</span></h4>
            </div>
            <div className="flex-1 h-16 ml-4 opacity-80 print:hidden relative z-10 flex items-center">
              {typeof window !== 'undefined' && <Chart options={ordersSparklineOptions} series={[{ data: revenueData.ordersSeries }]} type="area" height={60} width="100%" />}
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="glass-panel p-6 md:p-8 rounded-[2.5rem] shadow-sm w-full print:break-inside-avoid print:shadow-none print:border print:border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-[#1A110C] font-serif flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" /> Termômetro de Fluxo da Loja
            </h3>
            <p className="text-sm font-medium text-[#1A110C]/40">Frequência de pedidos em horário comercial ({isToday ? "hoje" : "média do período"})</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#1A110C]/40 mt-4 sm:mt-0">
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-[#FDFBF7] border border-[#1A110C]/10" /> Frio</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-[#fcd34d]" /> Morno</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-[#f59e0b]" /> Quente</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-[#dc2626]" /> Pico</span>
          </div>
        </div>
        <div className="-ml-2 -mb-6 mt-2">
          {typeof window !== 'undefined' && (
            <Chart 
              options={{...heatmapOptions, plotOptions: { heatmap: { radius: 8, shadeIntensity: 0.5, useFillColorAsStroke: false, colorScale: { ranges: [{ from: 0, to: 0, name: 'Frio', color: '#FDFBF7' }, { from: 1, to: 5, name: 'Morno', color: '#fcd34d' }, { from: 6, to: 15, name: 'Quente', color: '#f59e0b' }, { from: 16, to: 1000, name: 'Pico', color: '#dc2626' }] } } }}} 
              series={[{ name: "Intensidade", data: peakHoursData.heatmapData }]} 
              type="heatmap" 
              height={140} 
            />
          )}
        </div>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] shadow-sm print:break-inside-avoid print:shadow-none print:border print:border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#1A110C] font-serif flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--color-terracota)]" /> Faturamento do Período
              </h3>
              <p className="text-sm font-medium text-[#1A110C]/40">{isToday ? "Evolução do faturamento hora a hora hoje" : "Evolução diária da receita de pedidos"}</p>
            </div>
          </div>
          <div className="-ml-4 -mr-2">
             {typeof window !== 'undefined' && (
                <Chart options={revenueChartOptions} series={[{ name: "Receita", data: revenueData.series }]} type="area" height={350} />
             )}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="glass-panel p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center relative overflow-hidden print:break-inside-avoid print:shadow-none print:border print:border-gray-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full print:hidden" />
          <div className="w-full flex items-center justify-between mb-2 z-10">
            <h3 className="text-xl font-bold text-[#1A110C] font-serif flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" /> Temperatura
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 border ${peakHoursData.isStoreOpen ? 'bg-red-100 text-red-600 border-red-200 animate-pulse' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
               {peakHoursData.isStoreOpen ? `Agora: ${peakHoursData.currentHourStr}` : 'Loja Fechada'}
            </span>
          </div>
          <p className="text-sm font-medium text-[#1A110C]/40 w-full mb-6 z-10">Intensidade atual comparada ao {isToday ? "pico do dia" : "pico histórico do período"}</p>
          <div className="w-full flex-1 flex items-center justify-center z-10 -my-4">
            {typeof window !== 'undefined' && (
              <Chart options={gaugeOptions} series={[peakHoursData.currentHeat]} type="radialBar" height={300} />
            )}
          </div>
          <div className="w-full bg-white/60 rounded-2xl p-5 flex items-center justify-between z-10 border border-[#1A110C]/5 print:bg-gray-50">
             <div>
               <p className="text-[10px] font-bold uppercase tracking-wider text-[#1A110C]/40">Horário de Pico</p>
               <p className="text-lg font-bold text-[#1A110C]">{peakHoursData.peakHour}</p>
             </div>
             <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A110C]/40">Recorde/Hora</span>
               <div className="flex items-center gap-1.5 text-red-600 font-bold">
                 <Package className="w-4 h-4" /> {peakHoursData.maxOrders}
               </div>
             </div>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-[#1A110C] font-serif flex items-center gap-2">
              <Medal className="w-6 h-6 text-amber-500" /> Best Sellers do Período
            </h3>
            <p className="text-sm font-medium text-[#1A110C]/40">Estrelas do cardápio baseadas no filtro atual</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {productMetrics[0] ? (
            <div className="lg:col-span-1 relative bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2.5rem] p-8 text-white shadow-xl overflow-hidden print:border print:border-gray-200 print:text-black print:bg-none print:shadow-none flex flex-col justify-between min-h-[300px]">
              <div className="absolute -bottom-10 -right-10 text-white/10 print:hidden">
                <Medal className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/20 text-[10px] font-bold uppercase tracking-wider mb-6 backdrop-blur-md print:bg-amber-100 print:text-amber-800 print:border-amber-200">
                  <Medal className="w-4 h-4 text-amber-200 print:text-amber-600" />
                  O Campeão Absoluto
                </div>
                <h4 className="text-4xl sm:text-5xl font-serif font-bold mb-2 leading-tight print:text-black">{productMetrics[0].nome}</h4>
              </div>
              <div className="relative z-10 mt-8 border-t border-white/20 pt-6 print:border-gray-300">
                <p className="text-xs uppercase tracking-wider font-bold text-amber-200/80 mb-1 print:text-gray-500">Volume Arrecadado</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold print:text-black">{productMetrics[0].quantity} unid.</span>
                  <span className="text-amber-200 font-bold print:text-amber-600">{formatCurrency(productMetrics[0].revenue)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-span-full glass-panel py-12 rounded-3xl flex flex-col items-center justify-center text-[#1A110C]/40 font-bold text-sm">
              <Package className="w-12 h-12 mb-3 opacity-50" />
              Ainda não há dados de vendas no período.
            </div>
          )}
          {productMetrics.length > 1 && (
            <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] shadow-sm flex flex-col gap-4 justify-center print:border print:border-gray-200 print:shadow-none">
              {productMetrics.slice(1).map((product, idx) => {
                const pos = idx + 2;
                const maxQuantity = productMetrics[0].quantity;
                const percent = Math.max(10, Math.round((product.quantity / maxQuantity) * 100));
                return (
                  <div key={pos} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/40 p-4 rounded-2xl hover:bg-white/60 transition-colors border border-[#1A110C]/5 print:bg-white">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0 print:border print:text-black print:bg-gray-100 print:shadow-none ${pos === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-500' : pos === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-700' : 'bg-[#1A110C]/20'}`}>
                        {pos}º
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1A110C] truncate text-base">{product.nome}</p>
                        <div className="flex items-center gap-3 text-[11px] font-bold text-[#1A110C]/50 mt-0.5">
                          <span>{product.quantity} unid.</span>
                          <span className="w-1 h-1 rounded-full bg-[#1A110C]/20" />
                          <span className="text-emerald-600">{formatCurrency(product.revenue)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-48 h-2 bg-[#1A110C]/5 rounded-full overflow-hidden flex-shrink-0 mt-2 sm:mt-0 print:border print:border-gray-200">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${percent}%` }} 
                        transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }} 
                        className={`h-full rounded-full print:bg-gray-400 ${pos === 2 ? 'bg-slate-400' : pos === 3 ? 'bg-orange-500' : 'bg-[#1A110C]/30'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
      </div>
      <div className="hidden print:block print:w-full print:text-black font-sans max-w-[210mm] mx-auto bg-white p-8">
        <div className="border-b-2 border-gray-800 pb-4 mb-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-serif font-bold uppercase tracking-tight">Relatório Financeiro</h1>
              <p className="text-gray-500 font-medium text-[11px] mt-1 tracking-widest">AUDITORIA DE DESEMPENHO</p>
            </div>
            <div className="text-right text-xs text-gray-600 font-medium space-y-1">
              <p>PERÍODO-BASE: <span className="font-bold text-gray-800">{isToday ? "HOJE" : currentPeriod === "7" ? "ÚLTIMOS 7 DIAS" : "ÚLTIMOS 30 DIAS"}</span></p>
              <p>EMISSÃO: {new Date().toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 border-l-4 border-gray-800 pl-2">Resumo Executivo</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="border border-gray-300 p-4 rounded bg-gray-50">
              <p className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Receita Bruta</p>
              <p className="text-xl font-bold font-serif mt-1">{formatCurrency(generalKPIs.totalRevenue)}</p>
            </div>
            <div className="border border-gray-300 p-4 rounded bg-gray-50">
              <p className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Volume de Pedidos</p>
              <p className="text-xl font-bold font-serif mt-1">{generalKPIs.totalOrders}</p>
            </div>
            <div className="border border-gray-300 p-4 rounded bg-gray-50">
              <p className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Ticket Médio</p>
              <p className="text-xl font-bold font-serif mt-1">{formatCurrency(generalKPIs.averageTicket)}</p>
            </div>
            <div className="border border-gray-300 p-4 rounded bg-gray-50">
              <p className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Tempo Méd. Proc.</p>
              <p className="text-xl font-bold font-serif mt-1">{avgProcessTime} <span className="text-xs text-gray-500 font-sans">min</span></p>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 border-l-4 border-gray-800 pl-2">Curva ABC de Produtos (Top 5)</h2>
          <table className="w-full text-left text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-[9px] tracking-widest">
                <th className="border border-gray-300 p-2 text-center w-12">Rnk</th>
                <th className="border border-gray-300 p-2">Produto</th>
                <th className="border border-gray-300 p-2 text-right">Qtd. Vendida</th>
                <th className="border border-gray-300 p-2 text-right">Receita Bruta</th>
                <th className="border border-gray-300 p-2 text-right w-28">Participação (%)</th>
              </tr>
            </thead>
            <tbody>
              {productMetrics.map((prod, idx) => {
                const part = generalKPIs.totalRevenue > 0 ? ((prod.revenue / generalKPIs.totalRevenue) * 100).toFixed(1) : "0.0";
                return (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="border border-gray-300 p-2 font-bold text-center text-xs">{idx + 1}º</td>
                    <td className="border border-gray-300 p-2 font-medium text-xs">{prod.nome}</td>
                    <td className="border border-gray-300 p-2 text-right text-xs">{prod.quantity} un.</td>
                    <td className="border border-gray-300 p-2 text-right font-medium text-xs">{formatCurrency(prod.revenue)}</td>
                    <td className="border border-gray-300 p-2 text-right font-bold text-xs">{part}%</td>
                  </tr>
                );
              })}
              {productMetrics.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500 font-medium">Nenhuma venda registrada no período selecionado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 border-l-4 border-gray-800 pl-2">Diagnóstico Operacional</h2>
          <div className="border border-gray-300 p-5 rounded text-[13px] leading-relaxed text-gray-800 bg-gray-50">
            <p className="mb-3">
              <strong>Comportamento de Fluxo:</strong> A operação apresentou sua maior concentração de tráfego histórico na faixa das <strong>{peakHoursData.peakHour}</strong>, demandando atenção crítica à alocação de equipe (atualmente operando com tempo logístico médio de {avgProcessTime} min/pedido).
            </p>
            <p>
              <strong>Comportamento de Vendas:</strong> {productMetrics[0] ? `O produto central do portfólio neste período foi o "${productMetrics[0].nome}", sendo responsável de forma unitária por uma arrecadação de ${formatCurrency(productMetrics[0].revenue)}.` : "Não houve volume de dados suficientes para montar uma curva de Pareto no período filtrado."} {isToday && "A leitura em vigor compreende acompanhamento faturado hora-a-hora do expediente aberto atual."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
