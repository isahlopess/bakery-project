"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Wheat, Check } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

const newsletterSchema = z.object({
    nome: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
    email: z.string().email({ message: "Por favor, insira um e-mail válido." })
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function Newsletter() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<NewsletterFormData>({
        resolver: zodResolver(newsletterSchema)
    });

    const onSubmit = async (data: NewsletterFormData) => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsSubmitted(true);
    };
    return (
        <section
            id="newsletter"
            className="relative w-full py-16 sm:py-24 px-4 sm:px-6 md:px-16 bg-[var(--color-branco-quente)] border-t border-[var(--color-pao-dourado)]/10 overflow-hidden"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(181,87,43,0.04)_0%,transparent_60%)] pointer-events-none" />
            <div className="max-w-4xl mx-auto bg-[var(--color-creme)] rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-16 border border-[var(--color-pao-dourado)]/15 shadow-[0_20px_50px_rgba(58,36,24,0.06)] relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-48 h-48 opacity-[0.03] pointer-events-none">
                    <Wheat className="w-full h-full text-[var(--color-marrom-cafe)]" />
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 relative z-10">
                    <div className="w-full lg:w-1/2 text-left select-none">
                        <div className="flex items-center gap-2 mb-3">
                            <Mail className="w-4 h-4 text-[var(--color-terracota)]" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-terracota)]">
                                Clube de Assinatura
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[var(--color-marrom-cafe)] mb-4 leading-tight">
                            Assine Nosso <br />
                            <span className="text-[var(--color-pao-escuro)]">Clube do Pão.</span>
                        </h2>
                        <p className="text-[#7A5C48] text-sm md:text-base leading-relaxed font-medium">
                            Receba fornadas exclusivas toda semana em casa, convites para degustações às cegas e segredos de fermentação natural direto na sua caixa de entrada.
                        </p>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <AnimatePresence mode="wait">
                            {!isSubmitted ? (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="flex flex-col gap-4 sm:gap-5 text-left"
                                >
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="nome" className="text-xs font-bold uppercase tracking-wider text-[var(--color-marrom-cafe)] opacity-75">
                                            Seu Primeiro Nome
                                        </label>
                                        <input
                                            type="text"
                                            id="nome"
                                            placeholder="Ex: Clara"
                                            {...register("nome")}
                                            className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[var(--color-branco-quente)] border border-[var(--color-pao-dourado)]/20 rounded-xl sm:rounded-2xl focus:outline-none focus:border-[var(--color-terracota)] focus:ring-1 focus:ring-[var(--color-terracota)] transition-all font-medium text-[var(--color-marrom-cafe)] placeholder:opacity-45 text-sm sm:text-base"
                                        />
                                        {errors.nome && (
                                            <span className="text-xs font-semibold text-[var(--color-terracota)] mt-1">
                                                {errors.nome.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[var(--color-marrom-cafe)] opacity-75">
                                            Seu E-mail Principal
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Ex: clara@exemplo.com"
                                            {...register("email")}
                                            className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[var(--color-branco-quente)] border border-[var(--color-pao-dourado)]/20 rounded-xl sm:rounded-2xl focus:outline-none focus:border-[var(--color-terracota)] focus:ring-1 focus:ring-[var(--color-terracota)] transition-all font-medium text-[var(--color-marrom-cafe)] placeholder:opacity-45 text-sm sm:text-base"
                                        />
                                        {errors.email && (
                                            <span className="text-xs font-semibold text-[var(--color-terracota)] mt-1">
                                                {errors.email.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 flex justify-start">
                                        <MagneticButton>
                                            <motion.button
                                                layoutId="action-seal"
                                                type="submit"
                                                disabled={isLoading}
                                                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[var(--color-terracota)] hover:bg-[var(--color-pao-escuro)] text-[var(--color-creme)] font-bold rounded-full transition-colors shadow-md text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        <span>Amassando a farinha...</span>
                                                    </>
                                                ) : (
                                                    <span>Fazer Parte do Clube</span>
                                                )}
                                            </motion.button>
                                        </MagneticButton>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center text-center p-4 gap-4 sm:gap-6"
                                >
                                    <div className="relative flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 select-none">
                                        <motion.div
                                            layoutId="action-seal"
                                            className="absolute inset-0 bg-[#A63F24] rounded-full shadow-[0_10px_25px_rgba(166,63,36,0.3)] border-4 border-dashed border-[#8C3119]"
                                            style={{ borderRadius: "50% 45% 48% 52% / 48% 52% 45% 50%" }}
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1.2, ease: "easeOut" }}
                                        />
                                        <div className="absolute inset-2 bg-[#9E361B] rounded-full border border-white/10 flex flex-col items-center justify-center text-white"
                                             style={{ borderRadius: "48% 52% 50% 45% / 52% 45% 48% 50%" }}>
                                            <Wheat className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-pao-dourado)] mb-1" />
                                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider font-serif">
                                                Clube do Pão
                                            </span>
                                            <span className="text-[7px] sm:text-[8px] opacity-75 font-semibold">
                                                Aprovado
                                            </span>
                                        </div>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                                            className="absolute -right-1 -bottom-1 sm:-right-2 sm:-bottom-2 bg-green-600 text-white rounded-full p-1.5 sm:p-2 border-2 border-[var(--color-creme)] shadow-md"
                                        >
                                            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </motion.div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-marrom-cafe)] mb-2">
                                            Inscrição Confirmada!
                                        </h3>
                                        <p className="text-[#7A5C48] text-sm max-w-sm leading-relaxed">
                                            Bem-vindo ao clube. Seu selo de cera foi carimbado! Em breve você receberá as novidades quentinhas em seu e-mail.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
