import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { calculateInstallment } from '../src/utils/util.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL as string }),
});

const run = async () => {
  const annualRate = Number(process.env.ANNUAL_RATE ?? 0.24);
  const rows = [
    {
      fullName: 'Ana Quispe',
      dni: '87654321',
      email: 'ana.quispe@example.com',
      phone: '912345678',
      amount: 3000,
      months: 12,
      status: 'pendiente' as const,
    },
    {
      fullName: 'Luis Torres',
      dni: '12348765',
      email: 'luis.torres@example.com',
      phone: '923456789',
      amount: 5000,
      months: 18,
      status: 'aprobada' as const,
    },
    {
      fullName: 'Maria Flores',
      dni: '76543219',
      email: 'maria.flores@example.com',
      phone: '934567890',
      amount: 2000,
      months: 6,
      status: 'rechazada' as const,
    },
    {
      fullName: 'Carlos Mendoza',
      dni: '45678912',
      email: 'carlos.mendoza@example.com',
      phone: '945678901',
      amount: 8000,
      months: 24,
      status: 'pendiente' as const,
    },
    {
      fullName: 'Sofia Ramos',
      dni: '23456789',
      email: 'sofia.ramos@example.com',
      phone: '956789012',
      amount: 1000,
      months: 6,
      status: 'aprobada' as const,
    },
    {
      fullName: 'Diego Huaman',
      dni: '34567890',
      email: 'diego.huaman@example.com',
      phone: '967890123',
      amount: 10000,
      months: 24,
      status: 'rechazada' as const,
    },
  ];
  const tasks = rows.reduce(
    (acc: Promise<unknown>[], row) => {
      const installment = calculateInstallment({ amount: row.amount, months: row.months, annualRate });
      return [
        ...acc,
        prisma.application.create({
          data: { ...row, annualRate, installment },
        }),
      ];
    },
    [],
  );
  await Promise.all(tasks);
  await prisma.$disconnect();
};

await run();
