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
