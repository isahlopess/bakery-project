"use client";

import { useState } from "react";
import { useCart } from "@/lib/cartStore";
import { processCheckout } from "@/app/actions/checkout";
import { ArrowRight, CheckCircle2, Loader2, Lock, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutForm() {
    const { items, getTotal, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [successId, setSuccessId] = useState<number | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    const total = getTotal();
    const formattedTotal = `R$ ${total.toFixed(2).replace('.', ',')}`;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setErrors([]);

        const formData = new FormData(e.currentTarget);

        await new Promise(r => setTimeout(r, 1500));

        try {
            const result = await processCheckout({
                customerName: formData.get("name") as string,
                customerEmail: formData.get("email") as string,
                customerPhone: formData.get("phone") as string,
                total,
                items: items.map(i => ({
                    id: i.id,
                    nome: i.nome,
                    preco: i.preco,
                    quantidade: i.quantidade
                }))
            });

            setIsLoading(false);

            if (result.success && result.orderId) {
                setSuccessId(result.orderId);
                clearCart();
            } else if (result.errors) {
                setErrors(result.errors);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            setErrors(["Erro de conexão com o servidor. Verifique o console."]);
        }
    }

    if (successId) {
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto py-10">
                <Image 
                    src="https://images.unsplash.com/photo-1523294587484-bae6cc870010?q=80&w=1602&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Bakery Background" 
                    fill 
                    className="object-cover fixed inset-0 z-[-2]" 
                    unoptimized
                />
                <div className="fixed inset-0 bg-[#1A110C]/70 backdrop-blur-sm z-[-1]" />
                <motion.div 
                    initial={{ y: "100%", opacity: 0, rotate: -2 }} 
                    animate={{ y: 0, opacity: 1, rotate: 0 }} 
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="relative w-full max-w-sm bg-[#FDFBF7] shadow-2xl rounded-t-lg mx-4 z-10 mt-10"
                    style={{ 
                        filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))",
                        maskImage: "radial-gradient(circle at 0% 60%, transparent 15px, black 16px), radial-gradient(circle at 100% 60%, transparent 15px, black 16px)",
                        WebkitMaskImage: "radial-gradient(circle at 0% 60%, transparent 15px, black 16px), radial-gradient(circle at 100% 60%, transparent 15px, black 16px)",
                        WebkitMaskComposite: "source-in",
                        maskComposite: "intersect"
                    }}
                >
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }} />
                    <div className="absolute -top-3 left-0 right-0 h-3" style={{ background: "radial-gradient(circle at 10px 0, transparent 10px, #FDFBF7 11px) repeat-x", backgroundSize: "20px 10px" }} />
                    <div className="p-8 pt-10 text-center relative overflow-hidden">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            >
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </motion.div>
                            <motion.div 
                                className="absolute inset-0 rounded-full border-2 border-green-400"
                                initial={{ scale: 0.8, opacity: 1 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-[var(--color-marrom-cafe)] mb-2 uppercase tracking-widest leading-tight">Pedido<br/>Confirmado</h2>
                        <div className="w-16 h-[1px] bg-[var(--color-pao-dourado)] mx-auto my-6" />
                        <div className="text-left mb-8 bg-white/40 p-5 rounded-xl border border-dashed border-[var(--color-marrom-cafe)]/30 relative">
                            <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[var(--color-marrom-cafe)]/20" />
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[var(--color-marrom-cafe)]/20" />
                            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[var(--color-marrom-cafe)]/20" />
                            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[var(--color-marrom-cafe)]/20" />
                            <p className="text-xs text-[var(--color-marrom-cafe)]/60 font-mono uppercase mb-1">Ticket Nº</p>
                            <p className="text-3xl font-mono font-bold text-[var(--color-terracota)]">#{successId.toString().padStart(4, '0')}</p>
                            <div className="mt-5 pt-5 border-t border-dashed border-[var(--color-marrom-cafe)]/30">
                                <p className="text-xs font-mono uppercase text-[var(--color-marrom-cafe)]/60 mb-3">Detalhes do Pedido</p>
                                <div className="space-y-2">
                                    {items.map(i => (
                                        <div key={i.id} className="flex justify-between text-sm text-[var(--color-marrom-cafe)]/80 font-mono">
                                            <span>{i.quantidade}x {i.nome}</span>
                                            <span>R$ {(i.preco * i.quantidade).toFixed(2).replace('.', ',')}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t-2 border-dotted border-[var(--color-marrom-cafe)]/20 flex justify-between font-bold text-[var(--color-marrom-cafe)] text-lg">
                                    <span className="font-mono">TOTAL</span>
                                    <span className="font-mono">{formattedTotal}</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute left-0 right-0 top-[60%] border-t-2 border-dashed border-[var(--color-marrom-cafe)]/10" style={{ transform: 'translateY(-1px)' }} />
                        <div className="flex justify-center h-12 mb-8 opacity-40 mt-4 relative z-10">
                            {[...Array(30)].map((_, i) => (
                                <div key={i} className="bg-black h-full" style={{ width: Math.random() > 0.5 ? '2px' : '4px', marginRight: Math.random() > 0.5 ? '2px' : '4px' }} />
                            ))}
                        </div>
                        <Link href="/" className="inline-flex justify-center items-center w-full py-4 bg-[var(--color-marrom-cafe)] text-[var(--color-creme)] rounded-xl font-bold uppercase tracking-widest hover:bg-[var(--color-terracota)] transition-colors shadow-xl relative z-20">
                            Voltar para a Vitrine
                        </Link>
                    </div>
                    <div className="absolute -bottom-3 left-0 right-0 h-3" style={{ background: "radial-gradient(circle at 10px 10px, transparent 10px, #FDFBF7 11px) repeat-x", backgroundSize: "20px 10px" }} />
                </motion.div>
            </div>
        );
    }
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <ShoppingBag className="w-16 h-16 text-[var(--color-marrom-cafe)]/20 mb-6" />
                <h2 className="text-2xl font-serif font-bold text-[var(--color-marrom-cafe)] mb-4">Sua cesta está vazia</h2>
                <Link href="/" className="mt-4 text-[var(--color-terracota)] font-bold hover:underline">
                    Ver produtos frescos
                </Link>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto py-12">
            <div>
                <h2 className="text-3xl font-serif font-bold text-[var(--color-marrom-cafe)] mb-8">Dados do Pedido</h2>
                {errors.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600 font-bold mb-1">Corrija os erros abaixo:</p>
                        <ul className="list-disc list-inside text-sm text-red-500">
                            {errors.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="font-bold text-[var(--color-terracota)] uppercase tracking-wider text-sm mb-4 border-b border-[var(--color-marrom-cafe)]/10 pb-2">Suas Informações</h3>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-marrom-cafe)] mb-1">Nome Completo</label>
                            <input required name="name" type="text" className="w-full px-4 py-3 rounded-lg border border-[var(--color-marrom-cafe)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-terracota)]/50 bg-white" placeholder="João da Silva" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-marrom-cafe)] mb-1">Telefone / WhatsApp</label>
                                <input required name="phone" type="tel" className="w-full px-4 py-3 rounded-lg border border-[var(--color-marrom-cafe)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-terracota)]/50 bg-white" placeholder="(11) 99999-9999" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-marrom-cafe)] mb-1">E-mail (Opcional)</label>
                                <input name="email" type="email" className="w-full px-4 py-3 rounded-lg border border-[var(--color-marrom-cafe)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-terracota)]/50 bg-white" placeholder="joao@email.com" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 pt-4">
                        <h3 className="font-bold text-[var(--color-terracota)] uppercase tracking-wider text-sm mb-4 border-b border-[var(--color-marrom-cafe)]/10 pb-2">Pagamento (Fictício)</h3>
                        <div className="p-4 rounded-xl border-2 border-[var(--color-terracota)]/30 bg-[var(--color-terracota)]/5 flex flex-col items-center justify-center text-center space-y-2">
                            <Lock className="w-6 h-6 text-[var(--color-terracota)] mb-1" />
                            <p className="text-sm font-medium text-[var(--color-marrom-cafe)]">Isso é um projeto de Portfólio.</p>
                            <p className="text-xs text-[var(--color-marrom-cafe)]/60">Nenhum pagamento real será processado. Ao clicar em finalizar, o pedido será salvo no banco de dados SQLite para o painel Admin.</p>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-8 py-4 bg-[var(--color-terracota)] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#9a4a24] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            <>
                                Finalizar Pedido Fictício
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-[var(--color-marrom-cafe)]/5 h-fit sticky top-24">
                <h3 className="font-serif font-bold text-2xl text-[var(--color-marrom-cafe)] mb-6">Resumo da Cesta</h3>
                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map(item => (
                        <div key={item.id} className="flex gap-4 items-center">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--color-creme)] flex-shrink-0">
                                <Image unoptimized src={item.imagem} alt={item.nome} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-[var(--color-marrom-cafe)]">{item.nome}</h4>
                                <p className="text-xs text-[var(--color-marrom-cafe)]/60">Qtd: {item.quantidade}</p>
                            </div>
                            <div className="font-bold text-sm text-[var(--color-marrom-cafe)]">
                                {`R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}`}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t border-[var(--color-marrom-cafe)]/10 pt-4 space-y-3">
                    <div className="flex justify-between text-sm text-[var(--color-marrom-cafe)]/70">
                        <span>Subtotal</span>
                        <span>{formattedTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[var(--color-marrom-cafe)]/70">
                        <span>Taxa de Entrega</span>
                        <span className="text-green-600 font-bold">Grátis</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-[var(--color-marrom-cafe)] pt-2 border-t border-[var(--color-marrom-cafe)]/10">
                        <span>Total</span>
                        <span>{formattedTotal}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
