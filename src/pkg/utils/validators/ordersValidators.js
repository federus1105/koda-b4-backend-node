import { body } from 'express-validator';

export const CreateCartValidator = [
  body("product_id")
    .exists().withMessage("Product ID is required")
    .isInt({ gt: 0 }).withMessage("Product ID must be greater than 0"),

  body("quantity")
    .exists().withMessage("Quantity is required")
    .isInt({ gt: 0 }).withMessage("Quantity must be greater than 0"),
];

export const orderValidator = [
  body("fullname")
    .optional({ nullable: true })
    .isString().withMessage("Fullname must be a string")
    .isLength({ min: 3, max: 30 }).withMessage("Fullname must be between 3–30 characters"),

  body("phone")
    .optional({ nullable: true })
    .isMobilePhone("id-ID").withMessage("Invalid phone number"),

  body("address")
    .optional({ nullable: true })
    .isString().withMessage("Address must be a string")
    .isLength({ min: 5, max: 50 }).withMessage("Address must be between 5–50 characters"),

  body("email")
    .optional({ nullable: true })
    .isEmail().withMessage("Invalid email format"),

  body("id_paymentMethod")
    .notEmpty().withMessage("Payment method is required")
    .isInt({ min: 1 }).withMessage("Payment method must be a valid ID"),

  body("id_delivery")
    .notEmpty().withMessage("Delivery method is required")
    .isInt({ min: 1 }).withMessage("Delivery method must be a valid ID"),
];