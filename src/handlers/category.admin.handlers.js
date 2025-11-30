import { ListCategory } from '../models/category.admin.models.js';
import { getPrisma } from '../pkg/libs/prisma.js';
const prisma = getPrisma();

export async function ListCategoryHandler(req, res) {
  try {
    // --- FILTER AND PAGINATION ---
    const name = req.query.name || '' ;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // --- GET DATA ---
    const categories = await ListCategory({ name, skip, take: limit });
    const total = await ListCategory({ name, countOnly: true });

    
    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "categories not found",
        results: []
      });
    }

    const totalPages = Math.ceil(total / limit);
    const baseURL = "/admin/categories";
    const queryPrefix = name ? `?name=${encodeURIComponent(name)}` : "?";
     // --- PREV URL ---
    let prevURL = null;
    if (page > 1) {
      const sep = name ? "&" : "?";
      prevURL = `${baseURL}${queryPrefix}${sep}page=${page - 1}`;
    }
    // --- NEXT URL ---
    let nextURL = null;
    if (page < totalPages) {
      const sep = name ? "&" : "?";
      nextURL = `${baseURL}${queryPrefix}${sep}page=${page + 1}`;
    }

    return res.status(200).json({
      success: true,
      message: "Get list categories successfully",
      page,
      limit,
      total,
      totalPages,
      prevURL,
      nextURL,
      results: categories,
    });

  } catch (error) {
    console.log("list categories error : ", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
