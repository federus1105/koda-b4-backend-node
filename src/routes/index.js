import { Router } from "express";
import authRoutes from "./auth.routes.js"
import productAdminRoutes from "./product.admin.routes.js"

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin/product', authRoutes);

export default router;