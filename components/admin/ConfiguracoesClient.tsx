"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Store, Cpu, Check, Shield, Bell, Lock, Activity, RefreshCcw, Power, HardDriveDownload } from "lucide-react";
import { updateStoreSettings, updateUserProfile, resetSystem, getSystemHealth, createBackup } from "@/app/actions/config";

interface StoreSettings {
  name: string;
  openTime: string;
  closeTime: string;
  phone: string;
  address: string;
  isOpen: boolean;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export default function ConfiguracoesClient({ 
  initialSettings, 
  initialUser 
}: { 
  initialSettings: StoreSettings;
  initialUser: UserProfile | null;
}) {
  const [activeTab, setActiveTab] = useState("perfil");
  const [showSaved, setShowSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [store, setStore] = useState(initialSettings);

  const [profileName, setProfileName] = useState(initialUser?.name || "");
  const [profilePass, setProfilePass] = useState("");

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetType, setResetType] = useState<"orders" | "products" | "all">("orders");
  const [resetPassword, setResetPassword] = useState("");
  const [resetError, setResetError] = useState("");

  const [healthData, setHealthData] = useState<{
    version: string;
    latency: number;
    dbStatus: string;
    storageUsage: string;
    storageStatus: string;
    lastBackup: string;
  } | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(false);
  const [isBackupPending, setIsBackupPending] = useState(false);

  useEffect(() => {
    if (activeTab === "sistema" && !healthData && !isHealthLoading) {
      setIsHealthLoading(true);
      getSystemHealth().then(data => {
        setHealthData(data);
        setIsHealthLoading(false);
      });
    }
  }, [activeTab]);

  const handleCreateBackup = async () => {
    setIsBackupPending(true);
    const res = await createBackup();
    if (res.success) {
      triggerSaveSuccess();
      const newData = await getSystemHealth();
      setHealthData(newData);
    } else {
      alert(res.error || "Erro ao criar backup");
    }
    setIsBackupPending(false);
  };

  const triggerSaveSuccess = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleSaveStore = () => {
    startTransition(async () => {
      await updateStoreSettings(store);
      triggerSaveSuccess();
    });
  };

  const handleSaveProfile = () => {
    if (!initialUser) return;
    startTransition(async () => {
      await updateUserProfile(initialUser.id, { name: profileName, password: profilePass });
      setProfilePass("");
      triggerSaveSuccess();
    });
  };

  const handleResetSystem = () => {
    if (!resetPassword) {
      setResetError("A senha é obrigatória.");
      return;
    }
    startTransition(async () => {
      setResetError("");
      const res = await resetSystem(resetPassword, resetType);
      if (res.success) {
        setShowResetModal(false);
        setResetPassword("");
        triggerSaveSuccess();
      } else {
        setResetError(res.error || "Erro desconhecido");
      }
    });
  };

  const tabs = [
    { id: "perfil", label: "Meu Perfil", icon: User },
    { id: "padaria", label: "Dados da Loja", icon: Store },
    { id: "sistema", label: "Sistema & Segurança", icon: Cpu },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-[calc(100vh-6rem)]">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1A110C] mb-2">Configurações</h1>
        <p className="text-[#1A110C]/50 text-sm md:text-base font-medium">Gerencie suas preferências, dados do negócio e controle do sistema.</p>
      </motion.div>
      <div className="flex flex-col lg:flex-row gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:w-72 flex-shrink-0">
          <div className="glass-panel p-3 rounded-[2rem] flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${isActive ? "text-white shadow-md" : "text-[#1A110C]/50 hover:text-[#1A110C] hover:bg-[#1A110C]/5"}`}
                >
                  {isActive && (
                    <motion.div layoutId="activeSidebar" className="absolute inset-0 bg-gradient-to-r from-[var(--color-terracota)] to-[var(--color-pao-escuro)] rounded-2xl" transition={{ type: "spring", damping: 25, stiffness: 300 }} />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-panel rounded-[2.5rem] p-8 md:p-10 shadow-sm"
            >
              {activeTab === "perfil" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-5 pb-8 border-b border-[#1A110C]/10">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-[var(--color-terracota)] to-[#8B401D] flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                      {profileName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#1A110C] font-serif mb-1">{profileName || "Administrador"}</h3>
                      <p className="text-sm font-medium text-[#1A110C]/40 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" /> Acesso irrestrito
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 max-w-2xl">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A110C]/40 mb-2">Nome Completo</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={e => setProfileName(e.target.value)}
                        className="w-full px-5 py-4 bg-white/60 border border-[#1A110C]/10 rounded-2xl text-[#1A110C] font-bold focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-4 focus:ring-[var(--color-pao-dourado)]/10 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A110C]/40 mb-2">E-mail Corporativo</label>
                      <input
                        type="email"
                        value={initialUser?.email || ""}
                        readOnly
                        className="w-full px-5 py-4 bg-[#1A110C]/5 border border-[#1A110C]/5 rounded-2xl text-[#1A110C]/40 cursor-not-allowed font-medium"
                      />
                      <p className="text-[10px] text-[#1A110C]/30 mt-2 font-bold uppercase tracking-wide">O e-mail de login não pode ser alterado</p>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A110C]/40 mb-2">Nova Senha</label>
                      <input
                        type="password"
                        value={profilePass}
                        onChange={e => setProfilePass(e.target.value)}
                        placeholder="Deixe em branco para não alterar"
                        className="w-full px-5 py-4 bg-white/60 border border-[#1A110C]/10 rounded-2xl text-[#1A110C] font-medium focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-4 focus:ring-[var(--color-pao-dourado)]/10 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-[#1A110C]/10 flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isPending}
                      className="px-8 py-4 bg-gradient-to-r from-[#1A110C] to-[#2A1D15] text-white font-bold text-sm rounded-xl hover:shadow-[0_8px_25px_rgba(26,17,12,0.3)] transition-all flex items-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                    >
                      {isPending ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Salvar Perfil
                    </button>
                  </div>
                </div>
              )}
              {activeTab === "padaria" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between pb-8 border-b border-[#1A110C]/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--color-pao-dourado)]/20 flex items-center justify-center text-[var(--color-terracota)]">
                        <Store className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-[#1A110C] font-serif">Aparência da Loja</h3>
                        <p className="text-sm font-medium text-[#1A110C]/40">Informações visíveis para os clientes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/40 p-2 pr-6 rounded-full border border-[#1A110C]/10 shadow-sm">
                       <button
                         onClick={() => setStore(s => ({ ...s, isOpen: !s.isOpen }))}
                         className={`relative w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${store.isOpen ? "bg-emerald-500" : "bg-[#1A110C]/20"}`}
                       >
                         <motion.div layout className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center" animate={{ x: store.isOpen ? 24 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
                            <Power className={`w-3 h-3 ${store.isOpen ? "text-emerald-500" : "text-[#1A110C]/40"}`} />
                         </motion.div>
                       </button>
                       <span className="text-xs font-bold uppercase tracking-wider text-[#1A110C]">
                          {store.isOpen ? "Loja Aberta" : "Pausada"}
                       </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A110C]/40 mb-2">Nome Público da Padaria</label>
                      <input
                        type="text"
                        value={store.name}
                        onChange={e => setStore({ ...store, name: e.target.value })}
                        className="w-full px-5 py-4 bg-white/60 border border-[#1A110C]/10 rounded-2xl text-[#1A110C] font-bold focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-4 focus:ring-[var(--color-pao-dourado)]/10 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A110C]/40 mb-2">Horário de Abertura</label>
                      <input
                        type="time"
                        value={store.openTime}
                        onChange={e => setStore({ ...store, openTime: e.target.value })}
                        className="w-full px-5 py-4 bg-white/60 border border-[#1A110C]/10 rounded-2xl text-[#1A110C] font-bold focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-4 focus:ring-[var(--color-pao-dourado)]/10 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A110C]/40 mb-2">Horário de Fechamento</label>
                      <input
                        type="time"
                        value={store.closeTime}
                        onChange={e => setStore({ ...store, closeTime: e.target.value })}
                        className="w-full px-5 py-4 bg-white/60 border border-[#1A110C]/10 rounded-2xl text-[#1A110C] font-bold focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-4 focus:ring-[var(--color-pao-dourado)]/10 transition-all shadow-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A110C]/40 mb-2">Endereço Principal</label>
                      <input
                        type="text"
                        value={store.address}
                        onChange={e => setStore({ ...store, address: e.target.value })}
                        className="w-full px-5 py-4 bg-white/60 border border-[#1A110C]/10 rounded-2xl text-[#1A110C] font-bold focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-4 focus:ring-[var(--color-pao-dourado)]/10 transition-all shadow-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A110C]/40 mb-2">WhatsApp / Telefone</label>
                      <input
                        type="tel"
                        value={store.phone}
                        onChange={e => setStore({ ...store, phone: e.target.value })}
                        className="w-full px-5 py-4 bg-white/60 border border-[#1A110C]/10 rounded-2xl text-[#1A110C] font-bold focus:outline-none focus:border-[var(--color-pao-dourado)] focus:ring-4 focus:ring-[var(--color-pao-dourado)]/10 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-[#1A110C]/10 flex justify-end">
                    <button
                      onClick={handleSaveStore}
                      disabled={isPending}
                      className="px-8 py-4 bg-gradient-to-r from-[var(--color-terracota)] to-[#8B401D] text-white font-bold text-sm rounded-xl hover:shadow-[0_8px_25px_rgba(181,87,43,0.3)] transition-all flex items-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                    >
                      {isPending ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              )}
              {activeTab === "sistema" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 pb-8 border-b border-[#1A110C]/10">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#1A110C] font-serif">Saúde do Sistema</h3>
                      <p className="text-sm font-medium text-[#1A110C]/40">Monitoramento e atualizações</p>
                    </div>
                  </div>
                  {isHealthLoading || !healthData ? (
                    <div className="flex justify-center py-8">
                       <RefreshCcw className="w-8 h-8 animate-spin text-[#1A110C]/20" />
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {[
                        { label: "Versão do Painel", desc: "Release atual do sistema", val: healthData.version, badge: "bg-emerald-100 text-emerald-700" },
                        { label: "Banco de Dados", desc: `Latência: ${healthData.latency}ms`, val: healthData.dbStatus, badge: healthData.dbStatus === "Online" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700" },
                        { label: "Armazenamento", desc: `SQLite local - Arquivo dev.db`, val: `${healthData.storageUsage}`, badge: healthData.storageStatus === "Saudável" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-white/40 border border-[#1A110C]/5 rounded-2xl">
                          <div>
                            <p className="font-bold text-[#1A110C] text-sm">{item.label}</p>
                            <p className="text-xs font-medium text-[#1A110C]/40 mt-1">{item.desc}</p>
                          </div>
                          <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg ${item.badge}`}>
                            {item.val}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between p-5 bg-white/40 border border-[#1A110C]/5 rounded-2xl">
                          <div>
                            <p className="font-bold text-[#1A110C] text-sm">Último Backup</p>
                            <p className="text-xs font-medium text-[#1A110C]/40 mt-1">Cópia de segurança do banco de dados</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1.5 text-xs font-bold tracking-wider rounded-lg bg-[#1A110C]/5 text-[#1A110C]/60">
                              {healthData.lastBackup}
                            </span>
                            <button
                              onClick={handleCreateBackup}
                              disabled={isBackupPending}
                              className="px-4 py-1.5 text-xs font-bold bg-[#1A110C] text-white rounded-lg flex items-center gap-2 hover:bg-[var(--color-terracota)] transition-colors disabled:opacity-50"
                            >
                              {isBackupPending ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> : <HardDriveDownload className="w-3.5 h-3.5" />}
                              Fazer Backup Agora
                            </button>
                          </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-8 pt-8 border-t border-red-100">
                     <h4 className="text-red-600 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                       <Shield className="w-4 h-4" /> Zona de Risco
                     </h4>
                     <div className="p-6 border border-red-200 bg-red-50/50 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div>
                          <p className="font-bold text-red-900">Limpar Banco de Dados</p>
                          <p className="text-sm font-medium text-red-700/60 mt-1">Isso apagará todas as métricas de vendas e/ou produtos.</p>
                        </div>
                        <button onClick={() => setShowResetModal(true)} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all whitespace-nowrap">
                          Resetar Sistema
                        </button>
                     </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 30, x: "-50%", scale: 0.9 }}
            className="fixed bottom-10 left-1/2 px-8 py-4 bg-[#1A110C] text-white rounded-2xl shadow-2xl flex items-center gap-3 z-[100]"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold text-sm tracking-wide">Alterações salvas com sucesso!</span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showResetModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#1A110C]/80 backdrop-blur-sm z-[110]"
              onClick={() => setShowResetModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-[2rem] p-8 z-[120] shadow-2xl"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1A110C]">Limpeza de Dados</h3>
                <p className="text-sm font-medium text-[#1A110C]/50 mt-1">
                  Selecione o que deseja excluir e confirme com a sua senha de administrador.
                </p>
              </div>
              <div className="space-y-3 mb-6">
                <label className="flex items-start gap-3 p-4 rounded-xl border border-[#1A110C]/10 cursor-pointer hover:bg-[#1A110C]/5 transition-colors">
                  <input type="radio" name="resetType" value="orders" checked={resetType === "orders"} onChange={() => setResetType("orders")} className="mt-1" />
                  <div className="text-left">
                    <p className="font-bold text-[#1A110C] text-sm">Vendas e Relatórios</p>
                    <p className="text-xs font-medium text-[#1A110C]/40">Apaga apenas os pedidos dos clientes.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 rounded-xl border border-[#1A110C]/10 cursor-pointer hover:bg-[#1A110C]/5 transition-colors">
                  <input type="radio" name="resetType" value="products" checked={resetType === "products"} onChange={() => setResetType("products")} className="mt-1" />
                  <div className="text-left">
                    <p className="font-bold text-[#1A110C] text-sm">Produtos e Cardápio</p>
                    <p className="text-xs font-medium text-[#1A110C]/40">Apaga todos os itens da vitrine.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50/50 cursor-pointer hover:bg-red-50 transition-colors">
                  <input type="radio" name="resetType" value="all" checked={resetType === "all"} onChange={() => setResetType("all")} className="mt-1" />
                  <div className="text-left">
                    <p className="font-bold text-red-900 text-sm">Hard Reset (Tudo)</p>
                    <p className="text-xs font-medium text-red-700/60">Apaga cardápio e todos os pedidos.</p>
                  </div>
                </label>
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  placeholder="Sua senha de administrador"
                  value={resetPassword}
                  onChange={e => { setResetPassword(e.target.value); setResetError(""); }}
                  className="w-full px-5 py-4 bg-[#1A110C]/5 border border-[#1A110C]/10 rounded-xl text-[#1A110C] font-medium focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-center"
                />
                <AnimatePresence>
                  {resetError && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs font-bold text-center mt-2">
                      {resetError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  disabled={isPending}
                  className="flex-1 py-4 font-bold text-sm text-[#1A110C]/60 hover:bg-[#1A110C]/5 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleResetSystem}
                  disabled={isPending || !resetPassword}
                  className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isPending ? <RefreshCcw className="w-4 h-4 animate-spin" /> : "Confirmar"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
