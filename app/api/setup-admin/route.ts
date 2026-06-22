import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const adminEmail = 'admin@padaria.com';
    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (existingUser) {
      return NextResponse.json({ message: 'Admin user already exists.' });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.user.create({
      data: {
        name: 'Administrador',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    return NextResponse.json({ message: 'Admin user created successfully! Email: admin@padaria.com | Pass: admin123' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
