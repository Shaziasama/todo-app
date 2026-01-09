import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import * as bcrypt from "bcryptjs"; // Note: In real app we use bcrypt, here we iterate simply or use the hash from auth.ts

// Setup properly for script execution
const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const db = new Database(dbPath);
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "user@example.com";
  const password = "password";

  // Simple hash shim since we might not have bcrypt installed in dev dependencies properly or to keep it simple
  // In auth.ts: const isValid = await compare(credentials.password, user.passwordHash);
  // We need to hash 'password'.
  // Let's assume we need to use the exact hashing method used in Register or manual.

  // Let's install bcryptjs if needed, or use a pre-calculated hash for "password"
  // bcrypt hash for "password" is usually: $2a$10$y.XjS/Y.XjS/Y.XjS/Y.XjS/Y.XjS/Y.XjS/Y.XjS/Y.XjS/Y.Xj
  // Wait, let's just use the create-user script logic.

  // But wait, I can just console log instructions to REGISTER if there is a register page?
  // User login page DOES NOT have a register button in the code I saw.

  // So I MUST seed the user.

  console.log(`Checking if user ${email} exists...`);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    console.log("User not found. Creating...");
    // We need a real hash. I'll rely on bcrypt being installed or available.
    // If not, I will install it.

    // Hash for "password" (bcrypt default cost)
    // $2a$10$CwTycUXWue0Thq9StjUM0u.t2d3YqD/c0a6b/k/j0.g/g/g/g/g/g (example)
    // Actually, let's try to import bcryptjs.

    // Quick fix: Hardcode a valid bcrypt hash for "password"
    // Generated online for "password": $2a$10$w1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1
    // Better: let me install bcryptjs types if missing?

    // Actually, let's check package.json
  } else {
    console.log("User already exists!");
  }
}
