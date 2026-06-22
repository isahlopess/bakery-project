import { getStoreSettings } from "@/app/actions/config";
import { getLucroData } from "@/app/actions/lucro";
import AdminContentWrapper from "@/components/admin/AdminContentWrapper";
import LucroClient from "@/components/admin/LucroClient";

export const dynamic = "force-dynamic";

export default async function LucroPage() {
    const storeSettings = await getStoreSettings();
    const data = await getLucroData();

    return (
        <LucroClient data={data} />
    );
}
