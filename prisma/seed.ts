import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const vitrineProducts = [
    {
        nome: "Pão Caseiro Tradicional",
        desc: "Aquele pãozinho macio com cheiro de casa de vó, perfeito com manteiga derretida.",
        preco: 12.00,
        tag: "O Favorito",
        bgColor: "bg-[var(--color-branco-quente)]",
        imagem: "https://images.unsplash.com/photo-1559811814-e2c57b5e69df?q=80&w=687&auto=format&fit=crop",
        categoria: "vitrine",
        estoque: 50
    },
    {
        nome: "Pão de Queijo & Pãozinhos",
        desc: "Fornadas frescas a toda hora! Crocantes por fora e super macios por dentro.",
        preco: 2.50,
        tag: "Sempre Quentinho",
        bgColor: "bg-[var(--color-creme)]",
        imagem: "/images/pao_de_queijo.jpg",
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
        estoque: 40
    },
    {
        nome: "Pães Doces & Roscas",
        desc: "Roscas trançadas com coco, pão doce com creme e fatias húngaras.",
        preco: 8.00,
        tag: "Para o Café",
        bgColor: "bg-[var(--color-creme)]",
        imagem: "/images/rosca_doce.jpg",
        categoria: "vitrine",
        estoque: 30
    },
    {
        nome: "Bolos Caseiros",
        desc: "Bolo de cenoura com chocolate, fubá cremoso e milho verde.",
        preco: 22.00,
        tag: "Feito com Carinho",
        bgColor: "bg-[var(--color-branco-quente)]",
        imagem: "/images/bolos_caseiros.jpg",
        categoria: "vitrine",
        estoque: 20
    },
    {
        nome: "Salgados & Esfihas",
        desc: "Esfihas de carne, frango, queijo e enroladinhos de salsicha fresquinhos.",
        preco: 5.50,
        tag: "Lanche Rápido",
        bgColor: "bg-[var(--color-creme)]",
        imagem: "/images/salgados_e_esfihas.jpg",
        categoria: "vitrine",
        estoque: 50
    }
];

const cardapioProducts = [
    {
        nome: "Bolo de Cenoura com Chocolate",
        desc: "Massa macia com farta cobertura de brigadeiro mole, perfeito para o lanche.",
        preco: 25.00,
        imagem: "/images/bolo_cenoura.jpg",
        categoria: "cardapio",
        estoque: 15
    },
    {
        nome: "Bolos Caseiros Diversos",
        desc: "Fubá, laranja, milho verde e mandioca. Receitas de família com gostinho de infância.",
        preco: 20.00,
        imagem: "/images/bolos_caseiros.jpg",
        categoria: "cardapio",
        estoque: 20
    },
    {
        nome: "Empada de Palmito",
        desc: "Massa podre que derrete na boca com recheio cremoso de palmito temperado.",
        preco: 7.00,
        imagem: "/images/empada_palmito.jpg",
        categoria: "cardapio",
        estoque: 30
    },
    {
        nome: "Esfiha de Carne",
        desc: "Massa leve e fofinha com recheio suculento de carne moída, tomate e limão.",
        preco: 5.00,
        imagem: "/images/esfiha_de_carne.jpg",
        categoria: "cardapio",
        estoque: 40
    },
    {
        nome: "Pão Doce Simples",
        desc: "O tradicional pão doce de padaria com açúcar cristal por cima, ideal com manteiga.",
        preco: 3.50,
        imagem: "/images/pao_doce.jpg",
        categoria: "cardapio",
        estoque: 50
    },
    {
        nome: "Pão de Queijo e Pãozinhos",
        desc: "Pães de queijo crocantes e pãezinhos variados recém-saídos do forno.",
        preco: 15.00,
        imagem: "/images/pao_de_queijo.jpg",
        categoria: "cardapio",
        estoque: 100
    },
    {
        nome: "Rosca Doce Glaceada",
        desc: "Rosca trançada com cobertura doce e glacê generoso, super macia.",
        preco: 14.00,
        imagem: "/images/rosca_doce.jpg",
        categoria: "cardapio",
        estoque: 20
    },
    {
        nome: "Sonho de Creme",
        desc: "Clássico sonho frito passado no açúcar e recheado com bastante creme de confeiteiro.",
        preco: 6.00,
        imagem: "/images/sonho_de_creme.jpg",
        categoria: "cardapio",
        estoque: 40
    },
    {
        nome: "Sonho Recheado Especial",
        desc: "Sonho farto com recheio de doce de leite artesanal, uma explosão de sabor.",
        preco: 7.00,
        imagem: "/images/sonho_recheado.jpg",
        categoria: "cardapio",
        estoque: 40
    },
    {
        nome: "Suco de Laranja Natural",
        desc: "Suco fresco feito na hora, 100% fruta, sem adição de água ou açúcar.",
        preco: 10.00,
        imagem: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
        categoria: "cardapio",
        estoque: 100
    },
    {
        nome: "Cappuccino Cremoso",
        desc: "Expresso duplo com leite vaporizado e bastante espuma, polvilhado com canela.",
        preco: 12.00,
        imagem: "/images/cappuccino.jpg",
        categoria: "cardapio",
        estoque: 100
    },
    {
        nome: "Café Coado na Hora",
        desc: "Café especial coado no pano, aroma intenso e sabor suave. O clássico da padaria.",
        preco: 4.50,
        imagem: "/images/cafe_coado.jpg",
        categoria: "cardapio",
        estoque: 999
    }
];

async function main() {
    console.log('Limpando banco de dados...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    console.log('Criando produtos da Vitrine...');
    for (const p of vitrineProducts) {
        await prisma.product.create({ data: p });
    }

    console.log('Criando produtos do Cardápio...');
    for (const p of cardapioProducts) {
        await prisma.product.create({ data: p });
    }

    console.log('Criando usuário Admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
        data: {
            email: 'admin@padaria.com',
            password: hashedPassword,
            name: 'Administrador',
        }
    });

    console.log('Criando alguns pedidos fictícios para o Dashboard...');

    const allProducts = await prisma.product.findMany();

    for(let i=0; i<3; i++) {
        const item1 = allProducts[Math.floor(Math.random() * allProducts.length)];
        const item2 = allProducts[Math.floor(Math.random() * allProducts.length)];
        
        await prisma.order.create({
            data: {
                customerName: i === 0 ? "Mariana Silva" : i === 1 ? "João Pedro" : "Carlos Almeida",
                customerPhone: "(11) 9" + Math.floor(10000000 + Math.random() * 90000000),
                total: (item1.preco * 2) + item2.preco,
                status: i === 0 ? "PREPARANDO" : "CONCLUIDO",
                createdAt: new Date(Date.now() - Math.random() * 86400000),
                items: {
                    create: [
                        { nome: item1.nome, preco: item1.preco, quantidade: 2 },
                        { nome: item2.nome, preco: item2.preco, quantidade: 1 }
                    ]
                }
            }
        });
    }

    console.log('Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
