import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@applypilot.com";
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("Demo user already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.user.create({
    data: {
      name: "Demo User",
      email,
      passwordHash,
    },
  });

  console.log("Demo user created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });