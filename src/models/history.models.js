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
      image:
        h.product_images?.[0]?.product?.product_images?.photos_one || null,
    }));

    return formatted;

    } catch (error) {
    console.error("Error getHistoryModel:", error);
    throw new Error("Failed to fetch history");
    }
}