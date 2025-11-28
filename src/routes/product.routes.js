import express from 'express';
import { FavoriteProductsHandler } from '../handlers/product.handlers.js';

const router = express.Router();

router.get('/favorite-product', FavoriteProductsHandler)


export default router