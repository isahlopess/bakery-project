import Hero from "@/components/sections/Hero";
import Vitrine from "@/components/sections/Vitrine";
import Cardapio from "@/components/sections/Cardapio";
import Depoimentos from "@/components/sections/Depoimentos";
import VisiteNos from "@/components/sections/VisiteNos";
import Newsletter from "@/components/sections/Newsletter";
import Rodape from "@/components/sections/Rodape";
import prisma from "@/lib/prisma";
import { getStoreSettings } from "@/app/actions/config";

export const dynamic = "force-dynamic";

export default async function Home() {
    const vitrineProducts = await prisma.product.findMany({ where: { categoria: "vitrine" } });
    const cardapioProducts = await prisma.product.findMany({ where: { categoria: "cardapio" } });
    const storeSettings = await getStoreSettings();

    return (
        <main className="w-full min-h-screen">
            <Hero />
            <Vitrine produtos={vitrineProducts} />
            <Cardapio produtos={cardapioProducts} />
            <Depoimentos />
            <VisiteNos store={storeSettings} />
            <Newsletter />
            <Rodape store={storeSettings} />
        </main>
    );
}