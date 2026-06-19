"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { Coffee, Wheat, Cookie, Flame, Plus, Check, X, BookOpen, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import Image from "next/image";

const categorias = [
    { id: "todos", nome: "Tudo", icone: Flame },
    { id: "paes", nome: "Pães & Salgados", icone: Wheat },
    { id: "doces", nome: "Doces & Bolos", icone: Cookie },
    { id: "bebidas", nome: "Cafés & Bebidas", icone: Coffee }
];

const ITEMS_PER_PAGE = 6;

const paperTextureSVG = "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')";

function AddToCartButton({ item }: { item: any }) {
    const { addItem } = useCart();
    const [justAdded, setJustAdded] = useState(false);

    const handleAdd = () => {
        addItem({ id: item.id, nome: item.nome, preco: item.preco, precoFormatado: item.precoFormatado, imagem: item.imagem });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1200);
    };

    return (
        <button
            onClick={handleAdd}
            className={`flex items-center justify-center w-7 h-7 rounded-full shadow-sm transition-all duration-300 ${
                justAdded ? "bg-green-600 text-white scale-110" : "bg-[var(--color-terracota)] hover:bg-[var(--color-pao-escuro)] text-[var(--color-creme)] hover:scale-110"
            }`}
            aria-label="Adicionar à sacola"
        >
            {justAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
    );
}

function printMenuPDF(produtos: any[]) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const css = `body{font-family:'Georgia',serif;background:#fff;color:#3A2418;padding:40px;text-align:center}h1{color:#B5572B;font-size:32px;margin-bottom:10px}.subtitle{color:#7A5C48;margin-bottom:40px;font-style:italic}.grid{display:grid;grid-template-columns:1fr 1fr;gap:30px;text-align:left}.item{border-bottom:1px dashed #D9A05B;padding-bottom:15px;break-inside:avoid}.header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px}.nome{font-size:18px;font-weight:bold}.preco{font-size:16px;font-weight:bold;color:#B5572B}.desc{font-size:14px;color:#735A4B;margin-top:5px}@media print{@page{margin:2cm}}`;
    const html = `<html><head><title>Cardapio - Padaria do Bairro</title><style>${css}</style></head><body><h1>Padaria do Bairro</h1><div class="subtitle">Cardápio Oficial — Feito à mão, com amor em cada detalhe.</div><div class="grid">${produtos.map(i => `<div class="item"><div class="header"><span class="nome">${i.nome}</span><span class="preco">${i.precoFormatado}</span></div><div class="desc">${i.desc}</div></div>`).join("")}</div><div style="margin-top:50px;font-size:12px;color:#A59286">Obrigado pela preferência!</div></body></html>`;
    iframe.contentWindow?.document.open();
    iframe.contentWindow?.document.write(html);
    iframe.contentWindow?.document.close();
    setTimeout(() => { iframe.contentWindow?.focus(); iframe.contentWindow?.print(); setTimeout(() => document.body.removeChild(iframe), 1000); }, 500);
}

