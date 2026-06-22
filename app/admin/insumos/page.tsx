import { getStoreSettings } from "@/app/actions/config";
import { getIngredients, getProductsWithRecipes } from "@/app/actions/insumos";
import AdminContentWrapper from "@/components/admin/AdminContentWrapper";
import EstoqueInsumosClient from "@/components/admin/EstoqueInsumosClient";

export const dynamic = "force-dynamic";

export default async function InsumosPage() {
    const storeSettings = await getStoreSettings();
    const ingredients = await getIngredients();
    const products = await getProductsWithRecipes();

    return (
        <EstoqueInsumosClient 
            initialIngredients={ingredients} 
            products={products} 
        />
    );
}
