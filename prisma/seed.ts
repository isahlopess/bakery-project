import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bakery.com' },
    update: {},
    create: {
      email: 'admin@bakery.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log({ admin })

  const vitrineProducts = [
    {
        nome: "Pão Caseiro Tradicional",
        desc: "Aquele pãozinho macio com cheiro de casa de vó, perfeito com manteiga derretida.",
        preco: 12.00,
        tag: "O Favorito",
        bgColor: "bg-[var(--color-branco-quente)]",
        imagem: "https://images.unsplash.com/photo-1559811814-e2c57b5e69df?q=80&w=687&auto=format&fit=crop",
        categoria: "vitrine",
        estoque: 100
    },
    {
        nome: "Pão de Queijo & Pãozinhos",
        desc: "Fornadas frescas a toda hora! Crocantes por fora e super macios por dentro.",
        preco: 2.50,
        tag: "Sempre Quentinho",
        bgColor: "bg-[var(--color-creme)]",
        imagem: "/images/pa__de_queijo___paezinhos.jpg",
        categoria: "vitrine",
        estoque: 100
    },
    {
        nome: "Sonho Recheado",
        desc: "Massa fofinha e açucarada com recheio generoso de doce de leite ou creme.",
        preco: 6.50,
        tag: "Mais Vendido",
        bgColor: "bg-[var(--color-branco-quente)]",
        imagem: "/images/sonho_recheado.jpg",
        categoria: "vitrine",
        estoque: 100
    },
    {
        nome: "Pães Doces & Roscas",
        desc: "Roscas trançadas com coco, pão doce com creme e fatias húngaras.",
        preco: 8.00,
        tag: "Para o Café",
        bgColor: "bg-[var(--color-creme)]",
        imagem: "/images/rosca_doce.jpg",
        categoria: "vitrine",
        estoque: 100
    },
    {
        nome: "Bolos Caseiros",
        desc: "Bolo de cenoura com chocolate, fubá cremoso e milho verde.",
        preco: 22.00,
        tag: "Feito com Carinho",
        bgColor: "bg-[var(--color-branco-quente)]",
        imagem: "/images/bolos_caseiros.jpg",
        categoria: "vitrine",
        estoque: 100
    },
    {
        nome: "Salgados & Esfihas",
        desc: "Esfihas de carne, frango, queijo e enroladinhos de salsicha fresquinhos.",
        preco: 5.50,
        tag: "Lanche Rápido",
        bgColor: "bg-[var(--color-creme)]",
        imagem: "/images/salgados_e_esfihas.jpg",
        categoria: "vitrine",
        estoque: 100
    }
  ]

  const cardapioProducts = [
    {
        nome: "Pão de Levain Rústico",
        desc: "Fermentação de 48 horas, miolo alvéolado e casca caramelizada extremamente crocante.",
        preco: 24.00,
        tag: "O Favorito",
        bgColor: "bg-[var(--color-branco-quente)]",
        imagem: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=600&q=80",
        categoria: "cardapio",
        estoque: 50
    },
    {
        nome: "Croissant de Manteiga",
        desc: "Massa folhada francesa em 24 camadas dobradas à mão com manteiga premium.",
        preco: 16.00,
        tag: "Receita Clássica",
        bgColor: "bg-[var(--color-creme)]",
        imagem: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?auto=format&fit=crop&w=600&q=80",
        categoria: "cardapio",
        estoque: 50
    },
    {
        nome: "Sonho de Doce de Leite",
        desc: "Massa aerada e fofa recheada com doce de leite artesanal quente.",
        preco: 14.00,
        tag: "O Mais Doce",
        bgColor: "bg-[var(--color-branco-quente)]",
        imagem: "https://images.unsplash.com/photo-1626094309830-abbb0e399fc2?auto=format&fit=crop&w=600&q=80",
        categoria: "cardapio",
        estoque: 50
    },
    {
        nome: "Bolo de Cenoura com Cacau",
        desc: "Bolo úmido de cenoura orgânica com cobertura espessa de chocolate quente.",
        preco: 18.00,
        tag: "Fatia do Dia",
        bgColor: "bg-[var(--color-creme)]",
        imagem: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80",
        categoria: "cardapio",
        estoque: 50
    }
  ]

  for (const p of [...vitrineProducts, ...cardapioProducts]) {
    await prisma.product.create({
      data: p
    })
  }

  console.log('Database seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
