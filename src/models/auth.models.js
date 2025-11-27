import { getPrisma } from '../libs/prisma.js';
import bcrypt from "bcryptjs";
const prisma = getPrisma();

export async function findUserByEmail(email) {
  return prisma.users.findUnique({
    where: { email },
  });
}

export async function Register(email, password ) {
const hashedPassword = await bcrypt.hash(password, 10);

  const userData = {
    email,
    password: hashedPassword,
  };

    const accountData = {
    fullname,
  };

  return prisma.$transaction(async (tx) => {
    const existingUser = await tx.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error("email is already  registered");
    }

    // --- CREATE NEW USER ---
    const user = await tx.user.create({ data: userData });

    // --- CREATE USER ACCOUNT ---
    const account = await tx.account.create({
      data: { ...accountData, id_users: user.id },
    });

    return { user, account };
  });
}