function BookCover({ onOpen }: { onOpen: () => void }) {
    const handleDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.x > 80 || info.velocity.x > 200) onOpen();
    };

    return (
        <div className="relative w-full max-w-md mx-auto select-none" style={{ perspective: "1200px" }}>
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 250 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
                className="relative cursor-grab active:cursor-grabbing"
                whileDrag={{ rotateY: -12 }}
                style={{ transformOrigin: "left center" }}
            >
                <div className="relative w-full aspect-[3/4] rounded-r-lg rounded-l-sm overflow-hidden shadow-[8px_8px_30px_rgba(0,0,0,0.5),-2px_0_8px_rgba(0,0,0,0.15)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3A2418] via-[#4A3225] to-[#2B1B12]" />
                    <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: paperTextureSVG }} />
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/30 to-transparent" />
                    <div className="absolute inset-6 sm:inset-8 border border-[var(--color-pao-dourado)]/30 rounded-sm" />
                    <div className="absolute inset-8 sm:inset-10 border border-[var(--color-pao-dourado)]/50 rounded-sm" />

                    {[
                        "top-9 left-9 sm:top-11 sm:left-11",
                        "top-9 right-9 sm:top-11 sm:right-11 rotate-90",
                        "bottom-9 left-9 sm:bottom-11 sm:left-11 -rotate-90",
                        "bottom-9 right-9 sm:bottom-11 sm:right-11 rotate-180"
                    ].map((pos, i) => (
                        <svg key={i} className={`absolute ${pos} w-6 h-6 text-[var(--color-pao-dourado)]/40`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M2,2 Q2,12 12,12 M2,2 Q12,2 12,12" />
                            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
                        </svg>
                    ))}

                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-10 text-center z-10">
                        <svg className="w-16 h-4 text-[var(--color-pao-dourado)]/60" viewBox="0 0 64 16" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M0,8 Q16,0 32,8 T64,8" /><path d="M0,10 Q16,18 32,10 T64,10" />
                        </svg>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-pao-dourado)]/70">Padaria do Bairro</span>
                            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[var(--color-pao-dourado)] tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Cardápio</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="h-px w-8 bg-[var(--color-pao-dourado)]/40" />
                                <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--color-creme)]/50 font-medium">est. 2024</span>
                                <span className="h-px w-8 bg-[var(--color-pao-dourado)]/40" />
                            </div>
                        </div>
                        <p className="text-sm text-[var(--color-creme)]/40 italic font-serif max-w-[200px] leading-relaxed">
                            "Cada sabor carrega o calor de quem faz com o coração."
                        </p>
                        <svg className="w-16 h-4 text-[var(--color-pao-dourado)]/60 rotate-180" viewBox="0 0 64 16" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M0,8 Q16,0 32,8 T64,8" /><path d="M0,10 Q16,18 32,10 T64,10" />
                        </svg>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.6 }} className="flex flex-col items-center gap-3 mt-8">
                <button onClick={onOpen} className="flex items-center gap-2 px-6 py-3 bg-[var(--color-pao-dourado)]/10 hover:bg-[var(--color-pao-dourado)]/20 border border-[var(--color-pao-dourado)]/20 rounded-full text-[var(--color-pao-dourado)] text-sm font-bold uppercase tracking-wider transition-all duration-300">
                    <BookOpen className="w-4 h-4" />
                    Abrir Cardápio
                </button>
                <span className="text-[10px] text-[var(--color-creme)]/30 uppercase tracking-widest">ou arraste a capa →</span>
            </motion.div>
        </div>
    );
}

