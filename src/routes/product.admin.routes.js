import express from 'express';
import { ListProducts } from '../handlers/product.admin.handler';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, ListProducts)

export default router