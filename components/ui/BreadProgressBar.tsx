"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function BreadProgressBar() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isReduced, setIsReduced] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setIsReduced(mediaQuery.matches);
        const listener = (e: MediaQueryListEvent) => setIsReduced(e.matches);
        mediaQuery.addEventListener("change", listener);

        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalScroll > 150) {
                setScrollProgress(window.scrollY / totalScroll);
                setIsVisible(window.scrollY > 200);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            mediaQuery.removeEventListener("change", listener);
        };
    }, []);

    if (isReduced) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 50 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="fixed right-6 bottom-8 z-[999] flex flex-col items-center gap-2"
                >
                    <div className="absolute right-14 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-[var(--color-marrom-profundo)] text-[var(--color-creme)] text-xs py-1 px-3 rounded-md shadow-md whitespace-nowrap font-medium">
                        Crescimento do Pão: {Math.round(scrollProgress * 100)}%
                    </div>

                    <div className="relative w-14 h-14 bg-[var(--color-branco-quente)] rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(58,36,24,0.15)] border border-[var(--color-creme)] hover:scale-110 transition-transform duration-300 group cursor-pointer"
                         onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        <svg
                            viewBox="0 0 100 100"
                            className="w-10 h-10 select-none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <clipPath id="breadClip">
                                    <path d="M 50,15 C 25,15 15,35 15,55 C 15,75 25,85 50,85 C 75,85 85,75 85,55 C 85,35 75,15 50,15 Z" />
                                </clipPath>
                            </defs>
                            <path
                                d="M 50,15 C 25,15 15,35 15,55 C 15,75 25,85 50,85 C 75,85 85,75 85,55 C 85,35 75,15 50,15 Z"
                                fill="none"
                                stroke="var(--color-marrom-cafe)"
                                strokeWidth="3"
                                strokeDasharray="3 3"
                                className="opacity-30"
                            />
                            <path
                                d="M 35,35 Q 40,50 35,65 M 50,30 Q 55,50 50,70 M 65,35 Q 70,50 65,65"
                                fill="none"
                                stroke="var(--color-marrom-cafe)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                className="opacity-30"
                            />
                            <g clipPath="url(#breadClip)">
                                <rect
                                    x="0"
                                    y={100 - scrollProgress * 100}
                                    width="100"
                                    height="100"
                                    fill="var(--color-pao-dourado)"
                                    className="transition-all duration-100 ease-out"
                                />
                                <path
                                    d="M 35,35 Q 40,50 35,65 M 50,30 Q 55,50 50,70 M 65,35 Q 70,50 65,65"
                                    fill="none"
                                    stroke="var(--color-terracota)"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                />
                            </g>
                            <path
                                d="M 50,15 C 25,15 15,35 15,55 C 15,75 25,85 50,85 C 75,85 85,75 85,55 C 85,35 75,15 50,15 Z"
                                fill="none"
                                stroke="var(--color-marrom-cafe)"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
