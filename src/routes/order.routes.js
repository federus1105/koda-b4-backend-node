import express from 'express';
import { CreateCartHandler, GetCartHandler, OrdersHandler } from '../handlers/orders.handlers.js';
import { CreateCartValidator, orderValidator } from '../pkg/utils/validators/ordersValidators.js';
import { validate } from '../pkg/libs/validate.js';

const router = express.Router();

router.post('/cart', CreateCartValidator, validate, CreateCartHandler)
router.get('/cart', GetCartHandler)
router.post('/transactions', orderValidator, validate, OrdersHandler)


export default router