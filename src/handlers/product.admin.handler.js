import { getAllProducts } from "../models/product.admin.models.js";

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
