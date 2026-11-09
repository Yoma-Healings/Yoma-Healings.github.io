const prisma = require("../config/database");

function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
}

function createUser({ name, email, passwordHash, role = "ADMIN" }) {
  return prisma.user.create({
    data: { name, email: email.toLowerCase().trim(), passwordHash, role }
  });
}

module.exports = { findUserByEmail, createUser };