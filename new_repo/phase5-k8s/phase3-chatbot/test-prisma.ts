import "dotenv/config";
import { PrismaClient } from "@prisma/client";

async function main() {
  console.log("Instantiating PrismaClient...");
  const prisma = new PrismaClient();
  console.log("Instantiated. Connecting...");
  try {
    const users = await prisma.user.findMany();
    console.log("Connected! Users found:", users.length);
  } catch (e) {
    console.error("Connection failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
