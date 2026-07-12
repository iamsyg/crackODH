import "dotenv/config";

import { hash } from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const demoPassword = "password123";

const demoUsers = [
  { name: "Fleet Manager", email: "fleet@transitops.com", role: "FLEET_MANAGER" as const },
  { name: "Alex Driver", email: "driver@transitops.com", role: "DRIVER" as const },
  { name: "Safety Officer", email: "safety@transitops.com", role: "SAFETY_OFFICER" as const },
  { name: "Financial Analyst", email: "finance@transitops.com", role: "FINANCIAL_ANALYST" as const },
];

async function main() {
  const passwordHash = await hash(demoPassword, 12);

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        passwordHash,
      },
      create: {
        name: user.name,
        email: user.email,
        role: user.role,
        passwordHash,
      },
    });
  }

  console.log("Seeded demo users. Sign in with password123");
  for (const user of demoUsers) {
    console.log(`  ${user.role.padEnd(18)} ${user.email}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
