import { body } from 'express-validator';

export const CreateCartValidator = [
  body("product_id")
    .exists().withMessage("Product ID is required")
    .isInt({ gt: 0 }).withMessage("Product ID must be greater than 0"),

  body("quantity")
    .exists().withMessage("Quantity is required")
    .isInt({ gt: 0 }).withMessage("Quantity must be greater than 0"),
];