"use client";

import { motion } from "motion/react";
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Info, 
  ArrowUpRight, 
  ArrowDownRight, Download, 
  Package,
  Activity,
  Award,
  AlertTriangle,
  Wallet,
  CheckCircle2,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useEffect, useState } from "react";

interface ProductProfit {
  nome: string;
  quantidadeVendida: number;
  receita: number;
  custo: number;
  lucro: number;
  margem: number;
}

interface LucroData {
  totalFaturamento: number;
  totalCusto: number;
  lucroBruto: number;
  margemPercentual: number;
  produtos: ProductProfit[];
}

function useCountUp(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(ease * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
}

export default function LucroClient({ data }: { data: LucroData }) {
  const [marginSort, setMarginSort] = useState<"desc" | "asc" | null>(null);
  const formatMoney = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;
  
  const animatedLucro = useCountUp(data.lucroBruto, 1500);
  const animatedFaturamento = useCountUp(data.totalFaturamento, 1500);
  const animatedCusto = useCountUp(data.totalCusto, 1500);

  const bestProducts = [...data.produtos].sort((a, b) => b.lucro - a.lucro).slice(0, 3);
  const lowestMargin = [...data.produtos].filter(p => p.margem < 50 && p.custo > 0).sort((a, b) => a.margem - b.margem).slice(0, 3);

  const getMarginColor = (margin: number) => {
    if (margin >= 60) return "bg-emerald-500";
    if (margin >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  const getMarginBgColor = (margin: number) => {
    if (margin >= 60) return "bg-emerald-500/10";
    if (margin >= 40) return "bg-amber-500/10";
    return "bg-red-500/10";
  };

  const getMarginTextColor = (margin: number) => {
    if (margin >= 60) return "text-emerald-700";
    if (margin >= 40) return "text-amber-700";
    return "text-red-700";
  };

  const getInsightMessage = (margin: number) => {
    if (margin >= 60) return "Excelente! A lucratividade do negócio está altíssima.";
    if (margin >= 40) return "Margem saudável. O custo está perfeitamente equilibrado.";
    if (margin > 0) return "Atenção: O custo de produção está consumindo boa parte do faturamento.";
    return "Prejuízo: Você está pagando para produzir.";
  };

  const insightColor = data.margemPercentual >= 60 
    ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
    : (data.margemPercentual >= 40 
      ? "text-amber-700 bg-amber-50 border-amber-100" 
      : "text-red-700 bg-red-50 border-red-100");

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto pb-32 print:p-0">
      <style>{`@media print { @page { margin: 10mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}</style>
      <div className="print:hidden space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#1A110C] mb-2">Engenharia Financeira</h1>
          <p className="text-[#1A110C]/60 text-sm md:text-base max-w-xl">
            Acompanhe a inteligência de caixa baseada no CMV (Custo de Mercadoria Vendida). Apenas pedidos CONCLUÍDOS.
          </p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <div className="bg-white/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white shadow-sm print:shadow-none flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A110C]/60">Sincronizado</span>
          </div>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1A110C] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#2B1B12] transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          className="lg:col-span-8 bg-gradient-to-br from-white to-emerald-50/40 print:bg-none print:border-gray-200 rounded-[2rem] p-8 lg:p-10 shadow-sm print:shadow-none border border-emerald-100/30 flex flex-col justify-between"
        >
          <div className="pb-8 relative group border-b border-black/5">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2 text-[#1A110C]/60">
                <Wallet className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Lucro Líquido Real</h3>
              </div>
              <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold ${insightColor}`}>
                <Info className="w-4 h-4" />
                {getInsightMessage(data.margemPercentual)}
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-3xl text-[#1A110C]/30 font-bold">R$</span>
              <span className="text-5xl lg:text-7xl font-mono font-bold text-[#1A110C] tracking-tighter">
                {animatedLucro.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-[#1A110C]/40 text-xs mt-3 font-medium">Livre após todas as deduções de custo de mercadoria.</p>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:gap-12 mt-8">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#1A110C]/50">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Faturamento</h3>
              </div>
              <div className="text-2xl lg:text-3xl font-mono font-bold text-[#1A110C]">
                <span className="text-[#1A110C]/40 text-lg mr-1">R$</span>
                {animatedFaturamento.toFixed(2).replace('.', ',')}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#1A110C]/50">
                <ArrowDownRight className="w-4 h-4 text-red-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Custo de Produção</h3>
              </div>
              <div className="text-2xl lg:text-3xl font-mono font-bold text-[#1A110C]">
                <span className="text-[#1A110C]/40 text-lg mr-1">R$</span>
                {animatedCusto.toFixed(2).replace('.', ',')}
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-4 bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm print:shadow-none border border-black/5 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="w-full flex justify-between items-center mb-6 px-2">
            <h3 className="text-[#1A110C] font-bold text-sm">Composição</h3>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-[10px] font-bold text-[#1A110C]/40 uppercase tracking-widest">Fat</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[10px] font-bold text-[#1A110C]/40 uppercase tracking-widest">Lucro</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-[10px] font-bold text-[#1A110C]/40 uppercase tracking-widest">Custo</span></div>
            </div>
          </div>
          <div className="relative w-full max-w-[260px] aspect-square flex-shrink-0 z-10">
            <svg className="w-full h-full -rotate-90 drop-shadow-xl" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="transparent" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="16" />
              <circle 
                cx="100" cy="100" r="80" fill="transparent" stroke="#3b82f6" strokeWidth="16" 
                strokeDasharray="502.65" strokeDashoffset="0" 
                strokeLinecap="round" 
              />
              <circle cx="100" cy="100" r="58" fill="transparent" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="16" />
              <circle 
                cx="100" cy="100" r="58" fill="transparent" stroke="#10b981" strokeWidth="16" 
                strokeDasharray="364.42" 
                strokeDashoffset={data.totalFaturamento > 0 ? 364.42 * (1 - (data.lucroBruto / data.totalFaturamento)) : 364.42} 
                className="transition-all duration-1500 ease-out" strokeLinecap="round" 
              />
              <circle cx="100" cy="100" r="36" fill="transparent" stroke="rgba(239, 68, 68, 0.1)" strokeWidth="16" />
              <circle 
                cx="100" cy="100" r="36" fill="transparent" stroke="#ef4444" strokeWidth="16" 
                strokeDasharray="226.19" 
                strokeDashoffset={data.totalFaturamento > 0 ? 226.19 * (1 - (data.totalCusto / data.totalFaturamento)) : 226.19} 
                className="transition-all duration-1500 ease-out" strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[#1A110C]/40 text-[8px] uppercase font-bold tracking-widest mb-0.5">Margem</span>
              <div className="flex items-start">
                <span className="text-2xl font-mono font-bold text-[#1A110C] tracking-tighter">{data.margemPercentual.toFixed(1)}</span>
                <span className="text-[#1A110C]/40 text-xs font-bold ml-0.5 mt-0.5">%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[2rem] p-8 lg:p-10 border border-black/5 shadow-sm print:shadow-none">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100/50">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight text-[#1A110C]">Vetores de Crescimento</h2>
              <p className="text-[#1A110C]/50 text-[10px] font-bold uppercase tracking-widest">Top 3 Campeões de Lucro</p>
            </div>
          </div>
          <div className="space-y-3">
            {bestProducts.length > 0 ? bestProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-4 hover:bg-black/[0.02] transition-colors rounded-2xl p-4 border border-black/5">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1A110C] truncate text-sm">{p.nome}</h3>
                  <div className="flex gap-3 mt-1">
                    <span className="text-[10px] uppercase font-bold text-[#1A110C]/40 tracking-wider">{p.quantidadeVendida} unid.</span>
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 tracking-wider">{p.margem.toFixed(0)}% Margem</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-mono font-bold text-[#1A110C] text-lg">{formatMoney(p.lucro)}</div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 bg-black/5 rounded-2xl border border-black/5">
                <p className="font-bold text-[#1A110C]/50">Nenhuma venda registrada.</p>
              </div>
            )}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[2rem] p-8 lg:p-10 border border-red-500/10 shadow-sm print:shadow-none relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center border border-red-100">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1A110C] leading-tight">Zona de Alerta</h2>
              <p className="text-red-500/80 text-[10px] font-bold uppercase tracking-widest">Produtos com Margem Crítica</p>
            </div>
          </div>
          <div className="space-y-3 relative z-10">
            {lowestMargin.length > 0 ? lowestMargin.map((p, i) => (
              <div key={i} className="flex items-center gap-4 bg-white hover:bg-red-50/30 transition-colors rounded-2xl p-4 border border-red-100/50 shadow-sm print:shadow-none">
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 rotate-180" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1A110C] truncate text-sm">{p.nome}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase font-bold text-[#1A110C]/40 tracking-wider">{p.quantidadeVendida} unid.</span>
                    <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 tracking-wider">Atenção</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] font-bold text-[#1A110C]/40 mb-0.5 uppercase tracking-wider">Margem</div>
                  <div className="font-mono font-bold text-red-500">{p.margem.toFixed(0)}%</div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-10 bg-emerald-50/50 rounded-2xl border border-emerald-100 border-dashed">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="font-bold text-emerald-800">Tudo sob controle!</p>
                <p className="text-emerald-600/70 text-xs mt-1">Nenhum produto com margem crítica.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="pt-4">
        <div className="bg-white rounded-[2rem] border border-black/5 shadow-2xl shadow-black/5 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-black/5 flex items-center gap-3 bg-[#FDFBF7]">
            <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#1A110C]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1A110C]">Extrato de Performance de Produtos</h2>
              <p className="text-xs font-bold text-[#1A110C]/40 uppercase tracking-wider mt-0.5">Visão consolidada do fluxo</p>
            </div>
          </div>
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDFBF7]/50 border-b border-black/5">
                  <th className="py-4 px-6 md:px-8 text-[10px] font-bold text-[#1A110C]/40 uppercase tracking-widest whitespace-nowrap">Produto / Item</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-[#1A110C]/40 uppercase tracking-widest whitespace-nowrap">Volume</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-[#1A110C]/40 uppercase tracking-widest whitespace-nowrap text-right">Faturamento</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-[#1A110C]/40 uppercase tracking-widest whitespace-nowrap text-right">Custo Produção</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-[#1A110C]/40 uppercase tracking-widest whitespace-nowrap text-right">Lucro Líquido</th>
                  <th 
                    className="py-4 px-6 md:px-8 text-[10px] font-bold text-[#1A110C]/40 uppercase tracking-widest whitespace-nowrap w-48 cursor-pointer hover:text-[#1A110C] transition-colors group"
                    onClick={() => setMarginSort(marginSort === "desc" ? "asc" : "desc")}
                  >
                    <div className="flex items-center gap-1">
                      Saúde da Margem
                      <div className="flex flex-col">
                        <ArrowUp className={`w-2.5 h-2.5 -mb-1 ${marginSort === "asc" ? "text-emerald-500" : "text-[#1A110C]/20 group-hover:text-[#1A110C]/40"}`} />
                        <ArrowDown className={`w-2.5 h-2.5 ${marginSort === "desc" ? "text-emerald-500" : "text-[#1A110C]/20 group-hover:text-[#1A110C]/40"}`} />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {(() => {
                  let displayProducts = [...data.produtos];
                  if (marginSort === "asc") {
                    displayProducts.sort((a, b) => a.margem - b.margem);
                  } else if (marginSort === "desc") {
                    displayProducts.sort((a, b) => b.margem - a.margem);
                  }
                  return displayProducts.map((p, i) => (

                  <tr key={i} className="hover:bg-black/[0.02] transition-colors group">
                    <td className="py-5 px-6 md:px-8">
                      <span className="font-bold text-[#1A110C] text-sm group-hover:text-[var(--color-pao-dourado)] transition-colors">{p.nome}</span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-sm font-medium text-[#1A110C]/60">{p.quantidadeVendida} un</span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <span className="font-mono text-sm text-[#1A110C]">{formatMoney(p.receita)}</span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <span className="font-mono text-sm text-red-500/80">{formatMoney(p.custo)}</span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <span className="font-mono font-bold text-sm text-[#1A110C]">{formatMoney(p.lucro)}</span>
                    </td>
                    <td className="py-5 px-6 md:px-8">
                      <div className="flex items-center gap-3">
                        <div className={`text-xs font-bold w-12 text-right ${getMarginTextColor(p.margem)}`}>
                          {p.margem.toFixed(0)}%
                        </div>
                        <div className={`flex-1 h-2 rounded-full overflow-hidden ${getMarginBgColor(p.margem)}`}>
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${getMarginColor(p.margem)}`}
                            style={{ width: `${Math.min(Math.max(p.margem, 0), 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))})()}
                
                {data.produtos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <p className="text-[#1A110C]/40 font-bold">Nenhum dado financeiro disponível ainda.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
      </div>
      <div className="hidden print:block bg-white text-black font-sans max-w-5xl mx-auto">
        <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest text-black">Relatório Financeiro</h1>
            <p className="text-sm text-gray-500">Padaria - Engenharia de Cardápio</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-black">Data de Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
            <p className="text-xs text-gray-500">Somente pedidos CONCLUÍDOS</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="border border-gray-300 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Faturamento Bruto</p>
            <p className="text-lg font-bold text-black">{formatMoney(data.totalFaturamento)}</p>
          </div>
          <div className="border border-gray-300 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Custo de Produção</p>
            <p className="text-lg font-bold text-black">{formatMoney(data.totalCusto)}</p>
          </div>
          <div className="border border-gray-300 p-4 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Lucro Líquido</p>
            <p className="text-lg font-bold text-black">{formatMoney(data.lucroBruto)}</p>
          </div>
          <div className="border border-gray-300 p-4 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Margem Global</p>
            <p className="text-lg font-bold text-black">{data.margemPercentual.toFixed(1)}%</p>
          </div>
        </div>
        <h2 className="text-lg font-bold uppercase mb-4 border-b border-gray-200 pb-2 text-black">Extrato por Produto</h2>
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-black">
              <th className="py-2 px-3 font-bold uppercase">Produto</th>
              <th className="py-2 px-3 font-bold uppercase text-center">Qtd</th>
              <th className="py-2 px-3 font-bold uppercase text-right">Receita</th>
              <th className="py-2 px-3 font-bold uppercase text-right">Custo</th>
              <th className="py-2 px-3 font-bold uppercase text-right">Lucro</th>
              <th className="py-2 px-3 font-bold uppercase text-right">Margem</th>
            </tr>
          </thead>
          <tbody>
            {[...data.produtos].sort((a, b) => {
              if (marginSort === "desc") return b.margem - a.margem;
              if (marginSort === "asc") return a.margem - b.margem;
              return b.lucro - a.lucro;
            }).map((p, idx) => (
              <tr key={idx} className="border-b border-gray-200 text-black">
                <td className="py-2 px-3 font-medium">{p.nome}</td>
                <td className="py-2 px-3 text-center">{p.quantidadeVendida}</td>
                <td className="py-2 px-3 text-right">{formatMoney(p.receita)}</td>
                <td className="py-2 px-3 text-right">{formatMoney(p.custo)}</td>
                <td className="py-2 px-3 text-right font-bold">{formatMoney(p.lucro)}</td>
                <td className="py-2 px-3 text-right font-bold">{p.margem.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-8 text-center text-xs text-gray-400">
          Documento gerado automaticamente pelo Sistema Administrativo.
        </div>
      </div>
    </div>
  );
}