"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import MagneticButton from "@/components/ui/MagneticButton";
const BreadScene = dynamic(() => import("@/components/ui/BreadScene"), { ssr: false });

function FlourParticles({ disabled }: { disabled: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (disabled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: { x: number; y: number; r: number; speedX: number; speedY: number; opacity: number }[] = [];

        const resize = () => {
            if (!canvas) return;
            canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.2 + 0.4,
                speedX: (Math.random() - 0.5) * 0.12,
                speedY: Math.random() * 0.2 + 0.05,
                opacity: Math.random() * 0.35 + 0.08
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(217, 160, 91, ${p.opacity})`;
                ctx.fill();

                p.y += p.speedY;
                p.x += p.speedX;

                if (p.y > canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x > canvas.width || p.x < 0) {
                    p.x = Math.random() * canvas.width;
                }
            });
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [disabled]);

    if (disabled) return null;
    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

export default function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const steamRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isReducedMotion, setIsReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setIsReducedMotion(mediaQuery.matches);
        const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
        mediaQuery.addEventListener("change", listener);
        return () => mediaQuery.removeEventListener("change", listener);
    }, []);

    useGSAP(() => {
        if (isReducedMotion) {
            gsap.fromTo(
                ".hero-fade",
                { opacity: 0 },
                { opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.1 }
            );
            return;
        }

        const tl = gsap.timeline();

        gsap.to(backgroundRef.current, {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            }
        });

        const charElements = containerRef.current?.querySelectorAll(".char");
        if (charElements && charElements.length > 0) {
            tl.fromTo(
                charElements,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    stagger: 0.035,
                    ease: "power3.out"
                }
            );
        }

        tl.fromTo(
            ".hero-fade",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.12 },
            "-=0.55"
        );

        tl.fromTo(
            ".hero-3d-container",
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" },
            "-=0.7"
        );

        steamRefs.current.forEach((steam, index) => {
            if (!steam) return;
            gsap.fromTo(
                steam,
                { y: 40, x: index * 12 - 12, opacity: 0, scale: 0.5 },
                {
                    y: -230,
                    x: "+=35",
                    opacity: 0,
                    scale: 2.0,
                    duration: 4.5 + index * 0.5,
                    repeat: -1,
                    ease: "sine.inOut",
                    delay: index * 1.2
                }
            );
            gsap.to(steam, {
                opacity: 0.35,
                duration: (4.5 + index * 0.5) / 2,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: index * 1.2
            });
        });
    }, { scope: containerRef, dependencies: [isReducedMotion] });

    const titleText1 = "O Aroma";
    const titleText2 = "da Tradição.";

    const splitText = (text: string) => {
        return text.split("").map((char, index) => (
            <span
                key={index}
                className="char inline-block origin-bottom"
            >
                {char === " " ? "\u00A0" : char}
            </span>
        ));
    };

    return (
        <section
            ref={containerRef}
            className="relative flex min-h-screen w-full flex-col md:flex-row items-center justify-between overflow-hidden px-5 sm:px-6 md:px-16 pt-24 pb-20 md:pt-0 md:pb-0"
        >
            <div
                ref={backgroundRef}
                className="absolute inset-0 -z-20 w-full h-[115%] pointer-events-none select-none"
                style={{ top: "-5%" }}
            >
                <Image
                    src="/bakery_hero_bg.png"
                    alt="Mesa de ingredientes da padaria"
                    fill
                    priority
                    className="object-cover"
                    style={{ filter: 'blur(8px)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-marrom-profundo)]/95 via-[var(--color-marrom-profundo)]/85 to-transparent" />
            </div>
            <FlourParticles disabled={isReducedMotion} />
            <div className="absolute left-6 bottom-24 hidden lg:flex flex-col items-start gap-1 select-none pointer-events-none opacity-50">
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--color-creme)]">
                    Tradição Local
                </span>
                <span className="text-[9px] font-medium text-[var(--color-pao-dourado)]">
                    Feito com Amor
                </span>
            </div>
            <div className="z-10 flex w-full md:w-[48%] flex-col items-start text-left">
                <div className="hero-fade mb-5 flex items-center gap-2">
                    <span className="h-[2px] w-8 bg-[var(--color-pao-dourado)]" />
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-pao-dourado)]">
                        Artesanal & Quentinho
                    </span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-[5.5rem] font-serif font-bold text-[var(--color-branco-quente)] mb-6 leading-[1.05] tracking-tight select-none">
                    <span className="block overflow-hidden py-1">
                        {splitText(titleText1)}
                    </span>
                    <span className="block text-[var(--color-pao-dourado)] overflow-hidden py-1">
                        {splitText(titleText2)}
                    </span>
                </h1>
                <p className="hero-fade text-base sm:text-lg md:text-xl text-[#C5B3A7] max-w-md mb-8 sm:mb-10 font-medium leading-relaxed">
                    Sinta o calor em cada fornada. Pães de fermentação natural assados lentamente na pedra com leveduras selvagens e paciência.
                </p>
                <div className="hero-fade flex flex-col min-[380px]:flex-row items-start min-[380px]:items-center gap-4 min-[380px]:gap-6">
                    <MagneticButton>
                        <button
                            onClick={() => {
                                const target = document.getElementById("cardapio");
                                if (target) target.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="px-8 py-4 bg-[var(--color-terracota)] text-[var(--color-creme)] rounded-full font-bold text-lg shadow-[0_10px_35px_rgba(166,75,42,0.3)] hover:bg-[var(--color-pao-escuro)] transition-colors duration-500 hover:shadow-[0_15px_40px_rgba(166,75,42,0.5)] cursor-hover-target"
                        >
                            Ver Cardápio
                        </button>
                    </MagneticButton>
                </div>
            </div>
            <div className="hero-3d-container w-full md:w-[50%] h-[420px] sm:h-[480px] md:h-[580px] flex items-center justify-center relative mt-8 md:mt-0 z-20">
                <BreadScene />
                <div className="absolute -z-10 w-[550px] h-[550px] bg-[var(--color-glow-fumaca)] rounded-full blur-[120px] opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none z-10 select-none">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-creme)] opacity-50">
                    Role para ver mais
                </span>
                <div className="w-6 h-11 border-2 border-[var(--color-creme)]/30 rounded-full flex justify-center p-1 relative overflow-hidden bg-white/5 backdrop-blur-xs">
                    {!isReducedMotion ? (
                        <motion.svg
                            width="8"
                            height="14"
                            viewBox="0 0 12 20"
                            animate={{
                                y: [-4, 16, -4],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 2.2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-[var(--color-pao-dourado)] fill-current absolute"
                        >
                            <path d="M6,0 C4,4 3,8 3,12 C3,15 4,17 6,20 C8,17 9,15 9,12 C9,8 8,4 6,0 Z" />
                        </motion.svg>
                    ) : (
                        <div className="w-1.5 h-1.5 bg-[var(--color-pao-dourado)] rounded-full animate-bounce mt-1" />
                    )}
                </div>
            </div>
        </section>
    );
}