import express from 'express';
import { CreateCartHandler, GetCartHandler } from '../handlers/orders.handlers.js';
import { CreateCartValidator } from '../pkg/utils/validators/ordersValidators.js';
import { validate } from '../pkg/libs/validate.js';

const router = express.Router();

router.post('/cart', CreateCartValidator, validate, CreateCartHandler)
router.get('/cart', GetCartHandler)


export default router