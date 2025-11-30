import express from 'express';
import { CreateCategoryHandler, ListCategoryHandler } from '../handlers/category.admin.handlers.js';

const router = express.Router();

router.get('/', ListCategoryHandler)
router.post('/', CreateCategoryHandler)


export default router