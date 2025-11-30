import { getPrisma } from '../pkg/libs/prisma.js';
import { getAndValidateUserData } from '../pkg/utils/userData.js';
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

export async function GetCart(userID) {
  const carts = await prisma.cart.findMany({
    where: { account_id: userID },
    select: {
      id: true,
      quantity: true,
      size: { select: { name: true } },
      variant: { select: { name: true } },
      product: {
        select: {
          id: true,
          name: true,
          priceOriginal: true,
          priceDiscount: true,
          flashSale: true,
          productImages: {
            select: {
              photosOne: true
            }
          }
        }
      }
    }
  });

  return carts.map(c => ({
    id: c.id,
    id_product: c.product.id,
    name: c.product.name,
    price: c.product.priceOriginal,
    discount: c.product.priceDiscount,
    flash_sale: c.product.flashSale,
    images: c.product.productImages?.photosOne || "",
    qty: c.quantity,
    size: c.size?.name || null,
    variant: c.variant?.name || null,
    subtotal: (c.product.priceOriginal * c.quantity)
  }));
}


export async function Orders(input, userID) {
    // --- VALIDATE USER DATA ---
  const userData = await getAndValidateUserData(userID, {
    email: input.email,
    fullName: input.fullname,
    address: input.address,
    phone: input.phone
  });

  //  --- UPDATE INPUT ---
  input.email = userData.email;
  input.fullname = userData.fullname;
  input.address = userData.address;
  input.phone = userData.phone;

  // --- GET CART ---
  const cartItems = await prisma.cart.findMany({
    where: { account_id: userID },
    select: {
      quantity: true,
      size: { select: { name: true } },
      variant: { select: { name: true } },
      product: {
        select: {
          id: true,
          name: true,
          priceOriginal: true,
          priceDiscount: true,
          flashSale: true
        }
      }
    }
  });
  if (cartItems.length === 0) {
    throw new Error("Cart is empty, can't place an order");
  }

  // --- LOGIC CALCULATION ---
  let subtotal = 0;
  const products = cartItems.map(c => {
    const price = c.product.flashSale ? c.product.priceDiscount : c.product.priceOriginal;
    const itemSubtotal = price * c.quantity;
    subtotal += itemSubtotal;

    return {
      id_product: c.product.id,
      quantity: c.quantity,
      subtotal: itemSubtotal,
      size: c.size?.name || null,
      variant: c.variant?.name || null
    };
  });
  if (!input.id_delivery) throw new Error("Delivery method ID is required");
  if (!input.id_paymentMethod) throw new Error("Payment method ID is required");


  // --- DELIVERY FEE ---
  const delivery = await prisma.delivery.findUnique({
    where: { id: input.id_delivery }
  });
  if (!delivery) throw new Error("Delivery method not found");

  
  const deliveryFee = delivery.fee;
  const tax = 2000;
  const totalFinal = subtotal + deliveryFee + tax;


  // --- TRANSACTION ---
  return await prisma.$transaction(async tx => {
    const order = await tx.orders.create({
      data: {
        id_account: userID,
        email: input.email,
        fullname: input.fullname, 
        address: input.address,
        phoneNumber: input.phone,
        id_delivery: input.id_delivery,
        id_paymentmethod: input.id_paymentMethod,
        subtotal,
        tax,
        delivery_fee: deliveryFee,
        total: totalFinal,
        id_status: 1,
        order_number: `#ORD-${String(Date.now()).slice(-6)}`
      }
    });

    // --- INSERT PRODUCT ORDERS & UPDATE STOCK ---
    for (const p of products) {
      await tx.productOrders.create({
        data: {
          id_order: order.id,
          id_product: p.id_product,
          quantity: p.quantity,
          variant: p.variant,
          size: p.size,
          subtotal: p.subtotal
        }
      });
      const updateStock = await tx.product.updateMany({
        where: { id: p.id_product, stock: { gte: p.quantity } },
        data: { stock: { decrement: p.quantity } }
      });
      if (updateStock.count === 0) {
        throw new Error(`Stock not enough for product ${p.id_product}`);
      }
    }

    
    // --- DELETE CART ---
    await tx.cart.deleteMany({ where: { account_id: userID } });

    return {
      id_Orders: order.id,
      order_number: order.order_number,
      email: input.email,
      fullName: input.fullname,
      address: input.address,
      phone: input.phone,
      id_PaymentMethod: input.id_paymentMethod,
      id_Delivery: input.id_delivery,
      subtotal,
      tax,
      deliveryFee,
      total: totalFinal,
      products
    };
  });

}