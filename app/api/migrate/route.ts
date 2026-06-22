import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'api', 'migrate', 'dump.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'dump.json not found at ' + filePath }, { status: 404 });
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    const tables = ['Product', 'Insumo', 'FichaTecnica', 'ReceitaInsumo'];
    
    const results: any = {};

    for (const table of tables) {
      if (data[table] && data[table].length > 0) {
        const records = data[table].map((record: any) => {
          if (record.createdAt) record.createdAt = new Date(record.createdAt);
          if (record.updatedAt) record.updatedAt = new Date(record.updatedAt);
          if (record.dataUltimaCompra) record.dataUltimaCompra = new Date(record.dataUltimaCompra);
          return record;
        });

        const delegate = (prisma as any)[table[0].toLowerCase() + table.slice(1)];

        const count = await delegate.count();
        if (count === 0) {
            await delegate.createMany({
              data: records
            });
            results[table] = `Seeded ${records.length} records.`;

            await prisma.$executeRawUnsafe(`SELECT setval('"${table}_id_seq"', coalesce(max(id), 1), max(id) IS NOT null) FROM "${table}";`);
        } else {
            results[table] = `Skipped. Already contains ${count} records.`;
        }
      }
    }

    if (data.StoreSettings && data.StoreSettings.length > 0) {
        const count = await prisma.storeSettings.count();
        if (count === 0) {
            const record = data.StoreSettings[0];
            if (record.createdAt) record.createdAt = new Date(record.createdAt);
            if (record.updatedAt) record.updatedAt = new Date(record.updatedAt);
            
            await prisma.storeSettings.create({
                data: record
            });
            results['StoreSettings'] = 'Seeded settings.';
        } else {
            results['StoreSettings'] = 'Skipped settings.';
        }
    }

    return NextResponse.json({ message: 'Migration completed successfully!', results });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
