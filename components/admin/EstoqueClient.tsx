"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Package, Plus, Minus, X, Check, AlertTriangle, Layers, TrendingDown, XCircle, Tag, DollarSign, Edit3, Grid } from "lucide-react";
import Image from "next/image";
import { updateProduto } from "@/app/actions/estoque";

interface Product {
  id: number;
  nome: string;
  desc: string;
  preco: number;
  imagem: string;
  estoque: number;
  categoria: string;
}

function getStockStatus(qty: number) {
  if (qty === 0) return { priority: 0, label: "Sem estoque", color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500", icon: XCircle };
  if (qty <= 5) return { priority: 1, label: "Baixo", color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500", icon: TrendingDown };
  return { priority: 2, label: "Normal", color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", icon: Package };
}

function getFoodType(nome: string) {
  const n = nome.toLowerCase();
  if (n.includes("pão doce") || n.includes("bolo") || n.includes("rosca") || n.includes("sonho") || n.includes("doce")) return "Doce";
  if (n.includes("café") || n.includes("cafe") || n.includes("cappuccino") || n.includes("suco") || n.includes("bebida")) return "Bebida";
  return "Salgado";
}

export default function EstoqueClient({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "NORMAL" | "BAIXO" | "ZERADO">("ALL");
  const [filterCategory, setFilterCategory] = useState<"ALL" | "DOCE" | "SALGADO" | "BEBIDA">("ALL");
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQty, setEditQty] = useState(0);
  const [editPrice, setEditPrice] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState<number | null>(null);

  const totalProducts = products.length;
  const normalStock = products.filter(p => p.estoque > 5).length;
  const lowStock = products.filter(p => p.estoque > 0 && p.estoque <= 5).length;
  const outOfStock = products.filter(p => p.estoque === 0).length;

  const healthScore = totalProducts > 0 ? ((normalStock) / totalProducts) * 100 : 0;
  const strokeDasharray = 188;
  const strokeDashoffset = strokeDasharray - (healthScore / 100) * strokeDasharray;

  const filteredAndSorted = products
    .filter((p) => {
      const matchesSearch = p.nome.toLowerCase().includes(search.toLowerCase());
      let matchesStatus = true;
      if (filterStatus === "NORMAL") matchesStatus = p.estoque > 5;
      if (filterStatus === "BAIXO") matchesStatus = p.estoque > 0 && p.estoque <= 5;
      if (filterStatus === "ZERADO") matchesStatus = p.estoque === 0;

      let matchesCategory = true;
      const type = getFoodType(p.nome).toUpperCase();
      if (filterCategory !== "ALL") matchesCategory = type === filterCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      const statA = getStockStatus(a.estoque);
      const statB = getStockStatus(b.estoque);
      if (statA.priority !== statB.priority) {
        return statA.priority - statB.priority;
      }
      return a.nome.localeCompare(b.nome);
    });

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setEditQty(product.estoque);
    setEditPrice(product.preco);
  };

  const handleSave = () => {
    if (editingId === null) return;
    startTransition(async () => {
      await updateProduto(editingId, editQty, editPrice);
      setSaved(editingId);
      setEditingId(null);
      setTimeout(() => setSaved(null), 2000);
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-serif font-bold text-[#1A110C] mb-1">Estoque & Preços</h1>
        <p className="text-[#1A110C]/50 text-sm">Gerencie a disponibilidade e valores dos seus produtos de forma unificada.</p>
      </motion.div>
      <div className="relative mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-3 lg:gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-[#1A110C] text-white p-4 md:p-5 rounded-[1.5rem] shadow-md flex flex-col justify-between group overflow-hidden relative min-h-[100px]">
             <div className="absolute -left-10 -top-10 w-32 h-32 bg-[var(--color-pao-dourado)]/10 rounded-full blur-2xl" />
             <div className="flex items-center gap-1.5 mb-1 relative z-10">
               <Layers className="w-4 h-4 text-[var(--color-pao-dourado)]" />
               <p className="text-[var(--color-pao-dourado)] text-[10px] font-bold uppercase tracking-[0.1em]">Acervo</p>
             </div>
             <div className="relative z-10 flex items-baseline gap-2">
               <h2 className="text-3xl md:text-4xl font-mono font-bold leading-none">{totalProducts}</h2>
               <p className="text-white/50 text-xs font-medium">totais</p>
             </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-emerald-50 border border-emerald-100 p-4 md:p-5 rounded-[1.5rem] shadow-sm flex flex-col items-end text-right justify-between group min-h-[100px]">
             <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
               <Check className="w-4 h-4" />
             </div>
             <div className="flex flex-row-reverse items-baseline gap-2 mt-2">
               <h2 className="text-3xl md:text-4xl font-mono font-bold text-emerald-950">{normalStock}</h2>
               <p className="text-emerald-700/60 text-xs font-medium uppercase tracking-wider">Saudável</p>
             </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-amber-50 border border-amber-100 p-4 md:p-5 rounded-[1.5rem] shadow-sm flex flex-col justify-between group min-h-[100px]">
             <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">
               <TrendingDown className="w-4 h-4" />
             </div>
             <div className="flex items-baseline gap-2 mt-2">
               <h2 className="text-3xl md:text-4xl font-mono font-bold text-amber-950">{lowStock}</h2>
               <p className="text-amber-700/60 text-xs font-medium uppercase tracking-wider">Atenção</p>
             </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-red-50 border border-red-100 p-4 md:p-5 rounded-[1.5rem] shadow-sm flex flex-col items-end text-right justify-between group min-h-[100px]">
             <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_10px_rgba(220,38,38,0.2)]">
               <XCircle className="w-4 h-4" />
             </div>
             <div className="flex flex-row-reverse items-baseline gap-2 mt-2">
               <h2 className="text-3xl md:text-4xl font-mono font-bold text-red-700">{outOfStock}</h2>
               <p className="text-red-700/70 text-xs font-medium uppercase tracking-wider">Esgotados</p>
             </div>
          </motion.div>
        </div>
        <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/80 backdrop-blur-md rounded-full shadow-[0_10px_30px_rgba(26,17,12,0.1)] border-[6px] border-white items-center justify-center flex-col z-20">
          <div className="relative w-24 h-12 overflow-hidden flex flex-col items-center mt-3">
            <svg viewBox="0 0 140 70" className="w-full h-full overflow-visible">
              <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke="currentColor" strokeWidth="16" className="text-[#1A110C]/5" strokeLinecap="round" />
              <path 
                d="M 10 70 A 60 60 0 0 1 130 70" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="16" 
                className={`${healthScore > 80 ? "text-emerald-500" : healthScore > 50 ? "text-amber-500" : "text-red-500"} transition-all duration-1000 ease-out`} 
                strokeLinecap="round" 
                strokeDasharray={strokeDasharray} 
                strokeDashoffset={strokeDashoffset} 
              />
            </svg>
            <div className="absolute bottom-[-2px] flex flex-col items-center">
              <span className="text-xl font-mono font-bold text-[#1A110C] leading-none">{Math.round(healthScore)}%</span>
            </div>
          </div>
          <span className="text-[8px] uppercase font-bold text-[#1A110C]/40 tracking-widest mt-1">Saúde</span>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8 flex flex-col gap-4 glass-panel p-5 rounded-[2rem]"
      >
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A110C]/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto por nome..."
            className="w-full pl-11 pr-4 py-3.5 rounded-[1.25rem] bg-white/60 text-[#1A110C] placeholder-[#1A110C]/40 border border-[#1A110C]/5 focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-4 focus:ring-[var(--color-pao-dourado)]/10 transition-all font-medium shadow-sm"
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 lg:pb-0 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-[#1A110C]/40 mr-2">
              <Grid className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Categoria</span>
            </div>
            <button
              onClick={() => setFilterCategory("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm border ${filterCategory === "ALL" ? "bg-[#1A110C] text-white border-[#1A110C]" : "bg-white/50 text-[#1A110C]/60 border-white hover:bg-white"}`}
            >
              Todos
            </button>
            {[
              { id: "SALGADO", label: "Salgados" },
              { id: "DOCE", label: "Doces" },
              { id: "BEBIDA", label: "Bebidas" },
            ].map(c => (
              <button
                key={c.id}
                onClick={() => setFilterCategory(c.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm border ${filterCategory === c.id ? "bg-[var(--color-pao-dourado)] text-[#1A110C] border-[var(--color-pao-dourado)]" : "bg-white/50 text-[#1A110C]/60 border-white hover:bg-white"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 lg:pb-0 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-[#1A110C]/40 mr-2">
              <Tag className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Status</span>
            </div>
            {[
              { id: "ALL", label: "Todos", color: "bg-[#1A110C] text-white border-[#1A110C]" },
              { id: "NORMAL", label: "Normal", color: "bg-emerald-500 text-white border-emerald-500" },
              { id: "BAIXO", label: "Baixo", color: "bg-amber-500 text-white border-amber-500" },
              { id: "ZERADO", label: "Zerado", color: "bg-red-500 text-white border-red-500" }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm border ${filterStatus === f.id ? f.color : "bg-white/50 text-[#1A110C]/60 border-white hover:bg-white"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredAndSorted.map((product, i) => {
            const status = getStockStatus(product.estoque);
            const wasSaved = saved === product.id;
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`relative glass-panel bg-white/60 p-4 sm:p-5 rounded-[2rem] flex flex-col sm:flex-row gap-5 items-center group overflow-hidden border border-white/60 hover:shadow-xl hover:border-[var(--color-pao-dourado)]/40 transition-all duration-300 ${wasSaved ? "border-emerald-300 ring-4 ring-emerald-500/20" : ""}`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${product.estoque === 0 ? "bg-red-500" : product.estoque <= 5 ? "bg-amber-500" : "bg-[var(--color-terracota)]"}`} />
                <div className="relative w-full h-32 sm:w-24 sm:h-24 rounded-[1.25rem] overflow-hidden flex-shrink-0 shadow-sm">
                  <Image
                    src={product.imagem}
                    alt={product.nome}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    unoptimized={product.imagem.startsWith("/")}
                  />
                  {wasSaved && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-emerald-500/30 backdrop-blur-sm flex items-center justify-center z-10"
                    >
                      <Check className="w-8 h-8 text-white drop-shadow-md" />
                    </motion.div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col w-full text-center sm:text-left">
                  <h3 className="font-bold text-lg text-[#1A110C] truncate mb-1 group-hover:text-[var(--color-terracota)] transition-colors">{product.nome}</h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1">
                    <span className="text-[#1A110C]/50 text-[11px] font-bold uppercase tracking-wider bg-[#1A110C]/5 px-2.5 py-1 rounded-lg">
                      {getFoodType(product.nome)}
                    </span>
                    <span className="font-mono font-bold text-[#1A110C] bg-[#1A110C]/5 px-2.5 py-1 rounded-lg text-sm flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 opacity-50" />
                      {product.preco.toFixed(2).replace('.',',')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-end gap-3 flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                  <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${status.color} flex items-center gap-1.5 shadow-sm`}>
                      <span className={`w-2 h-2 rounded-full ${status.dot} ${product.estoque <= 5 ? "animate-pulse" : ""}`} />
                      {status.label} <span className="opacity-60 ml-1">({product.estoque} un)</span>
                  </div>
                  <button 
                    onClick={() => openEdit(product)} 
                    className="w-full sm:w-auto px-5 py-2.5 bg-white text-[#1A110C] font-bold text-sm rounded-xl shadow-sm border border-[#1A110C]/5 hover:bg-[var(--color-pao-dourado)] hover:text-white hover:border-transparent transition-all hover:shadow-md flex items-center justify-center gap-2 group/btn"
                  >
                      <Edit3 className="w-4 h-4 text-[#1A110C]/40 group-hover/btn:text-white transition-colors" />
                      Atualizar
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {filteredAndSorted.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-24 glass-panel rounded-[2rem] mt-4"
        >
          <div className="w-20 h-20 bg-[#1A110C]/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-[#1A110C]/20" />
          </div>
          <h3 className="text-lg font-bold text-[#1A110C] mb-1">Nenhum produto encontrado</h3>
          <p className="text-[#1A110C]/40 text-sm">Tente ajustar seus filtros ou termos de busca.</p>
        </motion.div>
      )}
      <AnimatePresence>
        {editingId !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={() => setEditingId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-[#FFFAF0] rounded-[2rem] p-8 z-[101] shadow-2xl border border-white/50"
            >
              <button
                onClick={() => setEditingId(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#1A110C]/5 text-[#1A110C]/40 hover:bg-[#1A110C]/10 hover:text-[#1A110C] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-pao-dourado)]/20 flex items-center justify-center text-[var(--color-terracota)]">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A110C] font-serif leading-none">
                    Editar Produto
                  </h3>
                  <p className="text-xs text-[#1A110C]/50 mt-1 truncate w-48 font-medium">
                    {products.find((p) => p.id === editingId)?.nome}
                  </p>
                </div>
              </div>
              {editQty <= 5 && editQty > 0 && (
                <div className="flex items-center gap-2 p-3 mb-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-medium">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Estoque baixo! Considere reabastecer.</span>
                </div>
              )}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="text-xs font-bold text-[#1A110C]/50 uppercase tracking-wider mb-2 block">Preço Unitário</label>
                  <div className="flex items-center bg-white border border-[#1A110C]/10 rounded-xl p-3 focus-within:border-[var(--color-pao-dourado)] focus-within:ring-2 focus-within:ring-[var(--color-pao-dourado)]/20 transition-all">
                    <span className="text-[#1A110C]/40 font-bold mr-2">R$</span>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent text-xl font-bold text-[#1A110C] focus:outline-none"
                      min={0.01}
                      step={0.01}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1A110C]/50 uppercase tracking-wider mb-2 block">Quantidade em Estoque</label>
                  <div className="flex items-center justify-between bg-white border border-[#1A110C]/10 rounded-xl p-2 focus-within:border-[var(--color-pao-dourado)] focus-within:ring-2 focus-within:ring-[var(--color-pao-dourado)]/20 transition-all">
                    <button
                      onClick={() => setEditQty(Math.max(0, editQty - 1))}
                      className="w-12 h-12 rounded-lg bg-[#1A110C]/5 hover:bg-[#1A110C]/10 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-5 h-5 text-[#1A110C]" />
                    </button>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editQty}
                        onChange={(e) => setEditQty(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 text-center text-3xl font-bold text-[#1A110C] bg-transparent focus:outline-none"
                        min={0}
                      />
                      <span className="text-[#1A110C]/30 font-bold">un.</span>
                    </div>
                    <button
                      onClick={() => setEditQty(editQty + 1)}
                      className="w-12 h-12 rounded-lg bg-[#1A110C]/5 hover:bg-[#1A110C]/10 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-5 h-5 text-[#1A110C]" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="w-full py-4 bg-gradient-to-r from-[var(--color-terracota)] to-[#8B401D] text-white font-bold rounded-xl transition-all hover:shadow-[0_8px_20px_rgba(181,87,43,0.3)] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:transform-none disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
