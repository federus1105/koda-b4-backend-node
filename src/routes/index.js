import { Router } from "express";
import authRoutes from "./auth.routes.js"
import productAdminRoutes from "./product.admin.routes.js"
import {authMiddleware, adminMiddleware } from "../middleware/auth.middleware.js";
import profileRoutes from "./profile.routes.js"
import productRoutes from "./product.routes.js"

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin/product', authMiddleware, adminMiddleware, productAdminRoutes);
router.use('/profile', authMiddleware, profileRoutes);
router.use('/product', productRoutes);

export default router;