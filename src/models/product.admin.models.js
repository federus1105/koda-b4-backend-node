import { getPrisma } from '../pkg/libs/prisma.js';
const prisma = getPrisma();
import { normalizeInput } from '../pkg/utils/common.js';

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

export async function CreateProduct({ name, description, rating, priceOriginal, stock, image, size, variant, category }) {
  return prisma.$transaction(async (tx) => {

    // --- create product images ---
    const imageData = await tx.productImages.create({
      data: {
        photosOne: image.photosOne || null,
        photosTwo: image.photosTwo || null,
        photosThree: image.photosThree || null,
        photosFour: image.photosFour || null,
      },
    });

    // --- create product ---
    const product = await tx.product.create({
      data: {
        name,
        description,
        rating: parseFloat(rating),
        priceOriginal: parseFloat(priceOriginal),
        stock: parseInt(stock),
        id_product_images: imageData.id,
      },
    });

    // --- Product Size ---
    const sizeValues = normalizeInput(size);
    if (sizeValues.length > 0) {
      const sizeData = sizeValues.map((id_size) => ({
        id_product: product.id,
        id_size: parseInt(id_size),
      }));
      await tx.sizeProduct.createMany({ data: sizeData });
    }

    // --- Product Variant ---
    const variantValues = normalizeInput(variant);
    if (variantValues.length > 0) {
      const variantData = variantValues.map((id_variant) => ({
        id_product: product.id,
        id_variant: parseInt(id_variant),
      }));
      await tx.variantProduct.createMany({ data: variantData });
    }

    // --- Product Categories ---
    const categoryValues = normalizeInput(category);
    if (categoryValues.length > 0) {
      const categoryData = categoryValues.map((id_categories) => ({
        id_product: product.id,
        id_categories: parseInt(id_categories),
      }));
      await tx.productCategories.createMany({ data: categoryData });
    }

    return product;
  });
}
