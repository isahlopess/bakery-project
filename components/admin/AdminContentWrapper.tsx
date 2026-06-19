"use client";

import { ReactNode } from "react";
import { useSidebarState } from "@/lib/useSidebarState";

export default function AdminContentWrapper({ children }: { children: ReactNode }) {
  const collapsed = useSidebarState();

  return (
    <main className={`flex-1 pt-16 md:pt-0 transition-all duration-300 ease-out ${collapsed ? "md:ml-[76px]" : "md:ml-64"}`}>
      {children}
    </main>
  );
}
