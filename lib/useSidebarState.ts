"use client";

import { useState, useEffect } from "react";

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handler = () => {
      const val = localStorage.getItem("sidebar-collapsed");
      setCollapsed(val === "true");
    };
    handler();
    window.addEventListener("storage", handler);
    window.addEventListener("sidebar-toggle", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("sidebar-toggle", handler);
    };
  }, []);

  return collapsed;
}
