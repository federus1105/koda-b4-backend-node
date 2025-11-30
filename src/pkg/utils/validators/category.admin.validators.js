import { body } from "express-validator";

export const createCategoryValidator = [
  body("name")
    .notEmpty().withMessage("name is required")
    .isString().withMessage("name must be a string")
    .isLength({ max: 20 }).withMessage("maximum name category 20 characters"),
]