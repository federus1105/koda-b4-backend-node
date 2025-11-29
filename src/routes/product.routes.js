import express from 'express';
import { DetailProductHandler, FavoriteProductsHandler, FilterProductHandler } from '../handlers/product.handlers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/favorite-product', FavoriteProductsHandler)
router.get('/', FilterProductHandler)
router.get('/:id', authMiddleware, DetailProductHandler)


export default router