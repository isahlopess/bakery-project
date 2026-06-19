import { ReactNode } from "react";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Header from "@/components/layout/Header";
import BreadProgressBar from "@/components/ui/BreadProgressBar";

export default function StoreLayout({ children }: { children: ReactNode }) {
    return (
        <SmoothScroll>
            <Header />
            <BreadProgressBar />
            {children}
        </SmoothScroll>
    );
}
