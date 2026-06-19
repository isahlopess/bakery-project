import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminContentWrapper from "@/components/admin/AdminContentWrapper";

export const metadata = {
  title: "Painel do Dono - Padaria",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      <AdminSidebar />
      <AdminContentWrapper>{children}</AdminContentWrapper>
    </div>
  );
}

