import Hero from "@/components/sections/Hero";
import Vitrine from "@/components/sections/Vitrine";
import Cardapio from "@/components/sections/Cardapio";
import Depoimentos from "@/components/sections/Depoimentos";
import VisiteNos from "@/components/sections/VisiteNos";
import Newsletter from "@/components/sections/Newsletter";
import Rodape from "@/components/sections/Rodape";

export default function Home() {
    return (
        <main className="w-full min-h-screen">
            <Hero />
            <Vitrine />
            <Cardapio />
            <Depoimentos />
            <VisiteNos />
            <Newsletter />
            <Rodape />
        </main>
    );
}