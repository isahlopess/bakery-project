"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, MoveLeft, MoveRight } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import Image from "next/image";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

function Card3DTilt({ children, className, tag }: { children: React.ReactNode; className: string; tag: string }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState({ transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)" });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const angleX = -((y - yc) / yc) * 7;
        const angleY = ((x - xc) / xc) * 7;

        setStyle({
            transform: `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={style}
            className={`transition-all duration-300 ease-out will-change-transform ${className}`}
            data-magnetic={tag === "O Favorito" ? "true" : undefined}
        >
            {children}
        </div>
    );
}

export default function Vitrine({ produtos }: { produtos: any[] }) {
    const sectionRef = useRef<HTMLElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { addItem } = useCart();
    const [isDesktop, setIsDesktop] = useState(false);
    const [isReducedMotion, setIsReducedMotion] = useState(false);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        containScroll: "trimSnaps",
        dragFree: true
    });

    const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
    const scrollNext = () => emblaApi && emblaApi.scrollNext();

    useEffect(() => {
        const checkPreferences = () => {
            setIsDesktop(window.innerWidth >= 768);
            setIsReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
        };

        checkPreferences();
        window.addEventListener("resize", checkPreferences);

        return () => window.removeEventListener("resize", checkPreferences);
    }, []);

    const renderCardContent = (produto: any) => {
        const priceNumber = typeof produto.preco === 'number' ? produto.preco : parseFloat(String(produto.preco).replace('R$ ', '').replace(',', '.'));
        const priceFormatted = typeof produto.preco === 'number' ? `R$ ${produto.preco.toFixed(2).replace('.', ',')}` : produto.preco;
        
        return (
        <>
            <div className="flex justify-between items-start w-full">
                <span className="px-4 py-1.5 bg-[var(--color-marrom-cafe)] text-[var(--color-creme)] text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {produto.tag || 'Destaque'}
                </span>
                <span className="text-xl font-bold font-serif text-[var(--color-terracota)]">
                    {priceFormatted}
                </span>
            </div>
            <div className="relative h-48 w-full overflow-hidden rounded-2xl mb-5 mt-5">
                <Image
                    src={produto.imagem}
                    alt={produto.nome}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
            <div className="flex flex-col items-start text-left w-full mt-auto">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-[var(--color-marrom-cafe)] mb-2 transition-colors duration-300 group-hover:text-[var(--color-terracota)] leading-snug">
                    {produto.nome}
                </h3>
                <p className="text-[#634b3d] text-sm leading-relaxed font-medium mb-4 line-clamp-3">
                    {produto.desc}
                </p>
                <button 
                    onClick={() => {
                        addItem({
                            id: produto.id,
                            nome: produto.nome,
                            preco: priceNumber,
                            precoFormatado: priceFormatted,
                            imagem: produto.imagem
                        });
                    }}
                    className="flex items-center gap-2 text-[var(--color-terracota)] font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                >
                    <span>Quero Provar</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </>
    )};
    return (
        <section
            ref={sectionRef}
            id="vitrine"
            className="relative min-h-screen w-full bg-[var(--color-marrom-profundo)] text-[var(--color-creme)] overflow-hidden flex flex-col justify-center py-20"
        >
            <div className="absolute inset-0 bg-radial-gradient(circle_at_bottom_left,rgba(217,160,91,0.1)_0%,transparent_60%) pointer-events-none -z-10" />
            <div className="relative md:absolute top-10 left-6 md:left-16 z-10 max-w-xl mb-12 md:mb-0">
                <div className="flex items-center gap-2 mb-2">
                    <span className="h-px w-6 bg-[var(--color-pao-dourado)]" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pao-dourado)]">
                        Assado na Hora
                    </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-[var(--color-branco-quente)] leading-tight">
                    Nossa <span className="text-[var(--color-pao-dourado)]">Fornada.</span>
                </h2>
                <p className="text-[#C5B3A7] mt-3 text-base md:text-lg max-w-sm leading-relaxed">
                    Explore nossas criações deliciosas, prontas para aquecer seu dia.
                </p>
            </div>
            <div className="w-full px-4 sm:px-6 md:px-16 mt-6 md:mt-40 select-none">
                <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
                    <div className="flex gap-4 sm:gap-6 md:gap-8 items-center h-[58vh]">
                        {produtos.map((produto) => (
                            <Card3DTilt
                                key={produto.id}
                                tag={produto.tag}
                                className={`vitrine-card flex-shrink-0 ${produto.bgColor} w-[82vw] sm:w-[320px] md:w-[380px] h-full max-h-[500px] rounded-3xl p-5 sm:p-6 md:p-8 flex flex-col justify-between shadow-xl group border border-[var(--color-pao-dourado)]/10`}
                            >
                                {renderCardContent(produto)}
                            </Card3DTilt>
                        ))}
                        <div 
                            onClick={() => {
                                document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' });
                                setTimeout(() => {
                                    window.dispatchEvent(new CustomEvent('openCardapio'));
                                }, 600);
                            }}
                            className="vitrine-card flex-shrink-0 w-[70vw] sm:w-[260px] md:w-[300px] h-full max-h-[500px] rounded-3xl border-2 border-dashed border-[var(--color-pao-dourado)]/30 flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:border-[var(--color-pao-dourado)] transition-colors duration-300"
                        >
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[var(--color-pao-dourado)]/10 text-[var(--color-pao-dourado)] flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                                <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <h4 className="text-lg md:text-xl font-serif font-bold text-[var(--color-branco-quente)] mb-1 md:mb-2">
                                Menu Completo
                            </h4>
                            <p className="text-[#C5B3A7] text-xs md:text-sm max-w-[180px] md:max-w-[200px]">
                                Consulte nossas fornadas e opções completas.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-8 justify-start">
                    <button
                        onClick={scrollPrev}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[var(--color-creme)]/20 flex items-center justify-center hover:bg-[var(--color-creme)]/10 text-[var(--color-creme)] transition-colors active:scale-95"
                        aria-label="Anterior"
                    >
                        <MoveLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[var(--color-creme)]/20 flex items-center justify-center hover:bg-[var(--color-creme)]/10 text-[var(--color-creme)] transition-colors active:scale-95"
                        aria-label="Próximo"
                    >
                        <MoveRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
}