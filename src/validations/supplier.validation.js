import { body, param, query } from "express-validator";

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid supplier id")

];

export const createSupplierValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Supplier name is required")
        .isLength({ max: 150 })
        .withMessage(
            "Supplier name cannot exceed 150 characters"
        ),

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Supplier code is required")
        .isLength({ max: 30 })
        .withMessage(
            "Supplier code cannot exceed 30 characters"
        )
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage("Invalid supplier code"),

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

    body("notes")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes cannot exceed 500 characters"
        )

];

export const updateSupplierValidation = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Supplier name cannot be empty")
        .isLength({ max: 150 })
        .withMessage(
            "Supplier name cannot exceed 150 characters"
        ),

    body("code")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Supplier code cannot be empty")
        .isLength({ max: 30 })
        .withMessage(
            "Supplier code cannot exceed 30 characters"
        )
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage("Invalid supplier code"),

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

    body("notes")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes cannot exceed 500 characters"
        )

];

export const getSuppliersValidation = [

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
        .withMessage("isActive must be boolean")

];