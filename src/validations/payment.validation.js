import { body, param, query } from "express-validator";

export const invoiceIdValidation = [

    param("invoiceId")
        .isMongoId()
        .withMessage(
            "Invalid invoice id"
        )

];

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid payment id"
        )

];

export const createPaymentValidation = [

    body("amount")
        .isFloat({ min: 0.01 })
        .withMessage(
            "Payment amount must be greater than zero"
        ),

    body("method")
        .isIn([
            "Cash",
            "Card",
            "Bank"
        ])
        .withMessage(
            "Invalid payment method"
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

export const getPaymentsValidation = [

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

    query("invoice")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid invoice id"
        ),

    query("customer")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid customer id"
        )

];