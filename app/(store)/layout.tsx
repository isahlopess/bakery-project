import { ReactNode } from "react";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Header from "@/components/layout/Header";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { getStoreSettings } from "@/app/actions/config";

export default async function StoreLayout({ children }: { children: ReactNode }) {
    const storeSettings = await getStoreSettings();

    return (
        <SmoothScroll>
            <Header store={storeSettings} />
            {children}
            <WhatsAppButton />
        </SmoothScroll>
    );
}
