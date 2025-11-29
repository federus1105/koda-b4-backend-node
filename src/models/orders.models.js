import { getPrisma } from '../pkg/libs/prisma.js';
const prisma = getPrisma();

export async function CreateCart(accountID, input) {
    // --- CHECK STOCK ---
  const product = await prisma.product.findUnique({
    where: { id: input.product_id },
    select: { stock: true }
  });

  if (!product) {
    throw new Error("Product not found");
  }

  //   --- VALIDATION STOCK ---
  if (product.stock <= 0) {
    throw new Error("Product is out of stock");
  }
  if (input.quantity > product.stock) {
    throw new Error(`Insufficient stock ${product.stock}`);
  }

  // --- INSERT CART ---
  const cartItem = await prisma.cart.upsert({
    where: {
    account_id_product_id_size_id_variant_id: {
        account_id: accountID,
        product_id: input.product_id,
        size_id: input.size || null,
        variant_id: input.variant || null
      }
    },
    update: {
      quantity: { increment: input.quantity },
      updatedAt: new Date()
    },
    create: {
      account_id: accountID,
      product_id: input.product_id,
      size_id: input.size || null,
      variant_id: input.variant || null,
      quantity: input.quantity
    }
  });

  return cartItem;
}