import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import BetterSqlite3 from 'better-sqlite3';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Vercel environment variables
const vercelDbUrl = process.env.POSTGRES_PRISMA_URL;
// Local environment
const localDbUrl = "file:./dev.db";
const localSqlite = new BetterSqlite3('dev.db');

// Check if we are in a Vercel deployment environment
const isVercel = process.env.LOCAL_MODE === 'false';

let prisma: PrismaClient;

if (isVercel && vercelDbUrl) {
  // Vercel (Postgres)
  const pool = new Pool({ connectionString: vercelDbUrl });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  // Local (SQLite)
  const adapter = new PrismaBetterSqlite3(localSqlite);
  prisma = new PrismaClient({ adapter });
}

export const db = prisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
