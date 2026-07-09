"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Medal, Gift, Coffee, MessageCircle, X, Phone, Clock, Search, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Customer {
  id: number;
  name: string;
  phone: string;
  points: number;
  createdAt: Date;
}

export default function FidelidadeClient({ customers }: { customers: Customer[] }) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<"ranking" | "historico">("ranking");
  const [searchQuery, setSearchQuery] = useState("");

  const REWARDS = [
    { points: 100, name: "Café Coado Grátis", icon: Coffee, color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200" },
    { points: 250, name: "Pão de Queijo Recheado", icon: Gift, color: "text-orange-600", bg: "bg-orange-100", border: "border-orange-200" },
    { points: 500, name: "Bolo Caseiro Inteiro", icon: Trophy, color: "text-red-600", bg: "bg-red-100", border: "border-red-200" },
  ];

  const REWARD_HISTORY = [
    { id: 1, name: "Maria Oliveira", phone: "67999999999", reward: "Bolo Caseiro Inteiro", date: "09/07/2026 - 08:30" },
    { id: 2, name: "Fernanda Souza", phone: "67999999995", reward: "Pão de Queijo Recheado", date: "08/07/2026 - 15:45" },
    { id: 3, name: "João Pedro Costa", phone: "67999999998", reward: "Café Coado Grátis", date: "07/07/2026 - 09:15" },
    { id: 4, name: "Mariana Silva", phone: "67999999993", reward: "Café Coado Grátis", date: "05/07/2026 - 17:20" },
  ];

  const filteredHistory = REWARD_HISTORY.filter(row => 
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    row.phone.includes(searchQuery) ||
    row.reward.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getNextReward = (points: number) => {
    return REWARDS.find(r => r.points > points) || REWARDS[REWARDS.length - 1];
  };

  const calculateProgress = (points: number, target: number) => {
    return Math.min(100, Math.round((points / target) * 100));
  };

  const formatPhone = (phone: string) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `55 ${match[1]} ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const getWhatsappMessage = (c: Customer) => {
    const nextReward = getNextReward(c.points);
    const missing = nextReward.points - c.points;
    if (missing <= 0) {
      return `Olá *${c.name}*! 🎉\n\nVocê atingiu *${c.points} pontos* no Clube de Fidelidade da Padaria!\n\nVocê já pode resgatar seu prêmio máximo: *${nextReward.name}*! Venha nos visitar hoje mesmo. ☕🍞`;
    }
    return `Olá *${c.name}*! 👋\n\nVocê tem *${c.points} pontos* no Clube de Fidelidade da Padaria.\n\nFaltam apenas *${missing} pontos* para você resgatar um *${nextReward.name}*! Faça seu pedido hoje e acumule mais. 🥐✨`;
  };

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#B5572B]/20 to-amber-500/10 border border-[#B5572B]/20 text-[#B5572B] text-xs font-black uppercase tracking-[0.2em] mb-4 shadow-sm backdrop-blur-md">
            <Trophy className="w-4 h-4" /> Clube de Fidelidade VIP
          </motion.div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-3xl font-serif font-bold text-[#1A110C]">
            Ranking E Recompensas
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[#1A110C]/60 mt-2 font-medium">
            Transforme cada compra em uma experiência recompensadora. Gerencie o engajamento dos seus clientes e impulsione vendas com prêmios exclusivos.
          </motion.p>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="flex p-1.5 bg-white/60 backdrop-blur-xl border border-white rounded-2xl shadow-sm relative z-10">
          <button
            onClick={() => setActiveTab("ranking")}
            className={`relative flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "ranking" ? "text-white shadow-md" : "text-[#1A110C]/60 hover:bg-black/5"}`}
          >
            {activeTab === "ranking" && (
              <motion.div layoutId="tab-bg" className="absolute inset-0 bg-[#1A110C] rounded-xl" />
            )}
            <span className="relative z-10 flex items-center gap-2"><Trophy className="w-4 h-4" /> Ranking</span>
          </button>
          <button
            onClick={() => setActiveTab("historico")}
            className={`relative flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "historico" ? "text-white shadow-md" : "text-[#1A110C]/60 hover:bg-black/5"}`}
          >
            {activeTab === "historico" && (
              <motion.div layoutId="tab-bg" className="absolute inset-0 bg-[#1A110C] rounded-xl" />
            )}
            <span className="relative z-10 flex items-center gap-2"><Clock className="w-4 h-4" /> Histórico</span>
          </button>
        </motion.div>
      </div>
      <AnimatePresence mode="wait">
        {activeTab === "ranking" ? (
          <motion.div 
            key="ranking"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-8"
          >
            <div className="xl:col-span-2 space-y-5">
              {customers.map((customer, index) => {
                const nextReward = getNextReward(customer.points);
                const progress = calculateProgress(customer.points, nextReward.points);
                const isTop3 = index < 3;

                const medalGradients = [
                  "bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 shadow-yellow-500/30 text-white",
                  "bg-gradient-to-br from-slate-200 via-slate-400 to-slate-500 shadow-slate-400/30 text-white",
                  "bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 shadow-amber-800/30 text-white",
                ];
                
                const cardBgs = [
                  "bg-gradient-to-r from-yellow-50/50 to-white border-yellow-200/50",
                  "bg-gradient-to-r from-slate-50/50 to-white border-slate-200/50",
                  "bg-gradient-to-r from-orange-50/50 to-white border-orange-200/50",
                ];

                return (
                  <motion.div 
                    key={customer.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 rounded-[2rem] flex flex-col sm:flex-row gap-6 items-center shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group border ${isTop3 ? cardBgs[index] : 'bg-white/60 backdrop-blur-md border-white'}`}
                  >
                    <div className={`flex items-center justify-center w-14 h-14 rounded-2xl flex-shrink-0 relative z-10 shadow-md ${isTop3 ? medalGradients[index] : 'bg-white border border-[#1A110C]/10 text-[#1A110C]/40'}`}>
                      {isTop3 ? (
                        <Medal className="w-7 h-7" />
                      ) : (
                        <span className="text-xl font-black">#{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 w-full text-center sm:text-left relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h3 className="text-xl font-black text-[#1A110C] tracking-tight">{customer.name}</h3>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1A110C]/5 text-[10px] font-bold text-[#1A110C]/50 tracking-wider">
                          <Phone className="w-3 h-3" /> {formatPhone(customer.phone)}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#B5572B] uppercase tracking-wider mb-5">
                        {customer.points} pontos acumulados
                      </p>
                      <div className="w-full">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-2">
                          <span className="text-[#1A110C]/40">Alvo Atual</span>
                          <span className={`flex items-center gap-1.5 ${nextReward.color}`}>
                            <nextReward.icon className="w-3.5 h-3.5" /> {nextReward.name} ({nextReward.points} pts)
                          </span>
                        </div>
                        <div className="w-full bg-[#1A110C]/5 rounded-full h-3 overflow-hidden p-0.5 border border-[#1A110C]/5 shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="bg-gradient-to-r from-[#B5572B] to-orange-500 h-full rounded-full relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-white/20 w-full h-full skeleton-shimmer" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 relative z-10 w-full sm:w-auto mt-4 sm:mt-0">
                      <button 
                        onClick={() => setSelectedCustomer(customer)}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#1A110C] text-white font-bold text-sm hover:bg-[#B5572B] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10 group-hover:shadow-2xl"
                      >
                        <MessageCircle className="w-4 h-4 text-green-400" /> Disparar WhatsApp
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-xl shadow-black/5 border border-white sticky top-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-[#1A110C] tracking-tight">Tiers de Prêmios</h3>
                    <p className="text-xs font-bold text-[#1A110C]/40 uppercase tracking-widest mt-1">Metas Oficiais</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border border-amber-200">
                    <Gift className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#1A110C]/10 before:to-transparent hidden-before-line">
                  {REWARDS.map((reward, i) => {
                    const Icon = reward.icon;
                    return (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative flex items-center justify-between p-5 rounded-2xl bg-white border border-[#1A110C]/5 shadow-sm group hover:border-[#B5572B]/30 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl ${reward.bg} ${reward.border} border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-5 h-5 ${reward.color}`} />
                          </div>
                          <div>
                            <p className="text-base font-black text-[#1A110C] tracking-tight">{reward.name}</p>
                            <p className="text-[10px] font-bold text-[#1A110C]/40 uppercase tracking-widest">{reward.points} PONTOS</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#1A110C]/20 group-hover:text-[#B5572B] transition-colors" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="historico"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-xl shadow-black/5 border border-white overflow-hidden"
          >
            <div className="p-8 border-b border-[#1A110C]/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#1A110C] tracking-tight">Histórico de Premiações</h2>
                <p className="text-sm font-medium text-[#1A110C]/50 mt-1">Registro de clientes que já atingiram metas e receberam recompensas.</p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-[#1A110C]/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Buscar cliente..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-[#1A110C]/5 border-none rounded-xl text-sm font-medium text-[#1A110C] focus:ring-2 focus:ring-[#B5572B]/50 w-full sm:w-64 outline-none transition-all"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1A110C]/[0.02]">
                    <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-[#1A110C]/40">Cliente</th>
                    <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-[#1A110C]/40">Recompensa Entregue</th>
                    <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-[#1A110C]/40">Data e Hora</th>
                    <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-[#1A110C]/40 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A110C]/5">
                  {filteredHistory.map((row, i) => (
                    <motion.tr 
                      key={row.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="hover:bg-white/50 transition-colors group"
                    >
                      <td className="py-5 px-8">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#1A110C]">{row.name}</span>
                          <span className="text-xs text-[#1A110C]/50 font-medium">{formatPhone(row.phone)}</span>
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#B5572B]/10 text-[#B5572B] text-xs font-bold">
                          <Gift className="w-3.5 h-3.5" /> {row.reward}
                        </span>
                      </td>
                      <td className="py-5 px-8 text-sm font-medium text-[#1A110C]/60">
                        {row.date}
                      </td>
                      <td className="py-5 px-8 text-right">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enviado
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setSelectedCustomer(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-[#efeae2] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20"
            >
              <div className="px-6 py-4 bg-[#075e54] flex justify-between items-center text-white shadow-md relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight tracking-tight">{selectedCustomer.name}</h3>
                    <p className="text-xs text-white/70 font-medium tracking-wide">{formatPhone(selectedCustomer.phone)}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-2 bg-black/10 rounded-full hover:bg-black/20 transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-6 md:p-8 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover relative min-h-[300px] flex items-center justify-center">
                <div className="absolute inset-0 bg-[#efeae2]/90" />
                <motion.div 
                  initial={{ opacity: 0, y: 20, rotateX: 10 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.2 }}
                  className="relative z-10 w-full max-w-[90%] bg-[#d9fdd3] p-5 rounded-3xl rounded-tl-none shadow-sm text-sm md:text-base text-[#111B21] whitespace-pre-wrap leading-relaxed border border-black/5"
                >
                  {getWhatsappMessage(selectedCustomer)}
                  <div className="text-[10px] text-right text-black/40 mt-3 font-bold uppercase tracking-widest flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-500" /> Mensagem Gerada
                  </div>
                </motion.div>
              </div>
              <div className="p-6 bg-white border-t border-black/5 flex flex-col gap-3">
                <Link 
                  href={`https://api.whatsapp.com/send?phone=${selectedCustomer.phone.replace(/\D/g, '')}&text=${encodeURIComponent(getWhatsappMessage(selectedCustomer))}`}
                  target="_blank"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-black text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/30"
                >
                  <MessageCircle className="w-6 h-6" /> Disparar no WhatsApp Web
                </Link>
                <div className="px-4 py-3 rounded-xl bg-orange-50 border border-orange-100">
                  <p className="text-xs text-center text-orange-800/80 font-medium leading-relaxed">
                    <strong>Modo Portfólio:</strong> Clique no botão acima para ver como a automação abriria o WhatsApp Web já com o texto preenchido.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <style dangerouslySetInnerHTML={{__html: `
        .skeleton-shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: skewX(-20deg);
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        .hidden-before-line::before {
          display: none;
        }
        @media (min-width: 768px) {
          .hidden-before-line::before {
            display: block;
          }
        }
      `}} />
    </div>
  );
}
