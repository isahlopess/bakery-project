"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Package, Plus, Minus, X, Check, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { updateEstoque } from "@/app/actions/estoque";

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
  if (qty === 0) return { label: "Sem estoque", color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500", ring: "ring-red-500/20" };
  if (qty <= 5) return { label: "Baixo", color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500", ring: "ring-amber-500/20" };
  return { label: "Normal", color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", ring: "ring-emerald-500/20" };
}

export default function EstoqueClient({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQty, setEditQty] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState<number | null>(null);

  const filtered = products.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setEditQty(product.estoque);
  };

  const handleSave = () => {
    if (editingId === null) return;
    startTransition(async () => {
      await updateEstoque(editingId, editQty);
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
        <h1 className="text-3xl font-serif font-bold text-[#1A110C] mb-1">Estoque</h1>
        <p className="text-[#1A110C]/50 text-sm">Gerencie a disponibilidade dos seus produtos.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A110C]/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full pl-12 pr-4 py-3 glass-card text-[#1A110C] placeholder-[#1A110C]/30 focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-2 focus:ring-[var(--color-pao-dourado)]/20 transition-all"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((product, i) => {
          const status = getStockStatus(product.estoque);
          const wasSaved = saved === product.id;
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className={`glass-card rounded-[2rem] overflow-hidden group ${wasSaved ? "border-emerald-300 ring-2 " + status.ring : ""}`}
            >
              <div className="relative h-40 bg-transparent overflow-hidden">
                <Image
                  src={product.imagem}
                  alt={product.nome}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized={product.imagem.startsWith("/")}
                />
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>
                {wasSaved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#1A110C] text-sm mb-1 truncate">{product.nome}</h3>
                <p className="text-xs text-[#1A110C]/40 mb-3">
                  R$ {product.preco.toFixed(2).replace(".", ",")}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#1A110C]/30" />
                    <span className={`text-sm font-bold ${product.estoque === 0 ? "text-red-600" : product.estoque <= 5 ? "text-amber-600" : "text-[#1A110C]"}`}>
                      {product.estoque} un.
                    </span>
                  </div>
                  <button
                    onClick={() => openEdit(product)}
                    className="text-xs font-bold text-[var(--color-terracota)] hover:text-[var(--color-pao-escuro)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--color-terracota)]/5"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-[#1A110C]/20 mx-auto mb-4" />
          <p className="text-[#1A110C]/40 font-medium">Nenhum produto encontrado.</p>
        </div>
      )}

      <AnimatePresence>
        {editingId !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              onClick={() => setEditingId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm glass-panel rounded-3xl p-8 z-[101]"
            >
              <button
                onClick={() => setEditingId(null)}
                className="absolute top-4 right-4 p-2 text-[#1A110C]/40 hover:text-[#1A110C] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-[#1A110C] font-serif mb-1">
                Ajustar Estoque
              </h3>
              <p className="text-sm text-[#1A110C]/40 mb-8">
                {products.find((p) => p.id === editingId)?.nome}
              </p>

              {editQty <= 5 && editQty > 0 && (
                <div className="flex items-center gap-2 p-3 mb-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Estoque baixo! Considere reabastecer.</span>
                </div>
              )}

              <div className="flex items-center justify-center gap-6 mb-8">
                <button
                  onClick={() => setEditQty(Math.max(0, editQty - 1))}
                  className="w-12 h-12 rounded-xl bg-[#1A110C]/5 hover:bg-[#1A110C]/10 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-5 h-5 text-[#1A110C]" />
                </button>
                <input
                  type="number"
                  value={editQty}
                  onChange={(e) => setEditQty(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 text-center text-3xl font-bold text-[#1A110C] bg-transparent border-b-2 border-[var(--color-pao-dourado)] focus:outline-none"
                  min={0}
                />
                <button
                  onClick={() => setEditQty(editQty + 1)}
                  className="w-12 h-12 rounded-xl bg-[#1A110C]/5 hover:bg-[#1A110C]/10 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-5 h-5 text-[#1A110C]" />
                </button>
              </div>

              <button
                onClick={handleSave}
                disabled={isPending}
                className="w-full py-3.5 bg-gradient-to-r from-[var(--color-terracota)] to-[var(--color-pao-escuro)] text-white font-bold rounded-xl transition-all hover:shadow-lg disabled:opacity-60"
              >
                {isPending ? "Salvando..." : "Salvar Estoque"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
