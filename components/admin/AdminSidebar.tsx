"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Wheat,
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { logOut } from "@/app/actions/auth";

const navItems = [
  { href: "/admin", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/admin/estoque", label: "Estoque", icon: Package },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      <div className={`p-4 border-b border-white/10 ${collapsed ? "px-3" : "px-5"}`}>
        <Link href="/" className="flex items-center gap-2 text-[var(--color-pao-dourado)] hover:text-white transition-colors group">
          <Wheat className="w-8 h-8 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
          {!collapsed && (
            <span className="font-serif text-2xl font-bold tracking-tight text-[var(--color-creme)] group-hover:text-white transition-colors whitespace-nowrap">
              Padaria<span className="text-[var(--color-terracota)]">.</span>
            </span>
          )}
        </Link>
      </div>
      <nav className={`flex-1 py-4 space-y-1 ${collapsed ? "px-2" : "px-3"}`}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group relative flex items-center gap-3 rounded-xl font-medium transition-all duration-200
                ${collapsed ? "justify-center px-3 py-3" : "px-4 py-3"}
                ${active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--color-pao-dourado)] rounded-r-full" />
              )}
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-[var(--color-pao-dourado)]" : ""}`} />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#2B1B12] text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[100] shadow-xl border border-white/10 pointer-events-none">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
      <div className={`border-t border-white/10 ${collapsed ? "p-2" : "p-3"}`}>
        <div className={`flex items-center gap-3 mb-3 ${collapsed ? "justify-center px-3 py-3" : "px-4 py-3"}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-terracota)] to-[var(--color-pao-escuro)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg">
            AD
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">Admin</p>
              <p className="text-xs text-white/50 truncate">Gerência</p>
            </div>
          )}
        </div>
        <form action={logOut}>
          <button
            type="submit"
            className={`
              w-full flex items-center gap-3 rounded-xl font-medium transition-colors text-red-400 hover:text-red-300 hover:bg-red-400/10
              ${collapsed ? "justify-center px-3 py-3" : "px-4 py-3"}
            `}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">Sair</span>}
          </button>
        </form>
      </div>
    </>
  );
  return (
    <>
      <aside
        className={`
          hidden md:flex flex-col fixed inset-y-0 z-50
          bg-[#1A110C] border-r border-white/5 text-[var(--color-creme)]
          transition-all duration-300 ease-out
          ${collapsed ? "w-[76px]" : "w-64"}
        `}
      >
        {sidebarContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#1A110C] border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:border-[var(--color-pao-dourado)] hover:text-[var(--color-pao-dourado)] transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] z-50"
        >
          <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </aside>
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#1A110C] text-[var(--color-creme)] px-4 py-3 flex justify-between items-center z-50 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 text-[var(--color-pao-dourado)]">
          <Wheat className="w-6 h-6" />
          <span className="font-serif text-xl font-bold text-[var(--color-creme)]">
            Padaria<span className="text-[var(--color-terracota)]">.</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-white/60 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="md:hidden fixed inset-y-0 left-0 w-72 bg-[#1A110C] border-r border-white/5 text-[var(--color-creme)] z-[70] flex flex-col shadow-2xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
