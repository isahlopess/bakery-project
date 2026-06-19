"use client";

import { ArrowUp, Wheat, ShieldCheck } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

interface RodapeProps {
    store: {
        name: string;
        phone: string;
    };
}

export default function Rodape({ store }: RodapeProps) {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer
            className="relative w-full bg-[var(--color-marrom-profundo)] text-[var(--color-creme)] pt-16 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 md:px-16 border-t border-[var(--color-pao-dourado)]/10 overflow-hidden"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,160,91,0.04)_0%,transparent_50%)] pointer-events-none -z-10" />
            <div className="max-w-6xl mx-auto flex flex-col gap-12 sm:gap-16 relative z-10 select-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 text-left">
                    <div className="flex flex-col items-start gap-4 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 text-[var(--color-pao-dourado)]">
                            <Wheat className="w-7 h-7 sm:w-8 sm:h-8" />
                            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                                {store.name}<span className="text-[var(--color-terracota)]">.</span>
                            </span>
                        </div>
                        <p className="text-[#A59286] text-sm leading-relaxed font-medium max-w-xs">
                            Assando aconchego e tradição no coração do bairro. Ingredientes selecionados, paixão pela cozinha e muito amor em cada fornada fresquinha.
                        </p>
                    </div>
                    <div className="flex flex-col items-start gap-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-pao-dourado)]">
                            Navegação
                        </h4>
                        <ul className="flex flex-col gap-2.5 text-sm font-medium text-[#A59286]">
                            <li>
                                <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-[var(--color-branco-quente)] transition-colors">
                                    Início
                                </a>
                            </li>
                            <li>
                                <a href="#vitrine" className="hover:text-[var(--color-branco-quente)] transition-colors">
                                    Nossa Fornada
                                </a>
                            </li>
                            <li>
                                <a href="#cardapio" className="hover:text-[var(--color-branco-quente)] transition-colors">
                                    Cardápio
                                </a>
                            </li>
                            <li>
                                <a href="#visite-nos" className="hover:text-[var(--color-branco-quente)] transition-colors">
                                    Visite-nos
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-start gap-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-pao-dourado)]">
                            Redes Sociais
                        </h4>
                        <p className="text-[#A59286] text-xs leading-relaxed max-w-[220px] mb-1">
                            Acompanhe nossas fornadas diárias e promoções do dia.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-[var(--color-marrom-cafe)] hover:bg-[var(--color-terracota)] text-[var(--color-creme)] flex items-center justify-center border border-[var(--color-pao-dourado)]/10 transition-colors cursor-hover-target"
                                aria-label="Instagram"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                </svg>
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-[var(--color-marrom-cafe)] hover:bg-[var(--color-terracota)] text-[var(--color-creme)] flex items-center justify-center border border-[var(--color-pao-dourado)]/10 transition-colors cursor-hover-target"
                                aria-label="Facebook"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-pao-dourado)]">
                            Nossos Selos
                        </h4>
                        <div className="flex items-center gap-3 bg-[var(--color-marrom-cafe)] border border-[var(--color-pao-dourado)]/15 rounded-xl sm:rounded-2xl p-3 sm:p-4 w-full">
                            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--color-terracota)] shrink-0" />
                            <div className="text-left min-w-0">
                                <h5 className="text-xs font-bold text-[var(--color-branco-quente)]">
                                    Sempre Fresquinho
                                </h5>
                                <p className="text-[10px] text-[#A59286] font-medium leading-relaxed mt-0.5">
                                    Pães e doces feitos todos os dias com ingredientes de verdade.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-[var(--color-marrom-cafe)] pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                    <p className="text-[10px] sm:text-xs font-medium text-[#7C695E] text-center sm:text-left">
                        © {new Date().getFullYear()} {store.name}. Todos os direitos reservados.
                    </p>
                    <MagneticButton>
                        <button
                            onClick={scrollToTop}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--color-marrom-cafe)] hover:bg-[var(--color-terracota)] text-[var(--color-pao-dourado)] hover:text-[var(--color-creme)] flex items-center justify-center transition-colors border border-[var(--color-pao-dourado)]/10 cursor-hover-target"
                            aria-label="Voltar para o topo"
                        >
                            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </MagneticButton>
                </div>
            </div>
        </footer>
    );
}
