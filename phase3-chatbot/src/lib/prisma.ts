import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

declare global {
  var prisma: PrismaClient | undefined;
}

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const url = `file:${dbPath}`;

const adapter = new PrismaBetterSqlite3({
  url,
});

export const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
