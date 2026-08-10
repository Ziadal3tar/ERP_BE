import { body, param, query } from "express-validator";

export const stockIdValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid stock id")

];

export const stockInValidation = [

    body("product")
        .isMongoId()
        .withMessage("Invalid product id"),

    body("warehouse")
        .isMongoId()
        .withMessage("Invalid warehouse id"),

    body("quantity")
        .isFloat({ min: 0.01 })
        .withMessage(
            "Quantity must be greater than zero"
        ),

    body("reference")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Reference cannot exceed 100 characters"
        ),

    body("notes")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes cannot exceed 500 characters"
        )

];

export const stockOutValidation = [

    body("product")
        .isMongoId()
        .withMessage("Invalid product id"),

    body("warehouse")
        .isMongoId()
        .withMessage("Invalid warehouse id"),

    body("quantity")
        .isFloat({ min: 0.01 })
        .withMessage(
            "Quantity must be greater than zero"
        ),

    body("reference")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Reference cannot exceed 100 characters"
        ),

    body("notes")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes cannot exceed 500 characters"
        )

];

export const stockTransferValidation = [

    body("product")
        .isMongoId()
        .withMessage("Invalid product id"),

    body("fromWarehouse")
        .isMongoId()
        .withMessage(
            "Invalid source warehouse id"
        ),

    body("toWarehouse")
        .isMongoId()
        .withMessage(
            "Invalid destination warehouse id"
        ),

    body("quantity")
        .isFloat({ min: 0.01 })
        .withMessage(
            "Quantity must be greater than zero"
        ),

    body("reference")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Reference cannot exceed 100 characters"
        ),

    body("notes")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes cannot exceed 500 characters"
        )

];

export const getStockValidation = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage(
            "Page must be greater than zero"
        ),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage(
            "Limit must be between 1 and 100"
        ),

    query("product")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid product id"
        ),

    query("warehouse")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid warehouse id"
        )

];

export const getStockHistoryValidation = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage(
            "Page must be greater than zero"
        ),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage(
            "Limit must be between 1 and 100"
        ),

    query("product")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid product id"
        ),

    query("warehouse")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid warehouse id"
        ),

    query("type")
        .optional()
        .isIn([
            "IN",
            "OUT",
            "ADJUSTMENT",
            "TRANSFER_IN",
            "TRANSFER_OUT"
        ])
        .withMessage(
            "Invalid transaction type"
        )

];