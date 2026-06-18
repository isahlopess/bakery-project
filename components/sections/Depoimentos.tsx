"use client";

import { MessageSquare, Quote } from "lucide-react";

const depoimentosLinha1 = [
    {
        id: 1,
        autor: "Helena Ramos",
        funcao: "Vizinha & Cliente diária",
        texto: "Entrar aqui logo cedo é meu ritual favorito. O cheiro do pão caseiro saindo do forno me abraça e me transporta direto para a infância."
    },
    {
        id: 2,
        autor: "Seu Zé",
        funcao: "Morador do Bairro",
        texto: "O pão de queijo daqui é imbatível. Sempre quentinho, crocante por fora e super macio por dentro, a base perfeita pro meu café da manhã!"
    },
    {
        id: 3,
        autor: "Profª Maria",
        funcao: "Cliente Fiel",
        texto: "A rosca doce com coco é uma verdadeira obra de arte: massa que se desfaz na boca, com aquele sabor acentuado e inesquecível, feito com todo amor do mundo."
    }
];

const depoimentosLinha2 = [
    {
        id: 4,
        autor: "João Paulo",
        funcao: "Motorista de App",
        texto: "Sempre que passo na rua sinto o cheiro e tenho que parar. O sabor da esfiha de carne com um cafezinho no balcão salva o meu dia!"
    },
    {
        id: 5,
        autor: "Dona Lourdes",
        funcao: "Mãe e Avó",
        texto: "O sonho recheado daqui é simplesmente maravilhoso. Levo para os meus netos todo final de semana e não sobra um farelo na mesa."
    },
    {
        id: 6,
        autor: "Carlos Silva",
        funcao: "Trabalhador Local",
        texto: "O casamento perfeito do café coado fresquinho com o bolo de cenoura. Um refúgio super acolhedor no meio do dia com atendimento que te faz sentir em casa."
    }
];

export default function Depoimentos() {
    return (
        <section
            id="depoimentos"
            className="relative w-full py-16 sm:py-24 bg-[var(--color-creme)] overflow-hidden border-t border-[var(--color-pao-dourado)]/10"
        >
            <style jsx global>{`
                @keyframes marqueeLeft {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marqueeRight {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .marquee-left-container {
                    display: flex;
                    width: max-content;
                    animation: marqueeLeft 38s linear infinite;
                    will-change: transform;
                }
                .marquee-right-container {
                    display: flex;
                    width: max-content;
                    animation: marqueeRight 38s linear infinite;
                    will-change: transform;
                }
                .marquee-left-container:hover,
                .marquee-right-container:hover {
                    animation-play-state: paused;
                }
                @media (prefers-reduced-motion: reduce) {
                    .marquee-left-container,
                    .marquee-right-container {
                        animation: none;
                    }
                }
            `}</style>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,160,91,0.05)_0%,transparent_80%)] pointer-events-none" />
            <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16 px-4 sm:px-6 select-none">
                <div className="inline-flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-[var(--color-terracota)]" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-terracota)]">
                        Partilhando Afeto
                    </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-marrom-cafe)] mb-3 sm:mb-4 leading-tight">
                    Palavras de <span className="text-[var(--color-pao-escuro)]">Aconchego.</span>
                </h2>
                <p className="text-[#7A5C48] text-sm sm:text-base md:text-lg leading-relaxed">
                    O maior prêmio de acordar cedo todos os dias é ouvir quem se alimenta de nosso cuidado.
                </p>
            </div>
            <div className="flex flex-col gap-6 sm:gap-8 w-full select-none">
                <div className="w-full overflow-hidden flex relative py-1 sm:py-2">
                    <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[var(--color-creme)] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[var(--color-creme)] to-transparent z-10 pointer-events-none" />
                    <div className="marquee-left-container gap-4 sm:gap-6 px-2 sm:px-4">
                        {[...depoimentosLinha1, ...depoimentosLinha1].map((depo, idx) => (
                            <div
                                key={`${depo.id}-${idx}`}
                                className="min-w-[280px] w-[280px] sm:min-w-[380px] sm:w-[380px] md:w-[420px] bg-[var(--color-branco-quente)] border border-[var(--color-pao-dourado)]/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-[0_15px_30px_rgba(58,36,24,0.05)] hover:border-[var(--color-pao-dourado)]/30 transition-all duration-300 cursor-pointer"
                            >
                                <div className="mb-5 sm:mb-6 relative">
                                    <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-pao-dourado)]/20 absolute -top-2 sm:-top-3 -left-2 sm:-left-3" />
                                    <p className="text-xs sm:text-sm md:text-base text-[#6E5445] leading-relaxed font-medium pl-3 sm:pl-4 relative z-10">
                                        &ldquo;{depo.texto}&rdquo;
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 border-t border-[var(--color-pao-dourado)]/10 pt-3 sm:pt-4">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color-pao-dourado)]/15 text-[var(--color-terracota)] font-serif font-bold flex items-center justify-center text-sm sm:text-base flex-shrink-0">
                                        {depo.autor.charAt(0)}
                                    </div>
                                    <div className="text-left min-w-0">
                                        <h4 className="text-xs sm:text-sm font-bold text-[var(--color-marrom-cafe)] truncate">
                                            {depo.autor}
                                        </h4>
                                        <p className="text-[10px] sm:text-[11px] font-bold text-[var(--color-pao-escuro)] uppercase tracking-wider truncate">
                                            {depo.funcao}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full overflow-hidden flex relative py-1 sm:py-2">
                    <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[var(--color-creme)] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[var(--color-creme)] to-transparent z-10 pointer-events-none" />
                    <div className="marquee-right-container gap-4 sm:gap-6 px-2 sm:px-4">
                        {[...depoimentosLinha2, ...depoimentosLinha2].map((depo, idx) => (
                            <div
                                key={`${depo.id}-${idx}`}
                                className="min-w-[280px] w-[280px] sm:min-w-[380px] sm:w-[380px] md:w-[420px] bg-[var(--color-branco-quente)] border border-[var(--color-pao-dourado)]/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-[0_15px_30px_rgba(58,36,24,0.05)] hover:border-[var(--color-pao-dourado)]/30 transition-all duration-300 cursor-pointer"
                            >
                                <div className="mb-5 sm:mb-6 relative">
                                    <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-pao-dourado)]/20 absolute -top-2 sm:-top-3 -left-2 sm:-left-3" />
                                    <p className="text-xs sm:text-sm md:text-base text-[#6E5445] leading-relaxed font-medium pl-3 sm:pl-4 relative z-10">
                                        &ldquo;{depo.texto}&rdquo;
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 border-t border-[var(--color-pao-dourado)]/10 pt-3 sm:pt-4">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color-pao-dourado)]/15 text-[var(--color-terracota)] font-serif font-bold flex items-center justify-center text-sm sm:text-base flex-shrink-0">
                                        {depo.autor.charAt(0)}
                                    </div>
                                    <div className="text-left min-w-0">
                                        <h4 className="text-xs sm:text-sm font-bold text-[var(--color-marrom-cafe)] truncate">
                                            {depo.autor}
                                        </h4>
                                        <p className="text-[10px] sm:text-[11px] font-bold text-[var(--color-pao-escuro)] uppercase tracking-wider truncate">
                                            {depo.funcao}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
