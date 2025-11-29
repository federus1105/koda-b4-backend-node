import { CreateProduct, DeleteProduct, getAllProducts, updateProduct } from "../models/product.admin.models.js";
import { normalizeInput } from "../pkg/utils/common.js";
import { getPrisma } from '../pkg/libs/prisma.js';
import path from 'path'
import redisClient from "../pkg/libs/redis.js";
const prisma = getPrisma();



/**
 * GET /admin/product
 * @summary List products with optional search and pagination
 * @tags Product
 * @param {string} name.query - Optional product name to search
 * @param {number} page.query - Page number for pagination (default 1)
 * @return {ProductResponse} 200 - success response
 * @security bearerAuth
 */
export async function ListProducts(req, res) {
  try {

    // --- FILTER AND PAGINATION ---
    const name = req.query.name || '' ;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // --- GET CACHE ---
    const cacheKey = `list-product:${page}:${name}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }


    // --- GET DATA ---
    const products = await getAllProducts({ name, skip, take: limit });
    const total = await getAllProducts({ name, countOnly: true });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        results: []
      });
    }

    const totalPages = Math.ceil(total / limit);
    const baseURL = "/admin/product";
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

    await redisClient.set(cacheKey, JSON.stringify(products), {
      EX: 60 * 5,
    });
    
   const result = {
      success: true,
      page,
      limit,
      total,
      totalPages,
      prevURL,
      nextURL,
      message: "Get list data successfully",
      results: products,
    };
    
    // --- SET CACHE ---
    await redisClient.set(cacheKey, JSON.stringify(result), {
      EX: 60 * 10,
    });

    return res.status(200).json(result);
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

/**
 * POST /admin/product
 * @summary Create a new product with images, size, variant, and category
 * @tags Product
 * @param {ProductInput} request.body.required - Product info - multipart/form-data
 * @return {object} 201 - Product created successfully
 * @return {object} 500 - Internal server error
 * @security bearerAuth
 */
export async function CreateProductHandler(req, res) {
  try {
    const size = normalizeInput(req.body.size);
    const variant = normalizeInput(req.body.variant);
    const category = normalizeInput(req.body.category);

    const image = {
      photosOne: req.files.image_one?.[0]?.path ? path.basename(req.files.image_one[0].path) : null,
      photosTwo: req.files.image_two?.[0]?.path ? path.basename(req.files.image_two[0].path) : null,
      photosThree: req.files.image_three?.[0]?.path ? path.basename(req.files.image_three[0].path) : null,
      photosFour: req.files.image_four?.[0]?.path ? path.basename(req.files.image_four[0].path) : null,
    };

    const product = await CreateProduct({
      name: req.body.name,
      description: req.body.description,
      rating: req.body.rating,
      priceOriginal: req.body.price,
      stock: req.body.stock,
      image,
      size,
      variant,
      category,
    }); 

    //  --- GET DATA FOR RESPONSE ---
    const [images, sizes, variants, categories] = await Promise.all([
      prisma.productImages.findUnique({
        where: { id: product.id_product_images },
      }),
      prisma.sizeProduct.findMany({
        where: { id_product: product.id },
        select: { id_size: true },
      }),
      prisma.variantProduct.findMany({
        where: { id_product: product.id },
        select: { id_variant: true },
      }),
      prisma.productCategories.findMany({
        where: { id_product: product.id },
        select: { id_categories: true },
      }),
    ]);

    // --- RESPONSE ---
    const response = {
      id: product.id,
      name: product.name,
      id_image: product.id_product_images,
      images: images,
      price: product.priceOriginal,
      rating: product.rating,
      description: product.description,
      stock: product.stock,
      size: sizes.map(s => s.id_size),
      variant: variants.map(v => v.id_variant),
      category: categories.map(c => c.id_categories),
    };

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      results: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

/**
 * PATCH /admin/product/{id}
 * @summary Update a product by ID 
 * @tags Product
 * @param {number} id.path.required - Product ID
 * @param {ProductUpdateInput} request.body - Product update info - multipart/form-data
 * @return {object} 200 - Product updated successfully
 * @return {object} 500 - Internal server error
 * @security bearerAuth
 */
export async function updateProductHandler(req, res) {
  try {
    const image = {
      imageId: req.body.imageId,
      image_oneStr: req.files.image_one?.[0]?.filename,
      image_twoStr: req.files.image_two?.[0]?.filename,
      image_threeStr: req.files.image_three?.[0]?.filename,
      image_fourStr: req.files.image_four?.[0]?.filename,
    };

    const { size, variant, category } = req.body;

    const product = await updateProduct({
      id: parseInt(req.params.id),
      name: req.body.name,
      description: req.body.description,
      rating: req.body.rating,
      priceOriginal: req.body.price,
      stock: req.body.stock,
      image,
      size,
      variant,
      category,
    });

    
    //  --- GET DATA FOR RESPONSE ---
    const [images, sizes, variants, categories] = await Promise.all([
      prisma.productImages.findUnique({
        where: { id: product.id_product_images },
      }),
      prisma.sizeProduct.findMany({
        where: { id_product: product.id },
        select: { id_size: true },
      }),
      prisma.variantProduct.findMany({
        where: { id_product: product.id },
        select: { id_variant: true },
      }),
      prisma.productCategories.findMany({
        where: { id_product: product.id },
        select: { id_categories: true },
      }),
    ]);

    // --- RESPONSE ---
    const response = {
      id: product.id,
      name: product.name,
      images: images,
      price: product.priceOriginal,
      rating: product.rating,
      description: product.description,
      stock: product.stock,
      created_at: product.updatedAt,
      size: sizes.map(s => s.id_size),
      variant: variants.map(v => v.id_variant),
      category: categories.map(c => c.id_categories),
    };

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      results: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

/**
 * POST /admin/product/{id}
 * @summary Delete a product by ID
 * @tags Product
 * @param {number} id.path.required - ID of the product to delete
 * @return {object} 200 - Success response
 * @return {object} 404 - Product not found
 * @return {object} 500 - Internal server error
 * @example response - 200 - success
 * @example response - 404 - not found
 * @example response - 500 - server error
 * @security bearerAuth
 */
export async function DeleteProductHandler(req, res) {
  try {
    const id = Number(req.params.id);

    const result = await DeleteProduct(id);

    return res.json({
      success: true,
      message: `Product id ${id} successfully deleted`,
      results: result
    });
  } catch (err) {
    if (err.code === "NOT_FOUND") {
      return res.status(404).json({ 
        success: false,
        message: err.message 
      });
    }

    return res.status(500).json({
      success: false,
       error: "Internal server error" 
      });
  }
};