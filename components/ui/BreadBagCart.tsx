"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import Image from "next/image";
import Link from "next/link";

export default function BreadBagCart({ isStoreOpen = true }: { isStoreOpen?: boolean }) {
    const {
        items,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalFormatado,
        getItemCount,
        isOpen,
        setIsOpen,
    } = useCart();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (isOpen) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        }
        return () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const itemCount = getItemCount();

    const drawerContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-[#0D0705]/75 backdrop-blur-2xl z-[9998]"
                    />
                    <motion.div
                        key="drawer"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[420px] sm:max-w-[420px] h-screen bg-[var(--color-creme)]/85 backdrop-blur-2xl border-l border-white/40 shadow-[-20px_0_60px_rgba(42,29,22,0.1)] z-[9999] flex flex-col overscroll-contain"
                    >
                        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-pao-dourado)]/15 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-[var(--color-terracota)]" />
                                <h3 className="text-lg font-serif font-bold text-[var(--color-marrom-cafe)]">
                                    Sua Sacola
                                </h3>
                                <span className="text-xs font-bold text-[var(--color-pao-escuro)] bg-[var(--color-pao-dourado)]/15 px-2.5 py-1 rounded-full">
                                    {itemCount} {itemCount === 1 ? "item" : "itens"}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-[var(--color-pao-dourado)]/10 rounded-xl transition-colors"
                                aria-label="Fechar sacola"
                            >
                                <X className="w-5 h-5 text-[var(--color-marrom-cafe)]" />
                            </button>
                        </div>
                        {!isStoreOpen && (
                            <div className="bg-red-50 border-b border-red-100 px-6 py-3 flex items-center justify-center text-center">
                                <span className="text-sm font-bold text-red-600">
                                    Loja fechada. Pedidos temporariamente pausados.
                                </span>
                            </div>
                        )}
                        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4 scrollbar-thin" data-lenis-prevent="true">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center gap-4 select-none">
                                    <div className="w-20 h-20 bg-[var(--color-pao-dourado)]/10 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-10 h-10 text-[var(--color-pao-dourado)]/40" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-serif font-bold text-[var(--color-marrom-cafe)] mb-1">
                                            Sacola vazia
                                        </h4>
                                        <p className="text-sm text-[#7A5C48]">
                                            Adicione itens do cardápio para começar
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <AnimatePresence mode="popLayout">
                                        {items.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, x: 30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -30, height: 0 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                className="flex gap-4 p-3 glass-card rounded-2xl border border-white/50"
                                            >
                                                <div className="w-20 h-20 relative rounded-xl overflow-hidden flex-shrink-0 border border-[var(--color-pao-dourado)]/10">
                                                    <Image
                                                        src={item.imagem}
                                                        alt={item.nome}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                                    <div>
                                                        <h4 className="text-sm font-serif font-bold text-[var(--color-marrom-cafe)] truncate">
                                                            {item.nome}
                                                        </h4>
                                                        <span className="text-xs font-bold text-[var(--color-terracota)]">
                                                            {item.precoFormatado}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantidade - 1
                                                                    )
                                                                }
                                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--color-creme)] border border-[var(--color-pao-dourado)]/15 hover:bg-[var(--color-pao-dourado)]/10 transition-colors"
                                                                aria-label="Diminuir quantidade"
                                                            >
                                                                <Minus className="w-3.5 h-3.5 text-[var(--color-marrom-cafe)]" />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-bold text-[var(--color-marrom-cafe)]">
                                                                {item.quantidade}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantidade + 1
                                                                    )
                                                                }
                                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--color-creme)] border border-[var(--color-pao-dourado)]/15 hover:bg-[var(--color-pao-dourado)]/10 transition-colors"
                                                                aria-label="Aumentar quantidade"
                                                            >
                                                                <Plus className="w-3.5 h-3.5 text-[var(--color-marrom-cafe)]" />
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-[var(--color-pao-escuro)]">
                                                                R$ {(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
                                                            </span>
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                                                                aria-label={`Remover ${item.nome}`}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5 text-[#A59286] group-hover:text-red-500 transition-colors" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                        {items.length > 0 && (
                            <div className="p-6 border-t border-[var(--color-pao-dourado)]/15 bg-[var(--color-creme)]/40 backdrop-blur-md flex-shrink-0">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[15px] font-bold text-[var(--color-pao-escuro)]">Subtotal</span>
                                    <span className="text-2xl font-serif font-bold text-[var(--color-marrom-profundo)]">
                                        {getTotalFormatado()}
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={clearCart}
                                        className="px-4 py-3 rounded-xl border-2 border-[var(--color-pao-dourado)]/20 text-[var(--color-pao-escuro)] font-bold text-sm hover:bg-[var(--color-pao-dourado)]/10 transition-colors"
                                    >
                                        Limpar
                                    </button>
                                    {isStoreOpen ? (
                                        <Link 
                                            href="/checkout"
                                            onClick={(e) => {
                                                const target = e.currentTarget;
                                                target.innerHTML = '<svg class="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processando...';
                                                target.classList.add('opacity-80', 'cursor-wait');
                                                setTimeout(() => setIsOpen(false), 2000);
                                            }}
                                            className="flex-1 bg-[var(--color-terracota)] text-white font-bold text-sm py-3 rounded-xl hover:bg-[var(--color-marrom-cafe)] transition-colors shadow-lg shadow-[var(--color-terracota)]/20 flex items-center justify-center gap-2"
                                        >
                                            Finalizar Compra
                                        </Link>
                                    ) : (
                                        <div className="flex-1 bg-red-100 text-red-600 font-bold text-sm py-3 rounded-xl border border-red-200 flex items-center justify-center gap-2 cursor-not-allowed">
                                            Loja Fechada
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 group cursor-hover-target"
                aria-label="Abrir sacola de compras"
            >
                <svg
                    viewBox="0 0 32 32"
                    className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    strokeWidth="1.8"
                    stroke="currentColor"
                >
                    <path
                        d="M6 12 L6 27 C6 28.5 7 29 8 29 L24 29 C25 29 26 28.5 26 27 L26 12 Z"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M11 12 L11 8 C11 5 13 3 16 3 C19 3 21 5 21 8 L21 12"
                        strokeLinecap="round"
                        fill="none"
                    />
                    <ellipse
                        cx="16"
                        cy="12"
                        rx="6"
                        ry="3"
                        fill="var(--color-pao-dourado)"
                        stroke="var(--color-pao-escuro)"
                        strokeWidth="1.2"
                    />
                    <path
                        d="M13 11.5 Q16 10 19 11.5"
                        stroke="var(--color-pao-escuro)"
                        strokeWidth="0.8"
                        fill="none"
                    />
                </svg>
                <AnimatePresence>
                    {itemCount > 0 && (
                        <motion.span
                            key="badge"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-terracota)] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md"
                        >
                            {itemCount > 9 ? "9+" : itemCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>
            {mounted && typeof document !== 'undefined' ? createPortal(drawerContent, document.body) : null}
        </>
    );
}
