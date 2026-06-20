"use client";

import { useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Package, Plus, Minus, X, Check, AlertTriangle, Layers, TrendingDown, XCircle, Tag, DollarSign, Edit3, Grid, ArrowUp, ArrowDown, Upload, AlignJustify, Image as ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { updateProduto, createProduto, reorderProdutos, deleteProduto } from "@/app/actions/estoque";

interface Product {
  id: number;
  nome: string;
  desc: string;
  preco: number;
  imagem: string;
  estoque: number;
  categoria: string;
  ordemExibicao: number;
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
  const [filterSection, setFilterSection] = useState<"ALL" | "VITRINE" | "CARDAPIO" | "AMBOS">("ALL");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editQty, setEditQty] = useState(0);
  const [editPrice, setEditPrice] = useState(0);
  const [editNome, setEditNome] = useState("");
  const [editCategoria, setEditCategoria] = useState("vitrine");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState("");
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [addNome, setAddNome] = useState("");
  const [addDesc, setAddDesc] = useState("");
  const [addPreco, setAddPreco] = useState(0);
  const [addEstoque, setAddEstoque] = useState(0);
  const [addCategoria, setAddCategoria] = useState("vitrine");
  const [addTag, setAddTag] = useState("");
  const [addFile, setAddFile] = useState<File | null>(null);
  const [addPreview, setAddPreview] = useState("");
  const addFileInputRef = useRef<HTMLInputElement>(null);

  const [isOrganizing, setIsOrganizing] = useState(false);
  const [organizeTab, setOrganizeTab] = useState<"vitrine" | "cardapio">("vitrine");
  const [orgProducts, setOrgProducts] = useState<Product[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error"; id: number } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification((current) => (current?.id === Date.now() ? current : null));
    }, 4000);
  };

  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState<number | null>(null);

  const displayProducts = products.filter(p => p.categoria?.toLowerCase() !== "vitrine");
  const totalProducts = displayProducts.length;
  const normalStock = displayProducts.filter(p => p.estoque > 5).length;
  const lowStock = displayProducts.filter(p => p.estoque > 0 && p.estoque <= 5).length;
  const outOfStock = displayProducts.filter(p => p.estoque === 0).length;

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

      let matchesSection = true;
      if (filterSection !== "ALL") {
        const cat = p.categoria.toUpperCase();
        if (filterSection === "AMBOS") {
          matchesSection = cat === "AMBOS";
        } else {
          matchesSection = cat === filterSection || cat === "AMBOS";
        }
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesSection;
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
    setEditingProduct(product);
    setIsDeleting(false);
    setEditQty(product.estoque);
    setEditPrice(product.preco);
    setEditNome(product.nome);
    setEditCategoria(product.categoria);
    setEditPreview(product.imagem);
    setEditFile(null);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFile(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("id", editingProduct.id.toString());
        formData.append("nome", editNome);
        formData.append("preco", editPrice.toString());
        formData.append("estoque", editQty.toString());
        formData.append("categoria", editCategoria);
        if (editFile) formData.append("imagem", editFile);

        await updateProduto(formData);
        setSaved(editingProduct.id);
        setEditingProduct(null);
        showNotification("Produto atualizado com sucesso!");
        setTimeout(() => setSaved(null), 2000);
      } catch (err) {
        showNotification("Erro ao atualizar produto.", "error");
      }
    });
  };

  const handleDelete = () => {
    if (!editingProduct) return;
    startTransition(async () => {
      try {
        await deleteProduto(editingProduct.id);
        setEditingProduct(null);
        showNotification("Produto excluído com sucesso!");
      } catch (err) {
        showNotification("Erro ao excluir produto.", "error");
      }
    });
  };

  const handleAddFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAddFile(file);
      setAddPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveAdd = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("nome", addNome);
        formData.append("desc", addDesc);
        formData.append("preco", addPreco.toString());
        formData.append("estoque", addEstoque.toString());
        formData.append("categoria", addCategoria);
        if (addTag) formData.append("tag", addTag);
        if (addFile) formData.append("imagem", addFile);

        await createProduto(formData);
        setIsAdding(false);

        setAddNome(""); setAddDesc(""); setAddPreco(0); setAddEstoque(0); setAddTag(""); setAddFile(null); setAddPreview("");
        showNotification("Produto cadastrado com sucesso!");
      } catch (err) {
        showNotification("Erro ao cadastrar produto.", "error");
      }
    });
  };

  const openOrganize = () => {
    setOrgProducts([...products].sort((a,b) => a.ordemExibicao - b.ordemExibicao));
    setIsOrganizing(true);
  };

  const moveProduct = (index: number, direction: -1 | 1) => {
    const currentList = orgProducts.filter(p => p.categoria.toLowerCase() === organizeTab || p.categoria.toLowerCase() === "ambos");
    if (index + direction < 0 || index + direction >= currentList.length) return;

    const newOrg = [...orgProducts];

    const itemA = currentList[index];
    const itemB = currentList[index + direction];
    
    const idxA = newOrg.findIndex(p => p.id === itemA.id);
    const idxB = newOrg.findIndex(p => p.id === itemB.id);

    [newOrg[idxA], newOrg[idxB]] = [newOrg[idxB], newOrg[idxA]];

    newOrg.forEach((p, i) => p.ordemExibicao = i);
    
    setOrgProducts(newOrg);
  };

  const handleSaveOrganize = () => {
    startTransition(async () => {
      try {
        const updates = orgProducts.map((p, i) => ({ id: p.id, ordemExibicao: i }));
        await reorderProdutos(updates);
        setIsOrganizing(false);
        showNotification("Ordem atualizada com sucesso!");
      } catch (err) {
        showNotification("Erro ao salvar ordem.", "error");
      }
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", ""); 
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (draggedItemIndex === null || draggedItemIndex === dropIndex) return;

    const currentList = orgProducts.filter(p => p.categoria.toLowerCase() === organizeTab || p.categoria.toLowerCase() === "ambos");
    const itemToMove = currentList[draggedItemIndex];
    const targetItem = currentList[dropIndex];

    const newOrg = [...orgProducts];
    const idxA = newOrg.findIndex(p => p.id === itemToMove.id);
    const idxB = newOrg.findIndex(p => p.id === targetItem.id);

    const [removed] = newOrg.splice(idxA, 1);

    const newIdxB = newOrg.findIndex(p => p.id === targetItem.id);
    newOrg.splice(draggedItemIndex > dropIndex ? newIdxB : newIdxB + 1, 0, removed);

    newOrg.forEach((p, i) => p.ordemExibicao = i);
    setOrgProducts(newOrg);
    setDraggedItemIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

  const renderModalBackdrop = (onClick: () => void) => (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
      onClick={onClick}
    />
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-32">
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1A110C] mb-1">Catálogo e Estoque</h1>
          <p className="text-[#1A110C]/50 text-sm">Gerencie produtos, ordene sua vitrine e controle valores.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openOrganize} className="px-5 py-2.5 bg-white border border-[#1A110C]/10 text-[#1A110C] font-bold text-sm rounded-xl shadow-sm hover:bg-[#1A110C]/5 transition-colors flex items-center gap-2">
            <AlignJustify className="w-4 h-4" /> Organizar Vitrine
          </button>
          <button onClick={() => setIsAdding(true)} className="px-5 py-2.5 bg-[#1A110C] text-white font-bold text-sm rounded-xl shadow-sm hover:bg-[#1A110C]/80 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Novo Produto
          </button>
        </div>
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
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-8 flex flex-col gap-6 glass-panel p-5 sm:p-6 rounded-[2rem]">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#1A110C]/40">
              <Grid className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Tipo de Produto</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFilterCategory("ALL")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${filterCategory === "ALL" ? "bg-[#1A110C] text-white border-[#1A110C]" : "bg-white/50 text-[#1A110C]/60 border-white hover:bg-white"}`}>Todos</button>
              {[{ id: "SALGADO", label: "Salgados" }, { id: "DOCE", label: "Doces" }, { id: "BEBIDA", label: "Bebidas" }].map(c => (
                <button key={c.id} onClick={() => setFilterCategory(c.id as any)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${filterCategory === c.id ? "bg-[var(--color-pao-dourado)] text-[#1A110C] border-[var(--color-pao-dourado)]" : "bg-white/50 text-[#1A110C]/60 border-white hover:bg-white"}`}>{c.label}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#1A110C]/40">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Seção</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFilterSection("ALL")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${filterSection === "ALL" ? "bg-[#1A110C] text-white border-[#1A110C]" : "bg-white/50 text-[#1A110C]/60 border-white hover:bg-white"}`}>Todas</button>
              {[{ id: "VITRINE", label: "Vitrine" }, { id: "CARDAPIO", label: "Cardápio" }, { id: "AMBOS", label: "Ambos" }].map(c => (
                <button key={c.id} onClick={() => setFilterSection(c.id as any)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${filterSection === c.id ? "bg-[#1A110C] text-white border-[#1A110C]" : "bg-white/50 text-[#1A110C]/60 border-white hover:bg-white"}`}>{c.label}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#1A110C]/40">
              <Tag className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Status do Estoque</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "ALL", label: "Todos", color: "bg-[#1A110C] text-white border-[#1A110C]" },
                { id: "NORMAL", label: "Normal", color: "bg-emerald-500 text-white border-emerald-500" },
                { id: "BAIXO", label: "Baixo", color: "bg-amber-500 text-white border-amber-500" },
                { id: "ZERADO", label: "Zerado", color: "bg-red-500 text-white border-red-500" }
              ].map(f => (
                <button key={f.id} onClick={() => setFilterStatus(f.id as any)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${filterStatus === f.id ? f.color : "bg-white/50 text-[#1A110C]/60 border-white hover:bg-white"}`}>{f.label}</button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredAndSorted.map((product) => {
            const status = getStockStatus(product.estoque);
            const wasSaved = saved === product.id;
            return (
              <motion.div
                key={product.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                className={`relative glass-panel bg-white/60 p-4 sm:p-5 rounded-[2rem] flex flex-col sm:flex-row gap-5 items-center group overflow-hidden border border-white/60 hover:shadow-xl hover:border-[var(--color-pao-dourado)]/40 transition-all duration-300 ${wasSaved ? "border-emerald-300 ring-4 ring-emerald-500/20" : ""}`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${product.estoque === 0 ? "bg-red-500" : product.estoque <= 5 ? "bg-amber-500" : "bg-[var(--color-terracota)]"}`} />
                <div className="relative w-full h-32 sm:w-24 sm:h-24 rounded-[1.25rem] overflow-hidden flex-shrink-0 shadow-sm">
                  <Image src={product.imagem} alt={product.nome} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" unoptimized={product.imagem.startsWith("/")} />
                  {wasSaved && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-emerald-500/30 backdrop-blur-sm flex items-center justify-center z-10"><Check className="w-8 h-8 text-white drop-shadow-md" /></motion.div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col w-full text-center sm:text-left">
                  <h3 className="font-bold text-lg text-[#1A110C] truncate mb-1 group-hover:text-[var(--color-terracota)] transition-colors">{product.nome}</h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                    <span className="text-[#1A110C]/50 text-[10px] font-bold uppercase tracking-wider bg-[#1A110C]/5 px-2 py-1 rounded-lg">
                      {product.categoria === "ambos" ? "VITRINE E CARDÁPIO" : product.categoria}
                    </span>
                    <span className="text-[#1A110C]/50 text-[10px] font-bold uppercase tracking-wider bg-[#1A110C]/5 px-2 py-1 rounded-lg">
                      {getFoodType(product.nome)}
                    </span>
                    <span className="font-mono font-bold text-[#1A110C] bg-[#1A110C]/5 px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 opacity-50" /> {product.preco.toFixed(2).replace('.',',')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-end gap-3 flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                  <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${status.color} flex items-center gap-1.5 shadow-sm`}>
                      <span className={`w-2 h-2 rounded-full ${status.dot} ${product.estoque <= 5 ? "animate-pulse" : ""}`} />
                      {status.label} <span className="opacity-60 ml-1">({product.estoque} un)</span>
                  </div>
                  <button onClick={() => openEdit(product)} className="w-full sm:w-auto px-5 py-2.5 bg-white text-[#1A110C] font-bold text-sm rounded-xl shadow-sm border border-[#1A110C]/5 hover:bg-[var(--color-pao-dourado)] hover:text-white hover:border-transparent transition-all hover:shadow-md flex items-center justify-center gap-2 group/btn">
                      <Edit3 className="w-4 h-4 text-[#1A110C]/40 group-hover/btn:text-white transition-colors" /> Atualizar
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {filteredAndSorted.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 glass-panel rounded-[2rem] mt-4">
          <div className="w-20 h-20 bg-[#1A110C]/5 rounded-full flex items-center justify-center mx-auto mb-4"><Package className="w-10 h-10 text-[#1A110C]/20" /></div>
          <h3 className="text-lg font-bold text-[#1A110C] mb-1">Nenhum produto encontrado</h3>
        </motion.div>
      )}
      <AnimatePresence>
        {editingProduct !== null && (
          <>
            {renderModalBackdrop(() => setEditingProduct(null))}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#FFFAF0] rounded-[2rem] p-8 z-[101] shadow-2xl border border-white/50"
            >
              <button onClick={() => setEditingProduct(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#1A110C]/5 hover:bg-[#1A110C]/10 transition-colors"><X className="w-4 h-4" /></button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-pao-dourado)]/20 flex items-center justify-center text-[var(--color-terracota)]"><Edit3 className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A110C] font-serif">Editar Produto</h3>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-xs font-bold text-[#1A110C]/50 uppercase tracking-wider mb-2 block">Imagem do Produto</label>
                  <div 
                    onClick={() => editFileInputRef.current?.click()}
                    className="relative w-full h-32 rounded-xl border-2 border-dashed border-[#1A110C]/20 bg-white hover:bg-[#1A110C]/5 cursor-pointer flex flex-col items-center justify-center overflow-hidden transition-colors"
                  >
                    {editPreview ? (
                      <Image src={editPreview} alt="Preview" fill className="object-cover opacity-60" unoptimized={editPreview.startsWith("/") || editPreview.startsWith("blob")} />
                    ) : null}
                    <div className="relative z-10 flex flex-col items-center">
                      <Upload className="w-6 h-6 text-[#1A110C]/40 mb-2" />
                      <span className="text-xs font-bold text-[#1A110C]/60">Clique para trocar a imagem</span>
                    </div>
                  </div>
                  <input type="file" accept="image/png, image/jpeg" className="hidden" ref={editFileInputRef} onChange={handleEditFileChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1A110C]/50 uppercase tracking-wider mb-2 block">Nome</label>
                    <input type="text" value={editNome} onChange={(e) => setEditNome(e.target.value)} className="w-full bg-white border border-[#1A110C]/10 rounded-xl p-3 text-sm font-bold text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1A110C]/50 uppercase tracking-wider mb-2 block">Seção</label>
                    <select value={editCategoria} onChange={(e) => setEditCategoria(e.target.value)} className="w-full bg-white border border-[#1A110C]/10 rounded-xl p-3 text-sm font-bold text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)]">
                      <option value="vitrine">Vitrine</option>
                      <option value="cardapio">Cardápio</option>
                      <option value="ambos">Ambos (Vitrine e Cardápio)</option>
                      <option value="geral">Geral (Oculto)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1A110C]/50 uppercase tracking-wider mb-2 block">Preço (R$)</label>
                    <input type="number" value={editPrice} onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)} min={0} step={0.01} className="w-full bg-white border border-[#1A110C]/10 rounded-xl p-3 text-sm font-bold text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1A110C]/50 uppercase tracking-wider mb-2 block">Estoque (un)</label>
                    <input type="number" value={editQty} onChange={(e) => setEditQty(Math.max(0, parseInt(e.target.value) || 0))} min={0} className="w-full bg-white border border-[#1A110C]/10 rounded-xl p-3 text-sm font-bold text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)]" />
                  </div>
                </div>
              </div>
              {isDeleting ? (
                <div className="flex flex-col gap-3">
                  <p className="text-center text-sm font-bold text-red-600 mb-2">Tem certeza que deseja excluir este produto permanentemente?</p>
                  <div className="flex gap-3">
                    <button onClick={() => setIsDeleting(false)} disabled={isPending} className="flex-1 py-3 bg-white text-[#1A110C] font-bold rounded-xl border border-[#1A110C]/10 hover:bg-[#1A110C]/5 transition-colors disabled:opacity-50">
                      Cancelar
                    </button>
                    <button onClick={handleDelete} disabled={isPending} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                      {isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Trash2 className="w-5 h-5" /> Confirmar</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsDeleting(true)} disabled={isPending} className="p-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors border border-red-100 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button onClick={handleSaveEdit} disabled={isPending} className="flex-1 py-4 bg-gradient-to-r from-[var(--color-terracota)] to-[#8B401D] text-white font-bold rounded-xl transition-all hover:shadow-[0_8px_20px_rgba(181,87,43,0.3)] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:transform-none flex items-center justify-center gap-2">
                    {isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-5 h-5" /> Salvar Alterações</>}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isAdding && (
          <>
            {renderModalBackdrop(() => setIsAdding(false))}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#FFFAF0] rounded-[2rem] p-8 z-[101] shadow-2xl border border-white/50"
            >
              <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#1A110C]/5 hover:bg-[#1A110C]/10 transition-colors"><X className="w-4 h-4" /></button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#1A110C] flex items-center justify-center text-white"><Plus className="w-6 h-6" /></div>
                <div><h3 className="text-xl font-bold text-[#1A110C] font-serif">Novo Produto</h3></div>
              </div>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-xs font-bold text-[#1A110C]/50 uppercase tracking-wider mb-2 block">Foto do Produto (Opcional)</label>
                  <div 
                    onClick={() => addFileInputRef.current?.click()}
                    className="relative w-full h-24 rounded-xl border-2 border-dashed border-[#1A110C]/20 bg-white hover:bg-[#1A110C]/5 cursor-pointer flex flex-col items-center justify-center overflow-hidden transition-colors"
                  >
                    {addPreview ? (
                      <Image src={addPreview} alt="Preview" fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex flex-col items-center">
                        <ImageIcon className="w-6 h-6 text-[#1A110C]/30 mb-1" />
                        <span className="text-xs font-bold text-[#1A110C]/50">Fazer upload de .jpg/.png</span>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/png, image/jpeg" className="hidden" ref={addFileInputRef} onChange={handleAddFileChange} />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1A110C]/50 uppercase tracking-wider mb-2 block">Nome *</label>
                  <input type="text" value={addNome} onChange={(e) => setAddNome(e.target.value)} placeholder="Ex: Croissant de Amêndoas" className="w-full bg-white border border-[#1A110C]/10 rounded-xl p-3 text-sm font-bold text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1A110C]/50 uppercase tracking-wider mb-2 block">Descrição Curta *</label>
                  <input type="text" value={addDesc} onChange={(e) => setAddDesc(e.target.value)} placeholder="Massa folhada artesanal..." className="w-full bg-white border border-[#1A110C]/10 rounded-xl p-3 text-sm font-medium text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1A110C]/50 uppercase tracking-wider mb-2 block">Preço (R$) *</label>
                    <input type="number" value={addPreco || ''} onChange={(e) => setAddPreco(parseFloat(e.target.value) || 0)} min={0} step={0.01} className="w-full bg-white border border-[#1A110C]/10 rounded-xl p-3 text-sm font-bold text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1A110C]/50 uppercase tracking-wider mb-2 block">Estoque Inicial</label>
                    <input type="number" value={addEstoque || ''} onChange={(e) => setAddEstoque(Math.max(0, parseInt(e.target.value) || 0))} min={0} className="w-full bg-white border border-[#1A110C]/10 rounded-xl p-3 text-sm font-bold text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1A110C]/50 uppercase tracking-wider mb-2 block">Seção</label>
                    <select value={addCategoria} onChange={(e) => setAddCategoria(e.target.value)} className="w-full bg-white border border-[#1A110C]/10 rounded-xl p-3 text-sm font-bold text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)]">
                      <option value="vitrine">Vitrine</option>
                      <option value="cardapio">Cardápio</option>
                      <option value="ambos">Ambos (Vitrine e Cardápio)</option>
                      <option value="geral">Geral (Oculto)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1A110C]/50 uppercase tracking-wider mb-2 block">Etiqueta</label>
                    <input type="text" value={addTag} onChange={(e) => setAddTag(e.target.value)} placeholder="Ex: Novo!" className="w-full bg-white border border-[#1A110C]/10 rounded-xl p-3 text-sm font-bold text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)]" />
                  </div>
                </div>
              </div>
              <button onClick={handleSaveAdd} disabled={isPending || !addNome || !addDesc} className="w-full py-4 bg-[#1A110C] text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:transform-none flex items-center justify-center gap-2">
                {isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus className="w-5 h-5" /> Cadastrar Produto</>}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOrganizing && (
          <>
            {renderModalBackdrop(() => setIsOrganizing(false))}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg max-h-[90vh] flex flex-col bg-[#FFFAF0] rounded-[2rem] p-6 sm:p-8 z-[101] shadow-2xl border border-white/50"
            >
              <button onClick={() => setIsOrganizing(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#1A110C]/5 hover:bg-[#1A110C]/10 transition-colors"><X className="w-4 h-4" /></button>
              <div className="flex items-center gap-3 mb-6 flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#1A110C]/10 flex items-center justify-center text-[#1A110C]"><AlignJustify className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A110C] font-serif leading-none">Organizar Exibição</h3>
                  <p className="text-xs text-[#1A110C]/50 mt-1">Mova os itens para reordená-los no site.</p>
                </div>
              </div>
              <div className="flex bg-[#1A110C]/5 p-1 rounded-xl mb-6 flex-shrink-0">
                <button onClick={() => setOrganizeTab("vitrine")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${organizeTab === "vitrine" ? "bg-white text-[#1A110C] shadow-sm" : "text-[#1A110C]/50 hover:text-[#1A110C]"}`}>Vitrine</button>
                <button onClick={() => setOrganizeTab("cardapio")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${organizeTab === "cardapio" ? "bg-white text-[#1A110C] shadow-sm" : "text-[#1A110C]/50 hover:text-[#1A110C]"}`}>Cardápio</button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 min-h-[300px]">
                {orgProducts.filter(p => p.categoria.toLowerCase() === organizeTab || p.categoria.toLowerCase() === "ambos").map((p, index, arr) => {
                  const isDragging = draggedItemIndex === index;
                  const isOver = dragOverIndex === index;
                  
                  return (
                  <div 
                    key={p.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-3 bg-white border rounded-xl group cursor-grab active:cursor-grabbing transition-all ${
                      isDragging ? "opacity-40 border-[var(--color-pao-dourado)] scale-[0.98]" : 
                      isOver ? "border-[var(--color-pao-dourado)] border-dashed border-2 bg-[var(--color-pao-dourado)]/5 scale-[1.02]" : 
                      "border-[#1A110C]/10 hover:border-[#1A110C]/20"
                    }`}
                  >
                    <span className="font-mono text-[#1A110C]/30 text-xs font-bold w-4 text-right cursor-grab flex-shrink-0">
                      <Grid className="w-3 h-3 text-[#1A110C]/20 group-hover:text-[#1A110C]/50" />
                    </span>
                    <span className="font-mono text-[#1A110C]/30 text-xs font-bold w-4 text-right">{index + 1}</span>
                    <div className="w-10 h-10 relative rounded-lg overflow-hidden flex-shrink-0 pointer-events-none">
                      <Image src={p.imagem} alt={p.nome} fill className="object-cover" unoptimized={p.imagem.startsWith("/")} />
                    </div>
                    <p className="flex-1 text-sm font-bold text-[#1A110C] truncate pointer-events-none">{p.nome}</p>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button onClick={() => moveProduct(index, -1)} disabled={index === 0} className="p-1 rounded bg-[#1A110C]/5 hover:bg-[#1A110C]/10 disabled:opacity-30 disabled:hover:bg-[#1A110C]/5 transition-colors"><ArrowUp className="w-4 h-4 text-[#1A110C]" /></button>
                      <button onClick={() => moveProduct(index, 1)} disabled={index === arr.length - 1} className="p-1 rounded bg-[#1A110C]/5 hover:bg-[#1A110C]/10 disabled:opacity-30 disabled:hover:bg-[#1A110C]/5 transition-colors"><ArrowDown className="w-4 h-4 text-[#1A110C]" /></button>
                    </div>
                  </div>
                )})}
              </div>

              <button onClick={handleSaveOrganize} disabled={isPending} className="mt-6 flex-shrink-0 w-full py-4 bg-[#1A110C] text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:transform-none flex items-center justify-center gap-2">
                {isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-5 h-5" /> Salvar Ordem</>}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Notifications Wrapper */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border ${
              notification.type === "success" 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {notification.type === "success" ? (
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            )}
            <p className="font-bold text-sm">{notification.message}</p>
            <button 
              onClick={() => setNotification(null)}
              className={`ml-2 p-1 rounded-full opacity-50 hover:opacity-100 transition-opacity ${
                notification.type === "success" ? "hover:bg-emerald-200" : "hover:bg-red-200"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
