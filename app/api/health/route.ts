import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const startTime = performance.now();

    await prisma.$queryRaw`SELECT 1`;
    
    const duration = Math.round(performance.now() - startTime);

    return NextResponse.json({
      status: 'UP',
      database: 'connected',
      environment: process.env.NODE_ENV,
      latencyMs: duration,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      status: 'DOWN',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
