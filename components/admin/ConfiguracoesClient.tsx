"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Store, Cpu, Check, Shield } from "lucide-react";

const tabs = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "padaria", label: "Padaria", icon: Store },
  { id: "sistema", label: "Sistema", icon: Cpu },
];

export default function ConfiguracoesClient() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-serif font-bold text-[#1A110C] mb-1">Configurações</h1>
        <p className="text-[#1A110C]/50 text-sm">Personalize o funcionamento do seu painel.</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-2 mb-8 glass-card rounded-2xl p-1.5 w-fit"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                ${isActive
                  ? "text-white"
                  : "text-[#1A110C]/50 hover:text-[#1A110C] hover:bg-[#1A110C]/5"
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-[var(--color-terracota)] to-[var(--color-pao-escuro)] rounded-xl"
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10 hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="glass-panel rounded-3xl p-6 md:p-8"
        >
          {activeTab === "perfil" && (
            <div className="space-y-6">
              <div className="flex items-center gap-5 pb-6 border-b border-[#1A110C]/5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-terracota)] to-[var(--color-pao-escuro)] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  AD
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A110C]">Administrador</h3>
                  <p className="text-sm text-[#1A110C]/40">Gerência geral da padaria</p>
                </div>
              </div>
              <div className="grid gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A110C]/40 mb-2">Nome</label>
                  <input
                    type="text"
                    defaultValue="Admin"
                    className="w-full px-4 py-3 glass-card text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-2 focus:ring-[var(--color-pao-dourado)]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A110C]/40 mb-2">E-mail</label>
                  <input
                    type="email"
                    defaultValue="admin@padaria.com"
                    readOnly
                    className="w-full px-4 py-3 bg-[#1A110C]/[0.02] border border-[#1A110C]/5 rounded-xl text-[#1A110C]/50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A110C]/40 mb-2">Senha</label>
                  <div className="flex gap-3">
                    <input
                      type="password"
                      defaultValue="admin123"
                      className="flex-1 px-4 py-3 glass-card text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-2 focus:ring-[var(--color-pao-dourado)]/20 transition-all"
                    />
                    <button className="px-5 py-3 bg-[#1A110C]/5 text-[#1A110C]/60 font-bold text-sm rounded-xl hover:bg-[#1A110C]/10 transition-colors whitespace-nowrap">
                      Alterar
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSave}
                className="mt-4 px-8 py-3 bg-gradient-to-r from-[var(--color-terracota)] to-[var(--color-pao-escuro)] text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Salvar Alterações
              </button>
            </div>
          )}
          {activeTab === "padaria" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-6 border-b border-[#1A110C]/5">
                <Store className="w-6 h-6 text-[var(--color-pao-dourado)]" />
                <h3 className="text-lg font-bold text-[#1A110C]">Dados da Padaria</h3>
              </div>
              <div className="grid gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A110C]/40 mb-2">Nome da Padaria</label>
                  <input
                    type="text"
                    defaultValue="Padaria Artesanal"
                    className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#1A110C]/10 rounded-xl text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-2 focus:ring-[var(--color-pao-dourado)]/20 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1A110C]/40 mb-2">Abre às</label>
                    <input
                      type="time"
                      defaultValue="06:00"
                      className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#1A110C]/10 rounded-xl text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-2 focus:ring-[var(--color-pao-dourado)]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1A110C]/40 mb-2">Fecha às</label>
                    <input
                      type="time"
                      defaultValue="20:00"
                      className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#1A110C]/10 rounded-xl text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-2 focus:ring-[var(--color-pao-dourado)]/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A110C]/40 mb-2">Telefone</label>
                  <input
                    type="tel"
                    defaultValue="(11) 99999-9999"
                    className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#1A110C]/10 rounded-xl text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-2 focus:ring-[var(--color-pao-dourado)]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A110C]/40 mb-2">Endereço</label>
                  <input
                    type="text"
                    defaultValue="Rua da Farinha, 123 - Centro"
                    className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#1A110C]/10 rounded-xl text-[#1A110C] focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-2 focus:ring-[var(--color-pao-dourado)]/20 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                className="mt-4 px-8 py-3 bg-gradient-to-r from-[var(--color-terracota)] to-[var(--color-pao-escuro)] text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Salvar Alterações
              </button>
            </div>
          )}
          {activeTab === "sistema" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-6 border-b border-[#1A110C]/5">
                <Cpu className="w-6 h-6 text-[var(--color-pao-dourado)]" />
                <h3 className="text-lg font-bold text-[#1A110C]">Informações do Sistema</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-[#1A110C]/5">
                  <div>
                    <p className="font-bold text-[#1A110C] text-sm">Versão do Sistema</p>
                    <p className="text-xs text-[#1A110C]/40">Painel Administrativo</p>
                  </div>
                  <span className="px-3 py-1.5 bg-[var(--color-pao-dourado)]/10 text-[var(--color-pao-escuro)] text-xs font-bold rounded-lg">
                    v1.0.0
                  </span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-[#1A110C]/5">
                  <div>
                    <p className="font-bold text-[#1A110C] text-sm">Banco de Dados</p>
                    <p className="text-xs text-[#1A110C]/40">Motor de armazenamento</p>
                  </div>
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg">
                    SQLite
                  </span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-[#1A110C]/5">
                  <div>
                    <p className="font-bold text-[#1A110C] text-sm">Framework</p>
                    <p className="text-xs text-[#1A110C]/40">Stack do servidor</p>
                  </div>
                  <span className="px-3 py-1.5 bg-[#1A110C]/5 text-[#1A110C]/60 text-xs font-bold rounded-lg">
                    Next.js 16
                  </span>
                </div>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-bold text-[#1A110C] text-sm">Segurança</p>
                    <p className="text-xs text-[#1A110C]/40">Autenticação e sessões</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg">
                    <Shield className="w-3.5 h-3.5" />
                    NextAuth v5
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 left-1/2 px-6 py-3 bg-[#1A110C] text-white rounded-xl shadow-2xl flex items-center gap-3 z-[100]"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm">Alterações salvas com sucesso!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
