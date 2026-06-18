"use client";

import { useRef, useState, useEffect } from "react";
import { Clock, MapPin, Phone, Volume2, VolumeX } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function VisiteNos() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const audioCleanupRef = useRef<{ stop: () => void } | null>(null);

    const toggleSound = () => {
        if (isPlaying) {
            if (audioCleanupRef.current) {
                audioCleanupRef.current.stop();
                audioCleanupRef.current = null;
            }
            setIsPlaying(false);
        } else {
            if (!audioCtxRef.current) {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                audioCtxRef.current = new AudioContextClass();
            }

            const ctx = audioCtxRef.current;
            if (ctx.state === "suspended") {
                ctx.resume();
            }

            const bufferSize = ctx.sampleRate * 2;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.018 * white)) / 1.018;
                lastOut = output[i];
                output[i] *= 3.8;
            }

            const rumbleSource = ctx.createBufferSource();
            rumbleSource.buffer = noiseBuffer;
            rumbleSource.loop = true;

            const rumbleFilter = ctx.createBiquadFilter();
            rumbleFilter.type = "lowpass";
            rumbleFilter.frequency.setValueAtTime(140, ctx.currentTime);

            const rumbleGain = ctx.createGain();
            rumbleGain.gain.setValueAtTime(0.25, ctx.currentTime);

            rumbleSource.connect(rumbleFilter);
            rumbleFilter.connect(rumbleGain);
            rumbleGain.connect(ctx.destination);
            rumbleSource.start();

            const intervalId = setInterval(() => {
                if (Math.random() > 0.45) {
                    const osc = ctx.createOscillator();
                    const filter = ctx.createBiquadFilter();
                    const gain = ctx.createGain();

                    osc.type = "triangle";
                    osc.frequency.setValueAtTime(150 + Math.random() * 350, ctx.currentTime);

                    filter.type = "bandpass";
                    filter.frequency.setValueAtTime(800 + Math.random() * 1500, ctx.currentTime);
                    filter.Q.setValueAtTime(5, ctx.currentTime);

                    gain.gain.setValueAtTime(0.06, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(ctx.destination);

                    osc.start();
                    osc.stop(ctx.currentTime + 0.05);
                }
            }, 180);

            audioCleanupRef.current = {
                stop: () => {
                    try {
                        rumbleSource.stop();
                    } catch (e) {}
                    clearInterval(intervalId);
                }
            };
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        return () => {
            if (audioCleanupRef.current) {
                audioCleanupRef.current.stop();
            }
        };
    }, []);

    return (
        <section
            id="visite-nos"
            className="relative w-full py-20 sm:py-28 px-4 sm:px-6 md:px-16 bg-[var(--color-marrom-profundo)] text-[var(--color-creme)] overflow-hidden"
        >
            <div className="absolute top-0 left-0 right-0 h-10 sm:h-14 overflow-hidden pointer-events-none z-10">
                <svg viewBox="0 0 1440 120" className="w-full h-full fill-[var(--color-creme)]" preserveAspectRatio="none">
                    <path d="M0,0 C240,65 480,90 720,90 C960,90 1200,65 1440,0 L1440,120 L0,120 Z" />
                </svg>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,180,104,0.06)_0%,transparent_60%)] pointer-events-none" />
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 relative z-10 mt-6 sm:mt-10">
                <div className="w-full lg:w-1/2 flex flex-col items-start text-left select-none">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="h-px w-6 bg-[var(--color-pao-dourado)]" />
                        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-pao-dourado)]">
                            Visite Nossa Casa
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-branco-quente)] mb-6 sm:mb-8 leading-tight">
                        Venha Sentir o <br className="hidden sm:block" />
                        <span className="text-[var(--color-pao-dourado)]">Cheirinho de Pão.</span>
                    </h2>
                    <div className="flex flex-col gap-5 sm:gap-6 w-full mb-8 sm:mb-10">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-[var(--color-marrom-cafe)] rounded-xl sm:rounded-2xl text-[var(--color-pao-dourado)] border border-[var(--color-pao-dourado)]/15 flex-shrink-0">
                                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-pao-dourado)] mb-0.5 sm:mb-1">
                                    Endereço
                                </h4>
                                <p className="text-[#D3C1B5] text-sm sm:text-base font-medium">
                                    Alameda dos Trigos, 452 — Bairro Jardim do Trigo, São Paulo
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-[var(--color-marrom-cafe)] rounded-xl sm:rounded-2xl text-[var(--color-pao-dourado)] border border-[var(--color-pao-dourado)]/15 flex-shrink-0">
                                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-pao-dourado)] mb-0.5 sm:mb-1">
                                    Horário de Funcionamento
                                </h4>
                                <p className="text-[#D3C1B5] text-sm sm:text-base font-medium">
                                    Terça a Sábado: 07h às 19h <br />
                                    Domingo e Feriados: 07h às 13h
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-[var(--color-marrom-cafe)] rounded-xl sm:rounded-2xl text-[var(--color-pao-dourado)] border border-[var(--color-pao-dourado)]/15 flex-shrink-0">
                                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-pao-dourado)] mb-0.5 sm:mb-1">
                                    Contato Direto
                                </h4>
                                <p className="text-[#D3C1B5] text-sm sm:text-base font-medium">
                                    (99) 99999-9999 — Encomendas sazonais
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
                        <MagneticButton>
                            <a
                                href="https://wa.me/5599999999999"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[var(--color-terracota)] text-[var(--color-creme)] rounded-full font-bold text-base sm:text-lg shadow-[0_10px_30px_rgba(181,87,43,0.3)] hover:bg-[var(--color-pao-dourado)] transition-colors duration-500 hover:shadow-[0_15px_35px_rgba(217,160,91,0.25)] cursor-hover-target text-center"
                            >
                                Reservar via WhatsApp
                            </a>
                        </MagneticButton>
                        <button
                            onClick={toggleSound}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-[var(--color-marrom-cafe)] hover:bg-[var(--color-marrom-cafe)]/85 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors border border-[var(--color-pao-dourado)]/10"
                        >
                            {isPlaying ? (
                                <>
                                    <VolumeX className="w-4 h-4 text-[var(--color-terracota)]" />
                                    <span>Silenciar Forno</span>
                                </>
                            ) : (
                                <>
                                    <Volume2 className="w-4 h-4 text-[var(--color-pao-dourado)]" />
                                    <span>Ouvir Forno Acesando</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 flex items-center justify-center relative">
                    <div className="w-full max-w-[480px] h-[300px] sm:h-[360px] md:h-[420px] bg-[var(--color-marrom-cafe)] rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[var(--color-pao-dourado)]/10 overflow-hidden relative group">
                        <svg viewBox="0 0 400 300" className="w-full h-full text-[var(--color-pao-dourado)]/15 fill-none stroke-current" strokeWidth="2">
                            <path d="M 30,30 Q 80,10 120,40 Q 150,80 100,100 Q 50,110 30,70 Z" fill="var(--color-verde-trigo)" className="opacity-10" stroke="none" />
                            <path d="M 280,180 Q 320,150 360,200 Q 340,260 280,240 Q 240,210 280,180 Z" fill="var(--color-verde-trigo)" className="opacity-10" stroke="none" />
                            <path d="M -10,80 L 410,80" />
                            <path d="M -10,220 L 410,220" />
                            <path d="M 80,-10 L 80,310" />
                            <path d="M 280,-10 L 280,310" />
                            <path d="M -10,260 L 410,50" strokeWidth="3" stroke="var(--color-pao-dourado)" className="opacity-25" />
                            <path d="M 180,80 L 180,220" strokeWidth="1.2" />
                            <path d="M 80,150 L 280,150" strokeWidth="1.2" />
                            <path d="M 330,80 L 330,220" strokeWidth="1.2" />
                            <path d="M -10,10 Q 120,80 200,10 Q 280,-40 410,20" stroke="var(--color-creme)" strokeWidth="4" className="opacity-15" />
                            <g transform="translate(180, 150)" className="cursor-pointer">
                                <circle cx="0" cy="0" r="18" fill="var(--color-terracota)" className="opacity-25 animate-ping" />
                                <circle cx="0" cy="0" r="8" fill="var(--color-terracota)" />
                                <circle cx="0" cy="0" r="4" fill="var(--color-branco-quente)" />
                            </g>
                            <text x="188" y="142" fill="var(--color-branco-quente)" fontSize="10" fontWeight="bold" fontFamily="var(--font-serif)" className="font-serif">
                                Nossa Padaria
                            </text>
                            <text x="90" y="72" fill="var(--color-creme)" fontSize="8" className="opacity-40">
                                Av. dos Trigos
                            </text>
                            <text x="12" y="28" fill="var(--color-verde-trigo)" fontSize="8" className="opacity-50">
                                Parque Verde
                            </text>
                        </svg>
                        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-[var(--color-marrom-profundo)]/95 border border-[var(--color-pao-dourado)]/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex justify-between items-center z-10 select-none">
                            <div className="min-w-0 mr-3">
                                <h5 className="text-xs sm:text-sm font-bold text-[var(--color-branco-quente)] truncate">
                                    Alameda dos Trigos, 452
                                </h5>
                                <p className="text-[10px] sm:text-xs text-[var(--color-pao-dourado)] truncate">
                                    Fácil acesso com estacionamento
                                </p>
                            </div>
                            <a
                                href="https://maps.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--color-marrom-cafe)] hover:bg-[var(--color-pao-dourado)]/10 text-[10px] sm:text-xs font-bold uppercase rounded-lg border border-[var(--color-pao-dourado)]/15 text-[var(--color-pao-dourado)] hover:text-[var(--color-branco-quente)] transition-colors cursor-hover-target flex-shrink-0"
                            >
                                Abrir GPS
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
