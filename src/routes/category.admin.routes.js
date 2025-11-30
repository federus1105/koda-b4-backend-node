import express from 'express';
import { ListCategoryHandler } from '../handlers/category.admin.handlers.js';

const router = express.Router();

router.get('/', ListCategoryHandler)


export default router