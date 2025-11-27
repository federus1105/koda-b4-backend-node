import { getPrisma } from '../pkg/libs/prisma.js';
const prisma = getPrisma();

export async function getAllProducts(filters) {
    const products = await prisma.product.findMany({
        where: filters.name
            ? {
                  name: {
                      contains: filters.name,
                      mode: "insensitive",
                  },
              }
            : {},
        orderBy: {
            createdAt: "desc",
        },
    });

    return products;
}