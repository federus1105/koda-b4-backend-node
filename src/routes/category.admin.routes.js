import express from 'express';
import { CreateCategoryHandler, ListCategoryHandler } from '../handlers/category.admin.handlers.js';
import { createCategoryValidator } from '../pkg/utils/validators/category.admin.validators.js';
import { validate } from '../pkg/libs/validate.js';

const router = express.Router();

router.get('/', ListCategoryHandler)
router.post('/', createCategoryValidator, validate, CreateCategoryHandler)


export default router