import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin123", 10);

  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {
      password: hashedPassword,
    },
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });

  console.log("Admin created/updated:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });