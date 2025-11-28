import express from 'express';
import { ListProducts, CreateProductHandler, updateProductHandler, DeleteProductHandler } from '../handlers/product.admin.handler.js';
import upload from '../pkg/libs/upload.js';
import { AdminCreateProduct, AdminUpdateProduct } from '../pkg/utils/validators/productAdminValidators.js';
import { validate } from '../pkg/libs/validate.js';

const router = express.Router();

router.get('/', ListProducts)
router.post('/',  upload.fields([
    { name: 'image_one', maxCount: 1 },
    { name: 'image_two', maxCount: 1 },
    { name: 'image_three', maxCount: 1 },
    { name: 'image_four', maxCount: 1 },
  ]), AdminCreateProduct, validate, CreateProductHandler)
router.patch('/:id', upload.fields([
    { name: 'image_one', maxCount: 1 },
    { name: 'image_two', maxCount: 1 },
    { name: 'image_three', maxCount: 1 },
    { name: 'image_four', maxCount: 1 },
  ]), AdminUpdateProduct, validate, updateProductHandler)
router.post('/:id', DeleteProductHandler)

export default router