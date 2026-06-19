"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export async function getStoreSettings() {
  let settings = await prisma.storeSettings.findFirst();
  if (!settings) {
    settings = await prisma.storeSettings.create({
      data: {
        id: 1,
      }
    });
  }
  return settings;
}

export async function updateStoreSettings(data: {
  name: string;
  openTime: string;
  closeTime: string;
  phone: string;
  address: string;
  isOpen: boolean;
}) {
  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: data,
    create: {
      id: 1,
      ...data,
    }
  });
  revalidatePath("/admin/configuracoes");
  revalidatePath("/admin");
}

export async function updateUserProfile(id: number, data: { name: string; password?: string }) {
  const updateData: { name: string; password?: string } = { name: data.name };
  if (data.password && data.password.trim() !== "") {
    updateData.password = await bcrypt.hash(data.password, 10);
  }
  
  await prisma.user.update({
    where: { id },
    data: updateData
  });
  revalidatePath("/admin/configuracoes");
}

export async function resetSystem(password: string, type: "orders" | "products" | "all") {
  const admin = await prisma.user.findFirst();
  if (!admin) {
    return { success: false, error: "Administrador não encontrado." };
  }
  
  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    return { success: false, error: "Senha incorreta. Ação não autorizada." };
  }

  if (type === "orders" || type === "all") {
    await prisma.order.deleteMany();
  }
  
  if (type === "products" || type === "all") {
    await prisma.product.deleteMany();
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function getSystemHealth() {
  const health = {
    version: "v1.0.0",
    latency: 0,
    dbStatus: "Offline",
    storageUsage: "0 KB",
    storageStatus: "Desconhecido",
    lastBackup: "Nenhum backup recente"
  };

  try {
    const pkgPath = path.join(process.cwd(), "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      health.version = `v${pkg.version}`;
    }

    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    health.latency = Date.now() - start;
    health.dbStatus = "Online";

    const dbPath = path.join(process.cwd(), "prisma", "dev.db");
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      const sizeMB = stats.size / (1024 * 1024);
      if (sizeMB < 1) {
        health.storageUsage = `${(stats.size / 1024).toFixed(2)} KB`;
      } else {
        health.storageUsage = `${sizeMB.toFixed(2)} MB`;
      }
      health.storageStatus = sizeMB > 500 ? "Atenção (Muito Grande)" : "Saudável";
    }

    const backupDir = path.join(process.cwd(), "prisma", "backups");
    if (fs.existsSync(backupDir)) {
      const files = fs.readdirSync(backupDir).filter(f => f.endsWith(".bak"));
      if (files.length > 0) {
        let latestTime = 0;
        for (const file of files) {
          const stats = fs.statSync(path.join(backupDir, file));
          if (stats.mtimeMs > latestTime) {
            latestTime = stats.mtimeMs;
          }
        }
        if (latestTime > 0) {
          health.lastBackup = new Date(latestTime).toLocaleString('pt-BR');
        }
      }
    }
  } catch (error) {
    console.error("System health check failed:", error);
  }

  return health;
}

export async function createBackup() {
  try {
    const dbPath = path.join(process.cwd(), "prisma", "dev.db");
    const backupDir = path.join(process.cwd(), "prisma", "backups");
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    if (fs.existsSync(dbPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupPath = path.join(backupDir, `dev-${timestamp}.db.bak`);
      fs.copyFileSync(dbPath, backupPath);
      return { success: true, message: "Backup concluído com sucesso!" };
    } else {
      return { success: false, error: "Banco de dados não encontrado." };
    }
  } catch (error) {
    console.error("Backup failed:", error);
    return { success: false, error: "Falha ao criar o backup." };
  }
}
