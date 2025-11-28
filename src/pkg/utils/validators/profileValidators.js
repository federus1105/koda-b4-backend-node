import { body } from "express-validator";

export const updateProfileValidator = [
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
];