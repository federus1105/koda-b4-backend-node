import { body } from 'express-validator';
import { normalizeInput } from '../common.js';

export const AdminCreateProduct = [
  body('name')
    .exists({ checkFalsy: true }).withMessage('Name is required'),

  body('description')
    .exists({ checkFalsy: true }).withMessage('Description is required'),

  body('rating')
    .exists({ checkFalsy: true }).withMessage('Rating is required')
    .bail()
    .isFloat({ min: 1, max: 10 }).withMessage('Rating must be a number between 1 and 10'),

  body('price')
    .exists({ checkFalsy: true }).withMessage('Price is required')
    .bail()
    .isInt({ min: 5000 }).withMessage('Price must be at least 5000'),

  body('stock')
    .exists({ checkFalsy: true }).withMessage('Stock is required')
    .bail()
    .isInt({ min: 0 }).withMessage('Stock must be 0 or greater'),

  // Category
  body('category')
    .customSanitizer(normalizeInput)
    .custom((value) => {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error('Category must be an array with at least one item');
      }
      if (value.some(v => !v || v.toString().trim() === '')) {
        throw new Error('Each category cannot be empty');
      }
      return true;
    }),

  // Size
  body('size')
    .customSanitizer(normalizeInput)
    .custom((value) => {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error('Size must be an array with at least one item');
      }
      if (value.length > 3) {
        throw new Error('Size array max 3 items');
      }
      if (value.some(v => !v || v.toString().trim() === '')) {
        throw new Error('Each size cannot be empty');
      }
      return true;
    }),

  // Variant
  body('variant')
    .customSanitizer(normalizeInput)
    .custom((value) => {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error('Variant must be an array with at least one item');
      }
      if (value.length > 2) {
        throw new Error('Variant array max 2 items');
      }
      if (value.some(v => !v || v.toString().trim() === '')) {
        throw new Error('Each variant cannot be empty');
      }
      return true;
    }),
];


export const AdminUpdateProduct = [

  // Name
  body("name")
    .optional({ nullable: true })
    .isString().withMessage("Name must be a string")
    .isLength({ min: 1 }).withMessage("Name cannot be empty"),

  // Description
  body("description")
    .optional({ nullable: true })
    .isString().withMessage("Description must be a string")
    .isLength({ min: 1 }).withMessage("Description cannot be empty"),

  // Rating
  body("rating")
    .optional({ nullable: true })
    .isFloat({ min: 1, max: 10 }).withMessage("Rating must be between 1–10"),

  // Price
  body("priceOriginal")
    .optional({ nullable: true })
    .isInt({ min: 5000 }).withMessage("Price must be at least 5000"),

  // Stock
  body("stock")
    .optional({ nullable: true })
    .isInt({ min: 0 }).withMessage("Stock cannot be negative"),

  // CATEGORY
  body("category")
    .optional({ nullable: true })
    .customSanitizer(normalizeInput)
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error("Category must be an array");
      }
      if (value.some(v => !v || v.toString().trim() === '')) {
        throw new Error("Category item cannot be empty");
      }
      return true;
    }),

  // SIZE
  body("size")
    .optional({ nullable: true })
    .customSanitizer(normalizeInput)
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error("Size must be an array");
      }
      if (value.length > 3) {
        throw new Error("Size max 3 items");
      }
      if (value.some(v => !v || v.toString().trim() === '')) {
        throw new Error("Size item cannot be empty");
      }
      return true;
    }),

  // VARIANT
  body("variant")
    .optional({ nullable: true })
    .customSanitizer(normalizeInput)
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error("Variant must be an array");
      }
      if (value.length > 2) {
        throw new Error("Variant max 2 items");
      }
      if (value.some(v => !v || v.toString().trim() === '')) {
        throw new Error("Variant item cannot be empty");
      }
      return true;
    }),
  
];