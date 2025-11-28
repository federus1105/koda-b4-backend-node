import { FavoriteProduct } from "../models/product.models.js";

export async function FavoriteProductsHandler (req, res) {
 try {
     // --- PAGINATION ---
     const page = parseInt(req.query.page) || 1;
     const limit = 4;
     const skip = (page - 1) * limit;   
  
     // --- GET DATA ---
     const data = await FavoriteProduct({skip, take: limit})
     const total = await FavoriteProduct({countOnly: true })
  
     if (data.length === 0) {
     return res.status(404).json({
         success: false,
         message: "Favorite product not found",
         results: []
       });
     }
  
     // --- TOTAL PAGES ---
     const totalPages = Math.ceil(total / limit);
  
     // --- BASE URL ---
     const baseURL = "/product/favorite-product";
  
     // --- PREV URL ---
     let prevURL = null;
     if (page > 1) {
       prevURL = `${baseURL}?page=${page - 1}`;
     }
  
     // --- NEXT URL ---
     let nextURL = null;
     if (page < totalPages) {
       nextURL = `${baseURL}?page=${page + 1}`;
     }
      return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages,
      prevURL,
      nextURL,
      message: "Get favorite product successfully",
      results: data,
    });
} catch (error) {
    console.log("get favorite product error : ", error)
    return res.status(500).json({
        success: false,
        message: "Internak server error",
        error: error.message
    })

}
    
}