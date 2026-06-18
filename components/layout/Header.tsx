"use client";

import { useState, useEffect } from "react";
import { Wheat, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MagneticButton from "@/components/ui/MagneticButton";
import BreadBagCart from "@/components/ui/BreadBagCart";

const menuLinks = [
    { nome: "A Fornada", href: "#vitrine" },
    { nome: "Cardápio", href: "#cardapio" },
    { nome: "Depoimentos", href: "#depoimentos" },
    { nome: "Visite-nos", href: "#visite-nos" }
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsOpen(false);
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b select-none ${
                scrolled
                    ? "bg-[var(--color-marrom-profundo)]/90 backdrop-blur-xl py-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.2)] border-[var(--color-pao-dourado)]/10"
                    : "bg-[var(--color-marrom-profundo)]/70 backdrop-blur-md py-5 border-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="flex items-center gap-2 text-[var(--color-creme)] hover:text-[var(--color-pao-dourado)] transition-colors group cursor-hover-target"
                >
                    <Wheat className="w-6 h-6 text-[var(--color-pao-dourado)] group-hover:rotate-12 transition-transform duration-300" />
                    <span className="font-serif text-xl md:text-2xl font-bold tracking-tight">
                        Padaria<span className="text-[var(--color-terracota)]">.</span>
                    </span>
                </a>
                <nav className="hidden md:flex items-center gap-8 font-semibold text-sm uppercase tracking-wider text-[var(--color-creme)]/80">
                    {menuLinks.map((link) => (
                        <a
                            key={link.nome}
                            href={link.href}
                            onClick={(e) => handleLinkClick(e, link.href)}
                            className="hover:text-[var(--color-pao-dourado)] transition-colors duration-300 py-1.5 border-b-2 border-transparent hover:border-[var(--color-pao-dourado)] cursor-hover-target"
                        >
                            {link.nome}
                        </a>
                    ))}
                </nav>
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <MagneticButton>
                            <a
                                href="https://wa.me/5599999999999"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2.5 bg-[var(--color-terracota)] hover:bg-[var(--color-pao-escuro)] text-[var(--color-creme)] text-sm font-bold uppercase tracking-wider rounded-full transition-colors duration-500 shadow-md cursor-hover-target"
                            >
                                Encomendar
                            </a>
                        </MagneticButton>
                    </div>
                    <div className="text-[var(--color-creme)] hover:text-[var(--color-pao-dourado)] transition-colors">
                        <BreadBagCart />
                    </div>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-[var(--color-creme)] hover:text-[var(--color-pao-dourado)] transition-colors"
                        aria-label="Abrir menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="md:hidden absolute top-full left-0 right-0 bg-[var(--color-marrom-profundo)] border-b border-[var(--color-pao-dourado)]/10 shadow-xl overflow-hidden"
                    >
                        <nav className="flex flex-col gap-6 px-8 py-10 font-bold uppercase tracking-widest text-base text-[var(--color-creme)]">
                            {menuLinks.map((link) => (
                                <a
                                    key={link.nome}
                                    href={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    className="hover:text-[var(--color-pao-dourado)] transition-colors"
                                >
                                    {link.nome}
                                </a>
                            ))}
                            <a
                                href="https://wa.me/5599999999999"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 bg-[var(--color-terracota)] text-center text-[var(--color-creme)] text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[var(--color-pao-escuro)] transition-colors mt-4"
                            >
                                Encomendar Agora
                            </a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
