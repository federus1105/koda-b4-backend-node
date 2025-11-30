import { getPrisma } from '../pkg/libs/prisma.js';
const prisma = getPrisma();

export async function History({ 
 userID, 
 skip = 0, 
 take = 5,
 month = 0, 
 status = 0,  
 countOnly = false  
}) {
    try {
    // --- WHERE CLAUSE ---
    const whereClause = {
      id_account: userID,
    };

    // --- FILTER MONTH ---
    if (month !== 0) {
      whereClause.createdAt = {
        gte: new Date(new Date().getFullYear(), month - 1, 1),
        lt:  new Date(new Date().getFullYear(), month, 1),
      };
    }

    // --- FILTER STATUS ---
    if (status !== 0) {
      whereClause.id_status = status;
    }

    if (countOnly) {
    return await prisma.orders.count();
    }

    // --- QUERY ---
    const histories = await prisma.orders.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      select: {
        id: true,
        order_number: true,
        createdAt: true,
        total: true,
        status: {
          select: { name: true },
        },
        productOrders: {
          take: 1,
          orderBy: { id_order: "desc" },
          select: {
            product: {
              select: {
                productImages: {
                  select: { photosOne: true },
                },
              },
            },
          },
        },
      },
    });

    // --- FORMAT DATA ---
    const formatted = histories.map(h => ({
      id: h.id,
      order_number: h.order_number,
      date: h.createdAt,
      status: h.status?.name || null,
      total: h.total,
      image: h.productOrders?.[0]?.product?.productImages?.photosOne || "",
    }));

    return formatted;

    } catch (error) {
    console.error("Error getHistoryModel:", error);
    throw new Error("Failed to fetch history");
    }
}

export async function DetailHistory(userID, historyID) {
   try {
      const order = await prisma.orders.findFirst({
        where: {
          id: historyID,
          id_account: userID,
        },
        select: {
          id: true,
          order_number: true,
          fullname: true,
          phoneNumber: true,
          email: true,
          address: true,
          total: true,
          createdAt: true,
  
          paymentMethod: {
            select: { name: true },
          },
          delivery: {
            select: { name: true },
          },
          status: {
            select: { name: true },
          },
  
          // --- ITEMS ---
          productOrders: {
            select: {
              quantity: true,
              size: true,
              variant: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  flashSale: true,
                  productImages: {
                    select: {
                      photosOne: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
  
      if (!order) return null;
      const items = order.productOrders.map((po) => ({
        id: po.product.id,
        image: po.product.productImages?.photosOne || null,
        flash_sale: po.product.flashSale,
        name: po.product.name,
        quantity: po.quantity,
        delivery: order.delivery?.name || null,
        size: po.size,
        variant: po.variant,
      }));
  
      return {
        id: order.id,
        order_number: order.order_number,
        fullname: order.fullname,
        phone: order.phoneNumber,
        email: order.email,
        address: order.address,
        payment: order.paymentMethod?.name || null,
        delivery: order.delivery?.name || null,
        status: order.status?.name || null,
        total: order.total,
        createdAt: order.createdAt,
        items,
      };
  
    } catch (error) {
      console.error("Detail History error:", error);
      throw new Error("Failed to fetch detail history");
    }
}