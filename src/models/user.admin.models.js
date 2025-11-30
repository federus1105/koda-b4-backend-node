import { hashPassword } from '../pkg/libs/hashPassword.js';
import { getPrisma } from '../pkg/libs/prisma.js';
const prisma = getPrisma();

export async function ListUser({ name = "", skip = 0, take = 10, countOnly = false }) {
  try {
    const where = {};

    if (name.trim() !== "") {
      where.fullname = {
        contains: name,
      };
    }

  if (countOnly) {
    return await prisma.account.count({ where });
  }

    const users = await prisma.account.findMany({
    where,
    skip,
    take,
    orderBy: { fullname: "asc" },
      select: {
        photos: true,
        fullname: true,
        phoneNumber: true,
        address: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return users.map((u) => ({
      photo: u.photos || "",
      fullname: u.fullname,
      phone: u.phoneNumber,
      address: u.address || "",
      email: u.user?.email || "",
    }));

  } catch (error) {
    console.error("list user Error:", error);
    throw new Error("Failed to fetch user list");
  }
}


export async function CreateUser({ email, password, role, fullname, phone, address, photos }) {
 const hashedPassword = await hashPassword(password);
 
   return await prisma.$transaction(async (tx) => {
     // --- INSERT TABLE USERS ---
     const user = await tx.users.create({
       data: {
         email,
         password: hashedPassword,
         role,
       },
       select: {
         id: true,
         email: true,
         role: true,
       },
     });
 
     // --- INSERT TABLE ACCCOUNT ---
     const account = await tx.account.create({
       data: {
         id_users: user.id,
         fullname,
         phoneNumber: phone,
         address,
         photos,
       },
       select: {
         id_users: true,
         fullname: true,
         phoneNumber: true,
         address: true,
         photos: true,
       },
     });
 
     return {
       id: account.id_users,
       email: user.email,
       role: user.role,
       fullname: account.fullname,
       phone: account.phoneNumber,
       address: account.address,
       photos: account.photos,
     };
   }); 
}