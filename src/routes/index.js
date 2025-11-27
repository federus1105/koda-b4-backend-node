import { Router } from "express";
import authRoutes from "./auth.routes.js"
import productAdminRoutes from "./product.admin.routes.js"
import {authMiddleware, adminMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin/product', authMiddleware,adminMiddleware, productAdminRoutes);

export default router;