function OpenBook({ onClose, onImageClick, produtos }: { onClose: () => void, onImageClick: (url: string) => void, produtos: any[] }) {
    const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
    const [pagina, setPagina] = useState(0);

    const processados = produtos.map(p => ({
        ...p,
        precoFormatado: typeof p.preco === 'number' ? `R$ ${p.preco.toFixed(2).replace('.', ',')}` : p.preco
    }));

    const itensFiltrados = categoriaAtiva === "todos" ? processados : processados.filter(i => i.categoria === categoriaAtiva);

    const totalPaginas = Math.ceil(itensFiltrados.length / ITEMS_PER_PAGE);
    const itensPagina = itensFiltrados.slice(pagina * ITEMS_PER_PAGE, (pagina + 1) * ITEMS_PER_PAGE);

    const mudarCategoria = (id: string) => {
        setCategoriaAtiva(id);
        setPagina(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-5xl mx-auto select-none"
        >
            <div className="flex flex-col md:flex-row w-full rounded-lg overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
                <div className="relative w-full md:w-[38%] bg-[#F5F0E8] p-8 sm:p-10 flex flex-col justify-between">
                    <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: paperTextureSVG }} />
                    <div className="absolute inset-3 sm:inset-5 border border-[var(--color-pao-dourado)]/20 pointer-events-none rounded-sm" />
                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-[var(--color-terracota)]/70">Padaria do Bairro</span>
                            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-marrom-cafe)] mt-2 tracking-tight">Cardápio</h2>
                            <div className="flex items-center justify-center gap-3 mt-3">
                                <span className="h-px w-8 bg-[var(--color-terracota)]/40" />
                                <Wheat className="w-4 h-4 text-[var(--color-terracota)]/50" />
                                <span className="h-px w-8 bg-[var(--color-terracota)]/40" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            {categorias.map((cat) => {
                                const Icone = cat.icone;
                                const isActive = categoriaAtiva === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => mudarCategoria(cat.id)}
                                        className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                                            isActive
                                                ? "bg-[var(--color-terracota)]/10 text-[var(--color-terracota)] border-l-4 border-[var(--color-terracota)]"
                                                : "text-[var(--color-marrom-cafe)]/70 hover:text-[var(--color-marrom-cafe)] hover:bg-[var(--color-pao-dourado)]/5 border-l-4 border-transparent"
                                        }`}
                                    >
                                        <Icone className="w-4 h-4" />
                                        <span className="uppercase tracking-wider text-xs">{cat.nome}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="my-6 border-t border-[var(--color-pao-dourado)]/15" />
                        <p className="text-[13px] text-[#7A5C48] italic font-serif leading-relaxed text-center px-4">
                            "Cada fornada é um ato de amor. Sentimos paixão por transformar ingredientes simples em momentos inesquecíveis."
                        </p>
                    </div>
                    <div className="relative z-10 flex flex-col gap-3 mt-8">
                        <button onClick={() => printMenuPDF(processados)} className="flex items-center justify-center gap-2 w-full py-3 border border-[var(--color-marrom-cafe)]/20 text-[var(--color-marrom-cafe)]/70 hover:text-[var(--color-marrom-cafe)] hover:border-[var(--color-marrom-cafe)]/40 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all duration-300">
                            <Download className="w-3.5 h-3.5" />
                            Imprimir Cardápio (PDF)
                        </button>
                        <button onClick={onClose} className="flex items-center justify-center gap-2 w-full py-3 text-[var(--color-terracota)]/60 hover:text-[var(--color-terracota)] font-bold text-[10px] uppercase tracking-widest transition-colors">
                            <X className="w-3.5 h-3.5" />
                            Fechar Cardápio
                        </button>
                    </div>
                </div>
                <div className="relative w-full md:w-[62%] bg-[#FDFBF7] p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                    <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: paperTextureSVG }} />
                    <div className="absolute inset-3 sm:inset-5 border border-[var(--color-pao-dourado)]/15 pointer-events-none rounded-sm" />
                    <div className="relative z-10 flex-1">
                        <div className="text-center mb-8">
                            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-marrom-cafe)] tracking-tight">
                                {categorias.find(c => c.id === categoriaAtiva)?.nome || "Menu Completo"}
                            </h3>
                            <div className="flex items-center justify-center gap-3 mt-2">
                                <span className="h-px w-6 bg-[var(--color-terracota)]/30" />
                                <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--color-terracota)]/50 font-bold">
                                    {itensFiltrados.length} {itensFiltrados.length === 1 ? "item" : "itens"}
                                </span>
                                <span className="h-px w-6 bg-[var(--color-terracota)]/30" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-7">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${categoriaAtiva}-${pagina}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col gap-7"
                                >
                                    {itensPagina.map((item) => (
                                        <div key={item.id} className="group relative">
                                            <div className="flex items-end justify-between gap-2 mb-0.5">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div 
                                                        className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-[var(--color-pao-dourado)]/30 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                                                        onClick={() => {
                                                            onImageClick(item.imagem);
                                                            document.documentElement.style.overflow = 'hidden';
                                                            document.body.style.overflow = 'hidden';
                                                        }}
                                                    >
                                                        <Image src={item.imagem} alt={item.nome} fill className="object-cover" unoptimized />
                                                    </div>
                                                    <h4 className="text-[15px] font-serif font-bold text-[var(--color-marrom-cafe)] group-hover:text-[var(--color-terracota)] transition-colors truncate">
                                                        {item.nome}
                                                    </h4>
                                                </div>
                                                <div className="flex-grow border-b-2 border-dotted border-[var(--color-marrom-cafe)]/15 mb-1 mx-1 min-w-[16px]" />
                                                <span className="text-[15px] font-bold font-serif text-[var(--color-marrom-cafe)] whitespace-nowrap">
                                                    {item.precoFormatado}
                                                </span>
                                            </div>
                                            <div className="pl-[2.65rem] pr-8">
                                                <p className="text-[11px] text-[#735A4B] leading-relaxed italic">{item.desc}</p>
                                            </div>
                                            <div className="absolute right-0 top-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <AddToCartButton item={item} />
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className="relative z-10 flex items-center justify-between mt-8 pt-4 border-t border-[var(--color-pao-dourado)]/10">
                        <button
                            onClick={() => setPagina(Math.max(0, pagina - 1))}
                            disabled={pagina === 0}
                            className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                                pagina === 0 ? "text-[var(--color-marrom-cafe)]/20 cursor-not-allowed" : "text-[var(--color-terracota)] hover:text-[var(--color-pao-escuro)]"
                            }`}
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            Anterior
                        </button>
                        <span className="text-[11px] font-serif text-[var(--color-marrom-cafe)]/50 italic">
                            Página {pagina + 1} de {totalPaginas}
                        </span>
                        <button
                            onClick={() => setPagina(Math.min(totalPaginas - 1, pagina + 1))}
                            disabled={pagina >= totalPaginas - 1}
                            className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                                pagina >= totalPaginas - 1 ? "text-[var(--color-marrom-cafe)]/20 cursor-not-allowed" : "text-[var(--color-terracota)] hover:text-[var(--color-pao-escuro)]"
                            }`}
                        >
                            Próxima
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
export default function Cardapio({ produtos = [] }: { produtos?: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [imagemExpandida, setImagemExpandida] = useState<string | null>(null);

    useEffect(() => {
        const handleOpenCardapio = () => setIsOpen(true);
        window.addEventListener('openCardapio', handleOpenCardapio);
        return () => window.removeEventListener('openCardapio', handleOpenCardapio);
    }, []);

    return (
        <section
            id="cardapio"
            className="relative w-full py-24 px-4 sm:px-6 md:px-16 bg-[var(--color-marrom-profundo)] border-t border-[var(--color-pao-dourado)]/10 flex flex-col items-center justify-center overflow-hidden min-h-[80vh]"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,160,91,0.08)_0%,transparent_60%)] pointer-events-none" />
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.div key="cover" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full flex justify-center">
                        <BookCover onOpen={() => setIsOpen(true)} />
                    </motion.div>
                ) : (
                    <motion.div key="book" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full">
                        <OpenBook onClose={() => setIsOpen(false)} onImageClick={setImagemExpandida} produtos={produtos} />
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {imagemExpandida && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                            setImagemExpandida(null);
                            document.documentElement.style.overflow = '';
                            document.body.style.overflow = '';
                        }}
                        className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 cursor-pointer"
                        data-lenis-prevent="true"
                    >
                        <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="relative w-full max-w-2xl aspect-square overflow-hidden rounded-2xl shadow-2xl border border-white/10"
                        >
                            <Image
                                src={imagemExpandida}
                                alt="Imagem Expandida"
                                fill
                                className="object-cover transition-transform duration-500 ease-out scale-100 hover:scale-[1.02]"
                                unoptimized
                            />
                        </motion.div>
                        <span className="text-white/60 mt-6 font-bold tracking-widest uppercase text-xs">
                            Clique em qualquer lugar para fechar
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
