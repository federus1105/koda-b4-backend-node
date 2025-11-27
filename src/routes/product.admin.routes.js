import express from 'express';
import { ListProducts } from '../handlers/product.admin.handler.js';

const router = express.Router();

router.get('/', ListProducts)

export default router