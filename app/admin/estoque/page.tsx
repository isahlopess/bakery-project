import prisma from "@/lib/prisma";
import EstoqueClient from "@/components/admin/EstoqueClient";

export const dynamic = "force-dynamic";

export default async function EstoquePage() {
  const allProducts = await prisma.product.findMany({
    orderBy: { nome: "asc" },
  });

  const products = allProducts.filter(p => p.categoria?.toLowerCase() !== "vitrine");

  const serialized = products.map((p) => ({
    id: p.id,
    nome: p.nome,
    desc: p.desc,
    preco: p.preco,
    imagem: p.imagem,
    estoque: p.estoque,
    categoria: p.categoria,
  }));

  return <EstoqueClient products={serialized} />;
}
