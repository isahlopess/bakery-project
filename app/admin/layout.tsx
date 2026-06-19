import { ReactNode } from "react";
import Link from "next/link";
import { Wheat, LayoutDashboard, Package, Settings, LogOut, Coffee } from "lucide-react";
import { logOut } from "@/app/actions/auth";

export const metadata = {
  title: "Painel do Dono - Padaria",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      <aside className="w-64 bg-[#1A110C] text-[var(--color-creme)] flex flex-col hidden md:flex fixed inset-y-0 z-50">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 text-[var(--color-pao-dourado)] hover:text-white transition-colors group">
            <Wheat className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-serif text-2xl font-bold tracking-tight text-[var(--color-creme)] group-hover:text-white transition-colors">
                Padaria<span className="text-[var(--color-terracota)]">.</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-xl font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5 text-[var(--color-pao-dourado)]" />
            Visão Geral
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors cursor-not-allowed opacity-50">
            <Package className="w-5 h-5" />
            Estoque
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors cursor-not-allowed opacity-50">
            <Settings className="w-5 h-5" />
            Configurações
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-terracota)] flex items-center justify-center text-white font-bold">
              AD
            </div>
            <div>
              <p className="text-sm font-bold text-white">Admin</p>
              <p className="text-xs text-white/50">Gerência</p>
            </div>
          </div>
          <form action={logOut}>
            <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl font-medium transition-colors">
              <LogOut className="w-5 h-5" />
              Sair do Sistema
            </button>
          </form>
        </div>
      </aside>
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#1A110C] text-[var(--color-creme)] p-4 flex justify-between items-center z-50">
        <Link href="/" className="flex items-center gap-2 text-[var(--color-pao-dourado)]">
            <Wheat className="w-6 h-6" />
            <span className="font-serif text-xl font-bold text-[var(--color-creme)]">Padaria.</span>
        </Link>
        <form action={logOut}>
            <button type="submit" className="p-2 text-red-400">
                <LogOut className="w-5 h-5" />
            </button>
        </form>
      </div>
      <main className="flex-1 md:ml-64 pt-20 md:pt-0">
        {children}
      </main>
    </div>
  );
}
