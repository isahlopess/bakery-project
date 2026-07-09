import { getLoyaltyCustomers } from "@/app/actions/loyalty";
import FidelidadeClient from "@/components/admin/FidelidadeClient";

export const dynamic = 'force-dynamic';

export default async function FidelidadePage() {
  const customers = await getLoyaltyCustomers();

  return <FidelidadeClient customers={customers} />;
}
