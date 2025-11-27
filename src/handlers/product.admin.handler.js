import { getAllProducts } from "../models/product.admin.models";

export async function ListProducts(req, res) {
    try {
        const filters = { name: req.query.name || '' };
        const products = await getAllProducts(filters);

        res.status(200).json({
            success: true,
            message: "List of products",
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
