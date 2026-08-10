import { body, param, query } from "express-validator";

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid sale id")

];

export const createSaleValidation = [

    body("customer")
        .isMongoId()
        .withMessage(
            "Invalid customer id"
        ),

    body("warehouse")
        .isMongoId()
        .withMessage(
            "Invalid warehouse id"
        ),

    body("items")
        .isArray({ min: 1 })
        .withMessage(
            "Sale must contain at least one item"
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

    body("paymentMethod")
        .optional()
        .isIn([
            "Cash",
            "Card",
            "Bank",
            "Credit"
        ])
        .withMessage(
            "Invalid payment method"
        ),

    body("notes")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes cannot exceed 500 characters"
        )

];

export const getSalesValidation = [

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

    query("customer")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid customer id"
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
            "Cancelled"
        ])
        .withMessage(
            "Invalid sale status"
        )

];