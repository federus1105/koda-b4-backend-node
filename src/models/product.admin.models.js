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

export async function updateProduct({ id, name, description, rating, priceOriginal, stock, image, size, variant, category }) {
  return prisma.$transaction(async (tx) => {
    // --- Update product ---
    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (description !== undefined) dataToUpdate.description = description;
    if (rating !== undefined) dataToUpdate.rating = parseFloat(rating);
    if (priceOriginal !== undefined) dataToUpdate.priceOriginal = parseFloat(priceOriginal);
    if (stock !== undefined) dataToUpdate.stock = parseInt(stock);
    if (image?.imageId !== undefined) dataToUpdate.id_product_images = image.imageId;

    const updatedProduct = await tx.product.update({
      where: { id },
      data: dataToUpdate,
    });

    // --- Update Product Images ---
    if (image) {
      const imageData = {};
      if (image.image_oneStr) imageData.photosOne = image.image_oneStr;
      if (image.image_twoStr) imageData.photosTwo = image.image_twoStr;
      if (image.image_threeStr) imageData.photosThree = image.image_threeStr;
      if (image.image_fourStr) imageData.photosFour = image.image_fourStr;

      if (Object.keys(imageData).length > 0) {
        await tx.productImages.update({
          where: { id: updatedProduct.id_product_images },
          data: imageData,
        });
      }
    }

    // --- Update Sizes ---
    const sizeArray = normalizeInput(size);
    if (sizeArray.length > 0) {
      await tx.sizeProduct.deleteMany({ where: { id_product: id } });

    const sizeData = sizeArray.map((id_size) => ({
      id_product: id,
      id_size: parseInt(id_size),
    }));

    await tx.sizeProduct.createMany({ data: sizeData });
    }

    // --- Update Variants ---
    const variantArray = normalizeInput(variant);
      if (variantArray.length > 0) {
        await tx.variantProduct.deleteMany({ where: { id_product: id } });

        const variantData = variantArray.map((id_variant) => ({
          id_product: id,
          id_variant: parseInt(id_variant),
        }));
        await tx.variantProduct.createMany({ data: variantData });
    }
      
    // --- Update Categories ---
    const categoryArray = normalizeInput(category);
    if (categoryArray.length > 0) {
      await tx.productCategories.deleteMany({ where: { id_product: id } });

      const categoryData = categoryArray.map((id_categories) => ({
        id_product: id,
        id_categories: parseInt(id_categories),
      }));
      await tx.productCategories.createMany({ data: categoryData });
    }
    

    return updatedProduct;
  });
}
