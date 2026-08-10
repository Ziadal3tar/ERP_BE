import { body, param, query } from "express-validator";

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid purchase id")

];

const itemValidation = [

    body("items")
        .isArray({ min: 1 })
        .withMessage(
            "Purchase must contain at least one item"
        ),

    body("items.*.product")
        .isMongoId()
        .withMessage(
            "Invalid product id"
        ),

    body("items.*.quantity")
        .isFloat({ min: 0.01 })
        .withMessage(
            "Quantity must be greater than zero"
        ),

    body("items.*.unitPrice")
        .isFloat({ min: 0 })
        .withMessage(
            "Unit price must be greater than or equal to zero"
        )

];

export const createPurchaseValidation = [

    body("supplier")
        .isMongoId()
        .withMessage(
            "Invalid supplier id"
        ),

    body("warehouse")
        .isMongoId()
        .withMessage(
            "Invalid warehouse id"
        ),

    ...itemValidation,

    body("discount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Discount cannot be negative"
        ),

    body("tax")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Tax cannot be negative"
        ),

    body("notes")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes cannot exceed 500 characters"
        )

];

export const updatePurchaseValidation = [

    body("supplier")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid supplier id"
        ),

    body("warehouse")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid warehouse id"
        ),

    body("items")
        .optional()
        .isArray({ min: 1 })
        .withMessage(
            "Purchase must contain at least one item"
        ),

    body("items.*.product")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid product id"
        ),

    body("items.*.quantity")
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage(
            "Quantity must be greater than zero"
        ),

    body("items.*.unitPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Unit price must be greater than or equal to zero"
        ),

    body("discount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Discount cannot be negative"
        ),

    body("tax")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Tax cannot be negative"
        ),

    body("notes")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes cannot exceed 500 characters"
        )

];

export const getPurchasesValidation = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage(
            "Invalid page"
        ),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage(
            "Invalid limit"
        ),

    query("supplier")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid supplier id"
        ),

    query("warehouse")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid warehouse id"
        ),

    query("status")
        .optional()
        .isIn([
            "Draft",
            "Confirmed",
            "Received",
            "Cancelled"
        ])
        .withMessage(
            "Invalid purchase status"
        )

];