import { body, param, query } from "express-validator";

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid customer id")

];

export const createCustomerValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Customer name is required")
        .isLength({ max: 150 })
        .withMessage(
            "Customer name cannot exceed 150 characters"
        ),

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Customer code is required")
        .isLength({ max: 30 })
        .withMessage(
            "Customer code cannot exceed 30 characters"
        )
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage("Invalid customer code"),

    body("email")
        .optional({ nullable: true })
        .isEmail()
        .withMessage("Invalid email"),

    body("phone")
        .optional({ nullable: true })
        .trim(),

    body("address")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 300 })
        .withMessage(
            "Address cannot exceed 300 characters"
        ),

    body("taxNumber")
        .optional({ nullable: true })
        .trim(),

    body("creditLimit")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Credit limit cannot be negative"
        ),

    body("notes")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes cannot exceed 500 characters"
        )

];

export const updateCustomerValidation = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Customer name cannot be empty")
        .isLength({ max: 150 })
        .withMessage(
            "Customer name cannot exceed 150 characters"
        ),

    body("code")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Customer code cannot be empty")
        .isLength({ max: 30 })
        .withMessage(
            "Customer code cannot exceed 30 characters"
        )
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage("Invalid customer code"),

    body("email")
        .optional({ nullable: true })
        .isEmail()
        .withMessage("Invalid email"),

    body("phone")
        .optional({ nullable: true })
        .trim(),

    body("address")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 300 })
        .withMessage(
            "Address cannot exceed 300 characters"
        ),

    body("taxNumber")
        .optional({ nullable: true })
        .trim(),

    body("creditLimit")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Credit limit cannot be negative"
        ),

    body("notes")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes cannot exceed 500 characters"
        )

];

export const getCustomersValidation = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid page"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Invalid limit"),

    query("search")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Invalid search"),

    query("isActive")
        .optional()
        .isBoolean()
        .withMessage(
            "isActive must be boolean"
        )

];