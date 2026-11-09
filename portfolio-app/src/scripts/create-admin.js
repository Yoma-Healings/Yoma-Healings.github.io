require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("../config/database");

async function main() {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!name || !email || password.length < 14) {
    throw new Error("Set ADMIN_NAME, ADMIN_EMAIL and an ADMIN_PASSWORD of at least 14 characters in .env.");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role: "ADMIN" },
    create: { name, email, passwordHash, role: "ADMIN" }
  });
  console.log("Admin account ready for:", user.email);
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());