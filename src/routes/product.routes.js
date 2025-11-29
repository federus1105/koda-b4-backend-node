import express from 'express';
import { FavoriteProductsHandler, FilterProductHandler } from '../handlers/product.handlers.js';

const router = express.Router();

router.get('/favorite-product', FavoriteProductsHandler)
router.get('/', FilterProductHandler)


export default router