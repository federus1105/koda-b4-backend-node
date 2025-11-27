import { getPrisma } from '../pkg/libs/prisma.js';
import { hashPassword } from '../pkg/libs/hashPassword.js';
const prisma = getPrisma();

export async function findUserByEmail(email) {
  return prisma.users.findUnique({
    where: { email },
  });
}

export async function RegisterUser(email, password, fullname ) {
const hashedPassword = await hashPassword(password)

  const userData = {
    email,
    password: hashedPassword,
  };

    const accountData = {
    fullname,
  };

  return prisma.$transaction(async (tx) => {
    const existingUser = await tx.users.findFirst({
      where: { email },
    });
    if (existingUser) {
      throw new Error("email is already  registered");
    }

    // --- CREATE NEW USER ---
    const user = await tx.users.create({ data: userData });

    // --- CREATE USER ACCOUNT ---
    const account = await tx.account.create({
      data: { ...accountData, id_users: user.id },
    });

    return { user, account };
  });
}