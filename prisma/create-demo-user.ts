import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL
        }
    }
});

async function main() {
    console.log("Iniciando injeção segura do usuário de demonstração...");

    const existingUser = await prisma.user.findUnique({
        where: { email: 'demo@padaria.com' }
    });
    
    if (existingUser) {
        console.log("✅ O usuário demo@padaria.com já existe no banco de dados!");
        return;
    }

    const hashedDemoPassword = await bcrypt.hash('demo123', 10);
    
    await prisma.user.create({
        data: {
            email: 'demo@padaria.com',
            password: hashedDemoPassword,
            name: 'Demonstração',
            role: 'VIEWER'
        }
    });
    
    console.log("🚀 SUCESSO: Usuário demo@padaria.com criado de forma segura sem apagar nenhum produto!");
}

main()
    .catch((e) => {
        console.error("❌ Erro ao criar usuário:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
