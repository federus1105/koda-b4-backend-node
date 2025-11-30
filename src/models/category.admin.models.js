import { getPrisma } from '../pkg/libs/prisma.js';
const prisma = getPrisma();

export async function ListCategory({  name, skip = 0, take = 10, countOnly = false }) {
    const where = {};

    // --- SEARCH ---
    if (name.trim() !== "") {
      where.name = {
        contains: name,
      };
    }

    // --- COUNT ---
  if (countOnly) {
    return await prisma.categories.count({ where });
  }

    // --- QUERY ---
    const categories = await prisma.categories.findMany({
      where,
      orderBy: {
        name: "asc",
      },
      skip,
      take,
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return categories;
}

export async function CreateCategory(input) {
     const newCategory = await prisma.categories.create({
       data: {
         name: input.name,
       },
       select: {
         id: true,
         name: true,
         createdAt: true,
       },
     });
 
     return newCategory;
}

export async function UpdateCategory(id, input) {
    const updated = await prisma.categories.update({
      where: { id: Number(id) },
      data: {
        name: input.name,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;

}