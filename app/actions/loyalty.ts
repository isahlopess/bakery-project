"use server";

import prisma from "@/lib/prisma";

export async function getLoyaltyCustomers() {
  const customers = await prisma.customer.findMany({
    orderBy: { points: 'desc' },
  });
  return customers;
}
