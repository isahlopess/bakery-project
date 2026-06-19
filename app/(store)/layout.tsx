import { ReactNode } from "react";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Header from "@/components/layout/Header";
import BreadProgressBar from "@/components/ui/BreadProgressBar";
import { getStoreSettings } from "@/app/actions/config";

export default async function StoreLayout({ children }: { children: ReactNode }) {
    const storeSettings = await getStoreSettings();

    return (
        <SmoothScroll>
            <Header store={storeSettings} />
            <BreadProgressBar />
            {children}
        </SmoothScroll>
    );
}
