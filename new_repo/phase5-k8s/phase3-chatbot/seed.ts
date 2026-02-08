import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import { hash } from "bcryptjs";

// Initialize SQLite database
const dbPath = "./prisma/dev.db";
const sqlite = new Database(dbPath);
const adapter = new PrismaBetterSqlite3({
  url: dbPath,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "user@example.com";
  const password = "password";

  console.log(`Checking user: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("Creating new user...");
    const passwordHash = await hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });
    console.log("✅ User created successfully!");
    console.log("📧 Email: user@example.com");
    console.log("🔑 Password: password");
  } else {
    console.log("ℹ️ User already exists.");
    // Optional: Reset password if requested?
    // Let's assume if it exists, it's fine.
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
