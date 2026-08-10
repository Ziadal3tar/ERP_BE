import { body, param, query } from "express-validator";

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid product id")

];

export const createProductValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .isLength({ max: 150 })
        .withMessage(
            "Product name cannot exceed 150 characters"
        ),

    body("sku")
        .trim()
        .notEmpty()
        .withMessage("SKU is required")
        .isLength({ max: 50 })
        .withMessage(
            "SKU cannot exceed 50 characters"
        )
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage(
            "SKU can only contain letters, numbers, _ and -"
        ),

    body("barcode")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Barcode cannot exceed 100 characters"
        ),

    body("category")
        .isMongoId()
        .withMessage(
            "Invalid category id"
        ),

    body("description")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage(
            "Description cannot exceed 1000 characters"
        ),

    body("purchasePrice")
        .isFloat({ min: 0 })
        .withMessage(
            "Purchase price must be greater than or equal to zero"
        ),

    body("sellingPrice")
        .isFloat({ min: 0 })
        .withMessage(
            "Selling price must be greater than or equal to zero"
        ),

    body("unit")
        .trim()
        .notEmpty()
        .withMessage("Unit is required")
        .isLength({ max: 30 })
        .withMessage(
            "Unit cannot exceed 30 characters"
        ),

    body("minStock")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Minimum stock must be greater than or equal to zero"
        ),

    body("image")
        .optional({ nullable: true })
        .isURL()
        .withMessage(
            "Image must be a valid URL"
        )

];

export const updateProductValidation = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
            "Product name cannot be empty"
        )
        .isLength({ max: 150 })
        .withMessage(
            "Product name cannot exceed 150 characters"
        ),

    body("sku")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
            "SKU cannot be empty"
        )
        .isLength({ max: 50 })
        .withMessage(
            "SKU cannot exceed 50 characters"
        )
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage(
            "Invalid SKU format"
        ),

    body("barcode")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Barcode cannot exceed 100 characters"
        ),

    body("category")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid category id"
        ),

    body("description")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage(
            "Description cannot exceed 1000 characters"
        ),

    body("purchasePrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Purchase price must be greater than or equal to zero"
        ),

    body("sellingPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Selling price must be greater than or equal to zero"
        ),

    body("unit")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
            "Unit cannot be empty"
        )
        .isLength({ max: 30 })
        .withMessage(
            "Unit cannot exceed 30 characters"
        ),

    body("minStock")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Minimum stock must be greater than or equal to zero"
        ),

    body("image")
        .optional({ nullable: true })
        .isURL()
        .withMessage(
            "Image must be a valid URL"
        )

];

export const getProductsValidation = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage(
            "Page must be greater than 0"
        ),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage(
            "Limit must be between 1 and 100"
        ),

    query("search")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Search cannot exceed 100 characters"
        ),

    query("category")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid category id"
        ),

    query("isActive")
        .optional()
        .isBoolean()
        .withMessage(
            "isActive must be boolean"
        )

];