const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  if (products.length === 0) return console.log("No products found.");

  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});

  const daysToSubtract = [0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 6, 7, 7];
  const now = new Date();

  console.log("Seeding real orders...");

  for (let i = 0; i < daysToSubtract.length; i++) {
    const d = new Date(now);
    const dayOff = daysToSubtract[i];
    d.setDate(d.getDate() - dayOff);
    d.setHours(Math.floor(Math.random() * 10) + 8);
    d.setMinutes(Math.floor(Math.random() * 60));

    const product1 = products[Math.floor(Math.random() * products.length)];
    const product2 = products[Math.floor(Math.random() * products.length)];

    const items = [];
    items.push({ nome: product1.nome, preco: product1.preco, quantidade: 1 });
    if (product1.id !== product2.id) {
      items.push({ nome: product2.nome, preco: product2.preco, quantidade: 2 });
    }

    const total = items.reduce((acc, it) => acc + (it.preco * it.quantidade), 0);

    let status = "CONCLUIDO";
    if (dayOff === 0) {
        const statuses = ["NOVO", "PREPARANDO", "PRONTO"];
        status = statuses[Math.floor(Math.random() * statuses.length)];
    }

    await prisma.order.create({
      data: {
        customerName: "Cliente " + (100 + i),
        customerPhone: "(11) 99999-" + (1000 + i),
        total: total,
        status: status,
        createdAt: d,
        items: {
          create: items
        }
      }
    });
  }
  
  console.log("Seeded " + daysToSubtract.length + " orders with real products.");
}

main().finally(() => prisma.$disconnect());
