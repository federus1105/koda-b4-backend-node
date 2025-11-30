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


export async function UpdateUser(id, data) {
  return await prisma.$transaction(async (tx) => {
    const updateAccount = {};
    const updateUser = {};

    // --- ACCOUNT TABLE ---
    if (data.fullname !== undefined) updateAccount.fullname = data.fullname;
    if (data.phone !== undefined) updateAccount.phoneNumber = data.phone;
    if (data.address !== undefined) updateAccount.address = data.address;
    if (data.photos !== undefined) updateAccount.photos = data.photos;

    // --- USERS TABLE ---
    if (data.email !== undefined) updateUser.email = data.email;
    if (data.role !== undefined) updateUser.role = data.role;

    if (data.password !== undefined) {
      updateUser.password = await hashPassword(data.password);
    }

    // --- UPDATE ACCOUNT IF ANY FIELD SENT ---
    if (Object.keys(updateAccount).length > 0) {
      await tx.account.updateMany({
        where: { id_users: id },
        data: updateAccount,
      });
    }

    // --- UPDATE USERS IF ANY FIELD SENT ---
    if (Object.keys(updateUser).length > 0) {
      await tx.users.update({
        where: { id },
        data: updateUser,
      });
    }

    // --- RETURN UPDATED DATA ---
    return await tx.account.findFirst({
      where: { id_users: id },
      select: {
        id_users: true,
        fullname: true,
        phoneNumber: true,
        address: true,
        photos: true,
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });
  });
}