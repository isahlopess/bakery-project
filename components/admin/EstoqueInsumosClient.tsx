"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChefHat, 
  Plus, 
  Trash2, 
  Search, 
  Save, 
  X,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Edit3,
  ChevronRight,
  PackageOpen,
  ArrowRight,
  AlertTriangle,
  ChevronDown
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createIngredient, deleteIngredient, updateIngredient, saveRecipe } from "@/app/actions/insumos";

const CATEGORIAS_INSUMOS = ["LATICINIOS", "SECOS_FARINHAS", "HORTIFRUTI", "CARNES_FRIOS", "EMBALAGENS", "OUTROS"];
const formatCategory = (cat: string) => {
  const map: Record<string, string> = {
    GERAL: "Geral",
    LATICINIOS: "Laticínios",
    SECOS_FARINHAS: "Secos e Farinhas",
    HORTIFRUTI: "Hortifrúti",
    CARNES_FRIOS: "Carnes e Frios",
    EMBALAGENS: "Embalagens",
    OUTROS: "Outros"
  };
  return map[cat] || cat;
}

export default function EstoqueInsumosClient({ initialIngredients, products }: { initialIngredients: any[], products: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"INSUMOS" | "RECEITAS">("INSUMOS");
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [localProducts, setLocalProducts] = useState(products);

  useEffect(() => {
    setIngredients(initialIngredients);
    setLocalProducts(products);
  }, [initialIngredients, products]);

  const [toast, setToast] = useState<{show: boolean, message: string, type: "success" | "error"}>({show: false, message: "", type: "success"});
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const [deleteModal, setDeleteModal] = useState<{show: boolean, id: number | null, nome: string}>({show: false, id: null, nome: ""});

  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const [editingIngredientId, setEditingIngredientId] = useState<number | null>(null);
  const [newIngredient, setNewIngredient] = useState({ nome: "", custoPacote: "", quantidadePacote: "1", unidade: "GRAMA", categoria: "GERAL" });

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [selectedProductFilter, setSelectedProductFilter] = useState<number | null>(null);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [recipeItems, setRecipeItems] = useState<{ingredientId: number; quantidade: number}[]>([]);
  const [rendimento, setRendimento] = useState<string>("1");
  const [searchProduct, setSearchProduct] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSaveIngredient = async () => {
    if (!newIngredient.nome || !newIngredient.custoPacote || !newIngredient.quantidadePacote) return;
    const custoNum = parseFloat(newIngredient.custoPacote.toString().replace(",", "."));
    const qtdNum = parseFloat(newIngredient.quantidadePacote.toString().replace(",", "."));
    
    if (editingIngredientId) {
      await updateIngredient(editingIngredientId, {
        nome: newIngredient.nome,
        custoPacote: custoNum,
        quantidadePacote: qtdNum,
        unidade: newIngredient.unidade,
        categoria: newIngredient.categoria
      });
      showToast("Insumo atualizado!");
    } else {
      await createIngredient({
        nome: newIngredient.nome,
        custoPacote: custoNum,
        quantidadePacote: qtdNum,
        unidade: newIngredient.unidade,
        categoria: newIngredient.categoria
      });
      showToast("Novo insumo cadastrado!");
    }
    
    setNewIngredient({ nome: "", custoPacote: "", quantidadePacote: "1", unidade: "GRAMA", categoria: "GERAL" });
    setIsAddingIngredient(false);
    setEditingIngredientId(null);
    router.refresh();
  };

  const openEditIngredient = (ing: any) => {
    setEditingIngredientId(ing.id);
    setNewIngredient({
      nome: ing.nome,
      custoPacote: ing.custoPacote.toString(),
      quantidadePacote: ing.quantidadePacote.toString(),
      unidade: ing.unidade,
      categoria: ing.categoria || "GERAL"
    });
    setIsAddingIngredient(true);
  };

  const handleDeleteIngredient = async () => {
    if (deleteModal.id) {
      const result = await deleteIngredient(deleteModal.id);
      if (result.success) {
        showToast("Insumo removido com sucesso.");
      } else {
        if (result.error?.includes("uso em fichas técnicas")) {
          showToast("Erro: Insumo está sendo usado em alguma receita.", "error");
        } else {
          showToast("Erro ao excluir insumo.", "error");
        }
      }
    }
    setDeleteModal({show: false, id: null, nome: ""});
  };

  const selectProductToEdit = (product: any) => {
    setSelectedProduct(product);
    setRecipeItems(product.recipes.map((r: any) => ({ ingredientId: r.ingredientId, quantidade: r.quantidade })));
    setRendimento(product.rendimento?.toString() || "1");
  };

  const addRecipeItem = () => {
    if (ingredients.length === 0) {
      showToast("Cadastre insumos primeiro!", "error");
      return;
    }
    setRecipeItems([...recipeItems, { ingredientId: ingredients[0].id, quantidade: 1 }]);
  };

  const updateRecipeItem = (index: number, field: string, value: any) => {
    const updated = [...recipeItems];
    updated[index] = { ...updated[index], [field]: value };
    setRecipeItems(updated);
  };

  const removeRecipeItem = (index: number) => {
    setRecipeItems(recipeItems.filter((_, i) => i !== index));
  };

  const handleSaveRecipe = () => {
    if (!selectedProduct) return;
    const rendimentoVal = parseFloat(rendimento.replace(",", ".")) || 1;

    setLocalProducts(prev => prev.map(p => 
      p.id === selectedProduct.id 
        ? { ...p, rendimento: rendimentoVal, recipes: recipeItems } 
        : p
    ));
    setSelectedProduct((prev: any) => ({...prev, rendimento: rendimentoVal, recipes: recipeItems}));
    showToast("Ficha técnica salva com sucesso!");

    startTransition(() => {
      saveRecipe(selectedProduct.id, rendimentoVal, recipeItems);
    });
  };

  const filteredProducts = localProducts
    .filter(p => p.nome.toLowerCase().includes(searchProduct.toLowerCase()))
    .sort((a, b) => {
      const aHasRecipe = a.recipes?.length > 0 ? 1 : 0;
      const bHasRecipe = b.recipes?.length > 0 ? 1 : 0;
      if (bHasRecipe !== aHasRecipe) return bHasRecipe - aHasRecipe;
      return a.nome.localeCompare(b.nome);
    });

  const calculateRecipeCost = (items: any[]) => {
    return items.reduce((total, item) => {
      const ing = ingredients.find(i => i.id === item.ingredientId);
      if (!ing) return total;
      return total + (ing.custo * item.quantidade);
    }, 0);
  };

  const getStepForUnit = (unitId: number) => {
    const ing = ingredients.find(i => i.id === unitId);
    if (!ing) return "1";
    switch(ing.unidade) {
      case "UNIDADE": return "1";
      case "KG": return "0.01";
      case "LITRO": return "0.01";
      case "GRAMA": return "5";
      case "MILILITRO": return "10";
      default: return "1";
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto pb-32">
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className={`fixed top-6 right-6 z-[300] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-medium tracking-wide border ${
              toast.type === "success" 
                ? "bg-emerald-50 text-emerald-900 border-emerald-200" 
                : "bg-red-50 text-red-900 border-red-200"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteModal({show: false, id: null, nome: ""})} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 ring-8 ring-red-50/50">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A110C] mb-2">Excluir Insumo?</h3>
              <p className="text-[#1A110C]/60 mb-8 leading-relaxed">Você está prestes a remover <b>{deleteModal.nome}</b> permanentemente. Esta ação não pode ser desfeita.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModal({show: false, id: null, nome: ""})} className="flex-1 py-3.5 bg-black/5 text-[#1A110C] rounded-xl font-bold hover:bg-black/10 transition-colors">Cancelar</button>
                <button onClick={handleDeleteIngredient} className="flex-1 py-3.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">Sim, Excluir</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isAddingIngredient && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[200]" 
              onClick={() => setIsAddingIngredient(false)} 
            />
            <motion.div 
              initial={{ x: '100%', opacity: 0.5 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#FDFBF7] shadow-[-20px_0_40px_rgba(0,0,0,0.1)] z-[201] flex flex-col"
            >
              <div className="p-6 md:p-8 flex items-center justify-between border-b border-black/5 bg-white">
                <div>
                  <h2 className="text-xl font-bold text-[#1A110C]">{editingIngredientId ? "Editar Insumo" : "Novo Insumo"}</h2>
                  <p className="text-sm text-[#1A110C]/50 mt-1">Preencha os dados do pacote comprado.</p>
                </div>
                <button onClick={() => setIsAddingIngredient(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors">
                  <X className="w-5 h-5 text-[#1A110C]" />
                </button>
              </div>
              <div className="p-6 md:p-8 flex-1 overflow-y-auto flex flex-col gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#1A110C]/50 mb-2 uppercase tracking-wider">Nome Comercial</label>
                  <input 
                    type="text" 
                    value={newIngredient.nome} 
                    onChange={(e) => setNewIngredient({...newIngredient, nome: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-black/5 shadow-sm focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-4 focus:ring-[var(--color-pao-dourado)]/10 transition-all font-medium text-[#1A110C]" 
                    placeholder="Ex: Farinha de Trigo Premium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1A110C]/50 mb-2 uppercase tracking-wider">Custo do Pacote</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A110C]/40 font-medium">R$</span>
                      <input 
                        type="text" 
                        value={newIngredient.custoPacote} 
                        onChange={(e) => setNewIngredient({...newIngredient, custoPacote: e.target.value})}
                        className="w-full pl-11 pr-5 py-4 rounded-2xl bg-white border border-black/5 shadow-sm focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-4 focus:ring-[var(--color-pao-dourado)]/10 transition-all font-medium text-[#1A110C]" 
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1A110C]/50 mb-2 uppercase tracking-wider">Quantidade</label>
                    <input 
                      type="text" 
                      value={newIngredient.quantidadePacote} 
                      onChange={(e) => setNewIngredient({...newIngredient, quantidadePacote: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-white border border-black/5 shadow-sm focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-4 focus:ring-[var(--color-pao-dourado)]/10 transition-all font-medium text-[#1A110C]" 
                      placeholder="1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A110C]/50 mb-2">Unidade de Medida</label>
                  <select
                    value={newIngredient.unidade}
                    onChange={(e) => setNewIngredient({ ...newIngredient, unidade: e.target.value })}
                    className="w-full bg-white border border-black/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1A110C] font-bold text-sm"
                  >
                    <option value="GRAMA">Grama (g)</option>
                    <option value="MILILITRO">Mililitro (ml)</option>
                    <option value="UNIDADE">Unidade (un)</option>
                    <option value="KG">Quilograma (kg)</option>
                    <option value="LITRO">Litro (L)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A110C]/50 mb-2">Categoria</label>
                  <select
                    value={newIngredient.categoria}
                    onChange={(e) => setNewIngredient({ ...newIngredient, categoria: e.target.value })}
                    className="w-full bg-white border border-black/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1A110C] font-bold text-sm"
                  >
                    {CATEGORIAS_INSUMOS.map(cat => (
                      <option key={cat} value={cat}>{formatCategory(cat)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-6 md:p-8 bg-white border-t border-black/5">
                <button onClick={handleSaveIngredient} className="w-full py-4 bg-[#1A110C] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#2B1B12] transition-colors shadow-xl shadow-black/10">
                  <Save className="w-5 h-5" />
                  {editingIngredientId ? "Atualizar Insumo" : "Salvar Insumo"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#1A110C] mb-2">Engenharia de Menu</h1>
          <p className="text-[#1A110C]/60 text-sm md:text-base max-w-xl">Gerencie seus fornecedores, custos de insumos e projete as fichas técnicas para controle de lucro preciso.</p>
        </div>
      </div>

      <div className="flex bg-white/60 p-1.5 rounded-[1.25rem] w-fit mb-8 border border-white shadow-sm backdrop-blur-md">
        <button
          onClick={() => setActiveTab("INSUMOS")}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2.5 ${
            activeTab === "INSUMOS" ? "bg-[#1A110C] text-white shadow-lg shadow-black/5" : "text-[#1A110C]/50 hover:text-[#1A110C] hover:bg-white/50"
          }`}
        >
          <PackageOpen className="w-4 h-4" />
          Banco de Insumos
        </button>
        <button
          onClick={() => setActiveTab("RECEITAS")}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2.5 ${
            activeTab === "RECEITAS" ? "bg-[#1A110C] text-white shadow-lg shadow-black/5" : "text-[#1A110C]/50 hover:text-[#1A110C] hover:bg-white/50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Fichas Técnicas
        </button>
      </div>
            {activeTab === "INSUMOS" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold text-[#1A110C] flex items-center gap-3">
              Catálogo de Ingredientes
              <span className="text-xs font-bold text-[#1A110C]/40 bg-black/5 px-3 py-1 rounded-full">{ingredients.length}</span>
            </h2>
            <button 
              onClick={() => {
                setEditingIngredientId(null);
                setNewIngredient({ nome: "", custoPacote: "", quantidadePacote: "1", unidade: "GRAMA", categoria: "OUTROS" });
                setIsAddingIngredient(true);
              }}
              className="px-6 py-3 bg-[var(--color-pao-dourado)] text-[#1A110C] rounded-xl font-bold flex items-center gap-2 hover:bg-[#c99042] transition-colors shadow-lg shadow-[var(--color-pao-dourado)]/20"
            >
              <Plus className="w-5 h-5" /> Adicionar
            </button>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-[320px] flex flex-col gap-6 flex-shrink-0">
              <div className="bg-white/60 backdrop-blur-xl border border-white shadow-xl shadow-black/5 rounded-[2rem] p-6">
                <h3 className="text-[#1A110C] font-bold mb-4 flex items-center justify-between">
                  Filtros Inteligentes
                  {(selectedCategoryFilter || selectedProductFilter) && (
                    <button 
                      onClick={() => { setSelectedCategoryFilter(null); setSelectedProductFilter(null); }}
                      className="text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                    >
                      Limpar
                    </button>
                  )}
                </h3>
                <div className="space-y-6">
                  <div>
                    <button 
                      onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                      className="w-full flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-[#1A110C]/40 mb-3 hover:text-[#1A110C]/80 transition-colors"
                    >
                      <span>Categorias {selectedCategoryFilter && "• (1 Selecionada)"}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isCategoriesExpanded ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {isCategoriesExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-2 pt-1 pb-4">
                            <button
                              onClick={() => setSelectedCategoryFilter(null)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                                selectedCategoryFilter === null 
                                  ? "bg-[var(--color-pao-dourado)] text-white shadow-md" 
                                  : "bg-white border border-black/5 text-[#1A110C]/60 hover:border-black/20 hover:text-[#1A110C]"
                              }`}
                            >
                              Todos
                            </button>
                            {CATEGORIAS_INSUMOS.map(cat => (
                              <button
                                key={cat}
                                onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === cat ? null : cat)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                                  selectedCategoryFilter === cat 
                                    ? "bg-[var(--color-pao-dourado)] text-white shadow-md" 
                                    : "bg-white border border-black/5 text-[#1A110C]/60 hover:border-black/20 hover:text-[#1A110C]"
                                }`}
                              >
                                {formatCategory(cat)}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="h-px w-full bg-black/5" />
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#1A110C]/40 mb-3">Engenharia Reversa (Por Produto)</h4>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-2 space-y-1">
                      {localProducts.map(product => {
                        const isSelected = selectedProductFilter === product.id;
                        return (
                          <button
                            key={product.id}
                            onClick={() => setSelectedProductFilter(isSelected ? null : product.id)}
                            className={`w-full text-left flex items-center gap-3 p-2 rounded-xl transition-all ${
                              isSelected
                                ? "bg-[#1A110C] text-white"
                                : "hover:bg-white/50 text-[#1A110C]/70"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={product.imagem} alt={product.nome} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs font-bold truncate">{product.nome}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white shadow-xl shadow-black/5 rounded-[2rem] overflow-hidden">
              <div className="p-6 border-b border-black/5 bg-white/50">
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A110C]/30" />
                  <input
                    type="text"
                    placeholder="Buscar insumos..."
                    className="w-full bg-white border border-black/5 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1A110C] font-bold text-sm transition-all shadow-sm"
                  />
                </div>
              </div>
              {ingredients.length === 0 ? (
                <div className="text-center py-20 px-4">
                  <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ChefHat className="w-10 h-10 text-black/20" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A110C] mb-2">Despensa Vazia</h3>
                  <p className="text-[#1A110C]/50 max-w-sm mx-auto">Você ainda não possui insumos cadastrados. Comece adicionando seus principais ingredientes.</p>
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  <div className="grid grid-cols-12 gap-4 p-6 bg-black/[0.02] text-xs font-bold text-[#1A110C]/40 uppercase tracking-wider">
                    <div className="col-span-5 md:col-span-6">Insumo</div>
                    <div className="col-span-4 md:col-span-4 text-right">Custo Padrão</div>
                    <div className="col-span-3 md:col-span-2 text-right">Ações</div>
                  </div>
                  {ingredients
                    .filter(ing => {
                      if (selectedCategoryFilter && ing.categoria !== selectedCategoryFilter) return false;
                      if (selectedProductFilter) {
                        const prod = localProducts.find(p => p.id === selectedProductFilter);
                        if (prod && !prod.recipes?.some((r: any) => r.ingredientId === ing.id)) return false;
                      }
                      return true;
                    })
                    .map(ing => (
                    <div key={ing.id} className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-white transition-colors group">
                      <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                          <PackageOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1A110C] text-sm truncate">{ing.nome}</h3>
                          <span className="inline-block mt-0.5 text-[9px] uppercase tracking-widest font-bold bg-black/5 text-[#1A110C]/60 px-2 py-0.5 rounded-md">
                            {formatCategory(ing.categoria || "GERAL")}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-4 md:col-span-4 text-right">
                        <div className="font-mono font-bold text-[#1A110C]">R$ {ing.custo.toFixed(2).replace('.', ',')}</div>
                        <div className="text-[10px] uppercase font-bold text-[#1A110C]/40 tracking-wider">por {ing.unidade.toLowerCase()}</div>
                      </div>
                      <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-1 transition-opacity">
                        <button onClick={() => openEditIngredient(ing)} className="w-9 h-9 flex items-center justify-center rounded-xl text-blue-600 hover:bg-blue-50 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteModal({show: true, id: ing.id, nome: ing.nome})} className="w-9 h-9 flex items-center justify-center rounded-xl text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
      {activeTab === "RECEITAS" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
          <div className="flex flex-col lg:flex-row gap-6 lg:h-[800px]">
            <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col bg-white/60 backdrop-blur-xl border border-white shadow-xl shadow-black/5 rounded-[2rem] overflow-hidden flex-shrink-0">
              <div className="p-6 border-b border-black/5 bg-white/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#1A110C]">Catálogo</h2>
                  {localProducts.filter(p => !(p.recipes?.length > 0)).length > 0 && (
                    <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-[10px] font-bold text-red-600 tracking-wider">
                        {localProducts.filter(p => !(p.recipes?.length > 0)).length} PENDENTES
                      </span>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A110C]/30" />
                  <input
                    type="text"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    placeholder="Buscar produto..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-black/5 focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-4 focus:ring-[var(--color-pao-dourado)]/10 transition-all font-medium text-sm shadow-sm"
                  />
                </div>
              </div>\n              \n              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {filteredProducts.map(product => {
                  const hasRecipe = product.recipes && product.recipes.length > 0;
                  const isSelected = selectedProduct?.id === product.id;
                  
                  return (
                    <div 
                      key={product.id} 
                      onClick={() => selectProductToEdit(product)}
                      className={`p-3 rounded-[1.25rem] transition-all cursor-pointer flex items-center gap-4 ${
                        isSelected 
                          ? "bg-[#1A110C] text-white shadow-lg" 
                          : "hover:bg-white text-[#1A110C]"
                      }`}
                    >
                      <div className="w-12 h-12 flex-shrink-0 relative">
                        <div className="w-full h-full rounded-xl overflow-hidden bg-black/10">
                          <img src={product.imagem} alt={product.nome} className="w-full h-full object-cover" />
                        </div>
                        {hasRecipe && !isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm z-10" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-sm truncate ${isSelected ? "text-white" : "text-[#1A110C]"}`}>
                          {product.nome}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? "text-white/60" : "text-[#1A110C]/40"}`}>
                            Venda: R$ {product.preco.toFixed(2).replace('.', ',')}
                          </span>
                          {!hasRecipe && !isSelected && (
                            <span className="text-[9px] uppercase font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">Pendente</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isSelected ? "text-white/50" : "text-[#1A110C]/20"}`} />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex-1 bg-white border border-black/5 shadow-2xl shadow-black/5 rounded-[2rem] overflow-hidden flex flex-col relative min-h-[500px]">
              {!selectedProduct ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-80">
                  <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mb-6 ring-8 ring-white">
                    <BookOpen className="w-10 h-10 text-black/20" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-[#1A110C] mb-3">Área de Engenharia</h2>
                  <p className="text-[#1A110C]/50 max-w-sm mx-auto leading-relaxed">
                    Selecione um produto no painel à esquerda para visualizar e compor sua ficha técnica.
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-8 border-b border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-white to-black/[0.02]">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                        <img src={selectedProduct.imagem} alt={selectedProduct.nome} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#1A110C] leading-tight mb-1">{selectedProduct.nome}</h2>
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-pao-dourado)]">
                          Montagem da Receita
                        </span>
                      </div>
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-black/5 flex items-center gap-4 min-w-[280px]">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A110C]/40 mb-1">
                          Rendimento da Receita
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={rendimento}
                            onChange={(e) => setRendimento(e.target.value)}
                            className="w-16 bg-black/5 rounded-lg px-2 py-1 text-sm font-bold text-[#1A110C] outline-none focus:ring-2 focus:ring-[var(--color-pao-dourado)]"
                          />
                          <span className="text-xs font-bold text-[#1A110C]/60">unidades</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#FDFBF7]">
                    {recipeItems.length === 0 ? (
                      <div className="text-center py-16">
                        <AlertCircle className="w-12 h-12 text-[#1A110C]/20 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-[#1A110C] mb-2">Nenhum ingrediente ainda</h3>
                        <p className="text-[#1A110C]/50 text-sm max-w-xs mx-auto">Comece a adicionar os insumos para calcular o custo real de produção.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-4 px-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#1A110C]/40">
                          <div className="flex-1">Insumo</div>
                          <div className="w-32">Medida</div>
                          <div className="w-24 text-right pr-2">Custo Ref.</div>
                          <div className="w-10"></div>
                        </div>
                        {recipeItems.map((item, index) => {
                          const ingData = ingredients.find(i => i.id === item.ingredientId);
                          return (
                            <div key={index} className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-black/5 hover:border-black/10 transition-colors group">
                              <div className="flex-1">
                                <select 
                                  value={item.ingredientId} 
                                  onChange={(e) => updateRecipeItem(index, 'ingredientId', parseInt(e.target.value))}
                                  className="w-full bg-transparent focus:outline-none font-bold text-sm text-[#1A110C] cursor-pointer"
                                >
                                  {ingredients.map(ing => (
                                    <option key={ing.id} value={ing.id}>{ing.nome}</option>
                                  ))}
                                </select>
                                <span className="text-[10px] text-[#1A110C]/40 font-bold uppercase tracking-wider mt-1 block">
                                  Base: R$ {ingData?.custo.toFixed(2).replace('.', ',')} / {ingData?.unidade}
                                </span>
                              </div>
                              <div className="w-32 relative">
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--color-pao-dourado)] pointer-events-none">
                                  {ingData?.unidade}
                                </span>
                                <input 
                                  type="number" 
                                  step={getStepForUnit(item.ingredientId)}
                                  min="0"
                                  value={item.quantidade} 
                                  onChange={(e) => updateRecipeItem(index, 'quantidade', parseFloat(e.target.value) || 0)}
                                  className="w-full bg-black/5 pl-4 pr-14 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-pao-dourado)] text-[#1A110C] font-mono font-bold text-sm transition-all"
                                />
                              </div>
                              <div className="w-24 text-right pr-2">
                                <span className="font-mono font-bold text-red-500 block">
                                  R$ {((ingData?.custo || 0) * item.quantidade).toFixed(2).replace('.', ',')}
                                </span>
                              </div>
                              <button onClick={() => removeRecipeItem(index)} className="w-10 h-10 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <button 
                      onClick={addRecipeItem}
                      className="mt-6 w-full py-4 rounded-2xl border-2 border-dashed border-black/10 text-[#1A110C]/60 font-bold hover:bg-black/5 hover:text-[#1A110C] hover:border-black/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" /> Inserir Novo Ingrediente
                    </button>
                  </div>
                  <div className="bg-white border-t border-black/5 p-6 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.02)] relative z-10">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#1A110C]/40 mb-1">Custo Total / Rendimento</p>
                      <div className="flex items-end gap-2">
                        <p className="text-2xl font-mono font-bold text-[#1A110C]">
                          R$ {(calculateRecipeCost(recipeItems) / (parseFloat(rendimento.replace(",", ".")) || 1)).toFixed(2).replace('.', ',')}
                        </p>
                        <span className="text-xs font-bold text-black/40 mb-1">por unidade</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleSaveRecipe}
                      className="bg-[var(--color-pao-dourado)] hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      Salvar Ficha Técnica
                    </button>
                  </div>
                </>
              )}
              </div>
            </div>
        </motion.div>
      )}
    </div>
  );
}
