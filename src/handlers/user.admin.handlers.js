import { ListUser } from "../models/user.admin.models.js";

export async function ListUserHandler(req, res) {
  try {
    // --- FILTER AND PAGINATION ---
    const name = req.query.name || '' ;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    
    const users = await ListUser({ name, skip, take: limit });
    const total = await ListUser ({name, countOnly: true})
    if (users.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Users not found",
            results: []
        });
    }
    
    const totalPages = Math.ceil(total / limit);
    const baseURL = "/admin/user";
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

     const result = {
      success: true,
      message: "Get list user successfully",
      page,
      limit,
      total,
      totalPages,
      prevURL,
      nextURL,
      results: users,
    };
    
    return res.status(200).json(result)

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}