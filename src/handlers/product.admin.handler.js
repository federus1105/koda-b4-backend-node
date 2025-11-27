import { CreateProduct, getAllProducts, updateProduct } from "../models/product.admin.models.js";
import { normalizeInput } from "../pkg/utils/common.js";
import { getPrisma } from '../pkg/libs/prisma.js';
import path from 'path'
const prisma = getPrisma();

export async function ListProducts(req, res) {
    try {
        const filters = { name: req.query.name || '' };

        // --- PAGINATION ---
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // --- GET DATA ---
        const products = await getAllProducts({
            ...filters,
            skip,
            take: limit,
        });

        const total = await getAllProducts({ name: filters.name, countOnly: true });

        if (products.length === 0) {
            res.status(404).json({
                success: false,
                message: "Product not found"
            })
        return
        }

        res.status(200).json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            success: true,
            message: "Get list data successfully",
            results: products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}


export async function CreateProductHandler(req, res) {
  try {
    const size = normalizeInput(req.body.size);
    const variant = normalizeInput(req.body.variant);
    const category = normalizeInput(req.body.category);

    const image = {
      photosOne: req.files.image_one?.[0]?.path ? path.basename(req.files.image_one[0].path) : null,
      photosTwo: req.files.image_two?.[0]?.path || null,
      photosThree: req.files.image_three?.[0]?.path || null,
      photosFour: req.files.image_four?.[0]?.path || null,
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


export async function updateProductHandler(req, res) {
  try {
    // File upload → ambil nama file saja
    const image = {
      imageId: req.body.imageId, // kalau mau ganti image, bisa ambil id dari body
      image_oneStr: req.files.image_one?.[0]?.filename,
      image_twoStr: req.files.image_two?.[0]?.filename,
      image_threeStr: req.files.image_three?.[0]?.filename,
      image_fourStr: req.files.image_four?.[0]?.filename,
    };

    // Normalisasi array sudah dilakukan di middleware normalizeArrayFields
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