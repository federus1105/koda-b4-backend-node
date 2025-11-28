import { getPrisma } from '../pkg/libs/prisma.js';
const prisma = getPrisma();

export async function FavoriteProduct({skip = 0, take = 10, countOnly = false }) {
    const where = {
       isDeleted: false,
       isFavorite: true,
     };
     
    if (countOnly) {
        return await prisma.product.count({ where });
    }

  const products = await prisma.product.findMany({
    where,
    include: {
      productImages: {
        select: {
          photosOne: true,
        },
      },
    },
    skip,
    take,
  });

  return products.map((p) => ({
    id: p.id,
    image: p.productImages?.photosOne ?? null,
    name: p.name,
    flash_sale: p.flashSale,
    price: p.priceOriginal,
    discount: p.priceDiscount,
    description: p.description,
  }));
}