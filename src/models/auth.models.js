import { getPrisma } from '../pkg/libs/prisma.js';
import { hashPassword, verifyPassword } from '../pkg/libs/hashPassword.js';
import redisClient from '../pkg/libs/redis.js';
const prisma = getPrisma();


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

export async function LoginUser(email, password) {
  const user = await prisma.users.findFirst({
    where: {email},
    include: {
      accounts: true
    }
  })

  if (!user) {
    throw new Error("Invalid email or password");
  }
  
  // --- VERIFY PASSWORD ---
  const isValid = await verifyPassword(user.password, password);
  if (!isValid) {
      throw new Error("Invalid email or password");
  }

  return {
      id: user.id,
      email: user.email,
      fullname: user.account?.fullname || null,
      role: user.role
  };

}

export async function GetUserByEmail(email) {
  try {
    const user = await prisma.users.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return { 
        success: false, 
        message: "user not found" 
      };
    }

    return { success: true, data: user };

  } catch (error) {
    return { 
      success: false, 
      message: "internal server error", 
      error: error.message };
  }
}

export async function SaveResetToken(key, userID, ttlSeconds) {
  try {
    await redisClient.set(key, userID, { EX: ttlSeconds });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Failed to save token",
      error: error.message,
    };
  }
}
