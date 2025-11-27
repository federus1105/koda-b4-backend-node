import express from 'express';
import { ListProducts, CreateProductHandler } from '../handlers/product.admin.handler.js';
import upload from '../pkg/libs/upload.js';

const router = express.Router();

router.get('/', ListProducts)
router.post('/',  upload.fields([
    { name: 'image_one', maxCount: 1 },
    { name: 'image_two', maxCount: 1 },
    { name: 'image_three', maxCount: 1 },
    { name: 'image_four', maxCount: 1 },
  ]), CreateProductHandler)

export default router