import ConfiguracoesClient from "@/components/admin/ConfiguracoesClient";
import prisma from "@/lib/prisma";
import { getStoreSettings } from "@/app/actions/config";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const storeSettings = await getStoreSettings();
  const user = await prisma.user.findFirst();

  return (
    <ConfiguracoesClient 
      initialSettings={storeSettings} 
      initialUser={user ? { id: user.id, name: user.name, email: user.email } : null} 
    />
  );
}
