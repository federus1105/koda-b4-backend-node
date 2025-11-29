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

export async function FilterProduct({ 
  name = "",
  categoryIDs = [],
  minPrice = 0,
  maxPrice = 0,
  sortBy = "name",
  skip = 0,
  take = 10,
  countOnly = false}) {

  const where = {
    isDeleted: false,
  };

  // --- SEARCH BY NAME ---
  if (name.trim() !== "") {
    where.name = {
      contains: name,
    };
  }

// --- CATEGORY ---
if (Array.isArray(categoryIDs) && categoryIDs.length > 0) {
  where.AND = categoryIDs.map(id => ({
    productCategories: {
      some: {
        id_categories: Number(id)
      }
    }
  }));
}

  
  // --- PRICE ---
  if (minPrice > 0) {
    where.priceOriginal = {
      ...(where.priceOriginal || {}),
      gte: minPrice,
    };
  }
  if (maxPrice > 0) {
    where.priceOriginal = {
      ...(where.priceOriginal || {}),
      lte: maxPrice,
      ...(where.priceOriginal || {}),
    };
  }

  if (countOnly) {
    return await prisma.product.count({ where });
  }

  const products = await prisma.product.findMany({
    where,
    skip,
    take,
    orderBy: { [sortBy]: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      priceOriginal: true,
      stock: true,
      rating: true,
      productImages: {
        select: {
          photosOne: true,
          photosTwo: true,
          photosThree: true,
          photosFour: true
        }
      },
      sizeProducts: {
        select: {
          size: { select: { name: true } }
        }
      },
      variantProducts: {
        select: {
          variant: { select: { name: true } }
        }
      }
    }
  });

  return products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.priceOriginal,
    stock: p.stock,
    rating: p.rating,
    images: {
      image_one: p.productImages?.photosOne || "",
      image_two: p.productImages?.photosTwo || "",
      image_three: p.productImages?.photosThree || "",
      image_four: p.productImages?.photosFour || ""
    },
    size: [...new Set(p.sizeProducts.map(sp => sp.size.name))],
    variant: [...new Set(p.variantProducts.map(vp => vp.variant.name))]
  }));

}