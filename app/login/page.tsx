"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/actions/auth";
import { Wheat, ArrowRight, AlertCircle, Loader2, Mail, Lock, Sparkles, Quote } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <main className="min-h-screen flex bg-[#1A110C] font-sans selection:bg-[#D9A05B] selection:text-[#2B1B12]">
      <div className="hidden lg:flex w-[55%] relative bg-black overflow-hidden group">
        <Image 
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1920&q=80" 
          alt="Padaria Artesanal" 
          fill 
          className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-[10s] ease-out"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A110C] via-transparent to-transparent" />
        <div className="absolute bottom-16 left-16 max-w-lg z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <Quote className="w-10 h-10 text-[var(--color-pao-dourado)] opacity-50 absolute -top-6 -left-6" />
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-creme)] font-bold mb-6 leading-tight">
              A verdadeira arte leva <span className="text-[var(--color-pao-dourado)]">tempo</span> e <span className="text-[var(--color-terracota)]">paixão</span>.
            </h2>
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-[var(--color-pao-dourado)]" />
              <p className="text-[var(--color-creme)] opacity-70 text-lg uppercase tracking-widest text-sm font-medium">
                Fermentação Natural
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[var(--color-terracota)] opacity-10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-pao-dourado)] opacity-5 blur-[100px] rounded-full pointer-events-none" />
        <div className="w-full max-w-md z-10 relative">
          <div className="bg-[#2B1B12]/60 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8 text-center"
            >
              <Link href="/" className="inline-flex items-center gap-3 text-[var(--color-pao-dourado)] hover:text-white transition-colors mb-6 group">
                <div className="w-12 h-12 rounded-full bg-[var(--color-pao-dourado)]/10 flex items-center justify-center border border-[var(--color-pao-dourado)]/20 group-hover:bg-[var(--color-pao-dourado)] group-hover:border-transparent transition-all">
                  <Wheat className="w-6 h-6 group-hover:text-[#2B1B12] transition-colors group-hover:rotate-12" />
                </div>
              </Link>
              <h1 className="text-3xl font-bold text-[var(--color-creme)] font-serif mb-2">Acesso Restrito</h1>
              <p className="text-[var(--color-creme)] opacity-60 text-sm">Gerencie fornadas, pedidos e clientes.</p>
            </motion.div>
            <form action={formAction} className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-creme)] opacity-70 ml-1" htmlFor="email">
                    E-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Mail className="h-5 w-5 text-[var(--color-pao-dourado)] opacity-100 transition-colors" />
                    </div>
                    <input
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-[var(--color-creme)] placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-[var(--color-pao-dourado)] focus:ring-2 focus:ring-[var(--color-pao-dourado)]/20 transition-all duration-300 relative z-0"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="admin@padaria.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-creme)] opacity-70" htmlFor="password">
                      Senha
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Lock className="h-5 w-5 text-[var(--color-pao-dourado)] opacity-100 transition-colors" />
                    </div>
                    <input
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-[var(--color-creme)] placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-[var(--color-pao-dourado)] focus:ring-2 focus:ring-[var(--color-pao-dourado)]/20 transition-all duration-300 relative z-0"
                      id="password"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </motion.div>
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{errorMessage}</p>
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <button
                  type="submit"
                  disabled={isPending}
                  className="relative w-full flex items-center justify-center gap-2 py-4 px-8 bg-gradient-to-r from-[var(--color-terracota)] to-[var(--color-pao-escuro)] text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(181,87,43,0.3)] hover:shadow-[0_0_30px_rgba(181,87,43,0.5)] overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Acessando...</span>
                    </>
                  ) : (
                    <>
                      <span className="tracking-wide">Entrar no Painel</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </motion.div>
            </form>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-[var(--color-creme)] opacity-40"
            >
              <Sparkles className="w-4 h-4" />
              <p>Área restrita. Monitoramento de fornadas ativo.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
