import { body } from "express-validator";

export const CreateUserValidator = [
  body("fullname")
    .notEmpty().withMessage("fullname is required")
    .isString().withMessage("Fullname must be a string")
    .isLength({ min: 3, max: 30 }).withMessage("Fullname must be between 3–30 characters"),

  body("phone")
    .trim()
    .notEmpty().withMessage("phone is required")
    .isMobilePhone("id-ID").withMessage("Invalid phone number"),

  body("address")
    .notEmpty().withMessage("address is required")
    .isString().withMessage("Address must be a string")
    .isLength({ min: 5, max: 50 }).withMessage("Address must be between 5–50 characters"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[\W_]/).withMessage("Password must contain at least one special character"),

  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["user", "admin"]).withMessage("Role must be either 'user' or 'admin'"),
];

export const UpdateUserValidator = [
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

  body("role")
    .optional({ nullable: true })
    .isIn(["user", "admin"]).withMessage("Role must be either 'user' or 'admin'"),
];