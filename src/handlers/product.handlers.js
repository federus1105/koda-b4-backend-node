import { DetailProduct, FavoriteProduct, FilterProduct } from "../models/product.models.js";
import redisClient from "../pkg/libs/redis.js";

/**
 * GET /product/favorite-product
 * @summary List Favorite products with  pagination
 * @tags Product
 * @param {number} page.query - Page number for pagination (default 1)
 * @return {ProductResponse} 200 - success response
 */
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
  
     const totalPages = Math.ceil(total / limit);
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

/**
 * GET /product
 * @summary Filter and list products with search, category, price range, and pagination
 * @tags Product
 * @param {string} name.query - Filter by product name (optional)
 * @param {array<number>} category.query - Filter category
 * @param {number} min_price.query - Minimum price filter (optional)
 * @param {number} max_price.query - Maximum price filter (optional)
 * @param {string} sort_by.query - Sorting field (name | priceOriginal) (default: name)
 * @param {number} page.query - Page number for pagination (default: 1)
 * @return {object} 200 - success response
 */
export async function FilterProductHandler(req, res) {
  try {
    const name = req.query.name || "";
    let categoryIDs = req.query.category || [];
    if (!Array.isArray(categoryIDs)) {
      categoryIDs = [categoryIDs];
    }
    categoryIDs = categoryIDs.map(Number).filter(n => !isNaN(n));
    const minPrice = parseFloat(req.query.min_price) || 0;
    const maxPrice = parseFloat(req.query.max_price) || 0;
    const sortByQuery = req.query.sort_by || "name";
    const sortByMap = {
      name: "name",
      priceOriginal: "priceOriginal"
    };
    const sortBy = sortByMap[sortByQuery] || "name";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const cacheKey = `filter-product:${page}:name=${name}&category=${categoryIDs.join(",")}&min_price=${minPrice}&max_price=${maxPrice}&sort_by=${sortByQuery}`;
    // --- GET CACHE ---
    const cached = await redisClient.get(cacheKey);
    if (cached) {
    return res.status(200).json(JSON.parse(cached));
    }

    // --- GET DATA ---
    const products = await FilterProduct({
      name,
      categoryIDs,
      minPrice,
      maxPrice,
      sortBy,
      skip,
      take: limit,
    });
    const total = await FilterProduct({
      name,
      categoryIDs,
      minPrice,
      maxPrice,
      countOnly: true,
    });

    const totalPages = Math.ceil(total / limit);
    const baseURL = "/product";

    // --- BUILD QUERY ---
    const queryStringParts = [];
    if (name) queryStringParts.push(`name=${encodeURIComponent(name)}`);
    if (categoryIDs.length) {categoryIDs.forEach(id => queryStringParts.push(`category=${id}`));}
    if (minPrice > 0) queryStringParts.push(`min_price=${minPrice}`);
    if (maxPrice > 0) queryStringParts.push(`max_price=${maxPrice}`);
    queryStringParts.push(`sort_by=${sortByQuery}`);
    const qs = queryStringParts.join("&");

  //  --- PREV AND NEXT URL --
    const prevURL = page > 1 ? `${baseURL}?${qs}&page=${page - 1}` : null;
    const nextURL = page < totalPages ? `${baseURL}?${qs}&page=${page + 1}` : null;

    const result = {
      success: true,
      page,
      limit,
      total,
      totalPages,
      prevURL,
      nextURL,
      results: products
    };

  //  --- SAVE CACHE ---
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 60 * 5 });

    return res.status(200).json(result);


  } catch (error) {
    console.error("Filter Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

/**
 * GET /product/{id}
 * @summary Detail product
 * @tags Product
 * @param {number} id.path.required - ID product
 * @return {object} 200 - success response
 * @security bearerAuth
 */
export async function DetailProductHandler(req, res) {

  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false, 
        message: "Invalid product ID" 
      });
    }

    const product = await DetailProduct(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found" 
      });
    }

    return res.json({
       success: true, 
       message: "Get detail product successfully",
       results: product
    });
  } catch (error) {
    console.error("Get Product Detail Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
}