"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Wheat } from "lucide-react";

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isReduced, setIsReduced] = useState(false);
    const [hasFinePointer, setHasFinePointer] = useState(false);

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const springConfig = { damping: 32, stiffness: 500, mass: 0.35 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setIsReduced(motionQuery.matches);
        const motionListener = (e: MediaQueryListEvent) => setIsReduced(e.matches);
        motionQuery.addEventListener("change", motionListener);

        const pointerQuery = window.matchMedia("(pointer: fine)");
        setHasFinePointer(pointerQuery.matches);
        const pointerListener = (e: MediaQueryListEvent) => setHasFinePointer(e.matches);
        pointerQuery.addEventListener("change", pointerListener);

        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX - 16);
            mouseY.set(e.clientY - 16);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("button, a, [data-magnetic], .cursor-hover-target")) {
                setIsHovering(true);
            }
        };

        const handleMouseOut = () => {
            setIsHovering(false);
        };

        window.addEventListener("mousemove", moveCursor);
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
            motionQuery.removeEventListener("change", motionListener);
            pointerQuery.removeEventListener("change", pointerListener);
        };
    }, [mouseX, mouseY]);

    if (isReduced || !hasFinePointer) return null;

    return (
        <motion.div
            className="pointer-events-none fixed top-0 left-0 flex items-center justify-center rounded-full w-8 h-8 z-[99999] shadow-md"
            style={{
                x: smoothX,
                y: smoothY,
                backgroundColor: "var(--color-marrom-cafe)",
                border: "2px solid rgba(255, 255, 255, 0.8)",
            }}
            animate={{
                scale: isHovering ? 1.8 : 1.0,
                backgroundColor: isHovering ? "var(--color-pao-dourado)" : "var(--color-marrom-cafe)",
                borderColor: isHovering ? "var(--color-pao-escuro)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: isHovering ? 0 : 2,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 24 }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: isHovering ? 1 : 0,
                    scale: isHovering ? 1 : 0,
                    rotate: isHovering ? 0 : -45
                }}
                transition={{ duration: 0.2 }}
            >
                <Wheat className="text-white w-4 h-4" strokeWidth={2} />
            </motion.div>
        </motion.div>
    );
}