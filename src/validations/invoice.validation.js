import { param, query } from "express-validator";

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid invoice id")

];

export const saleIdValidation = [

    param("saleId")
        .isMongoId()
        .withMessage("Invalid sale id")

];

export const getInvoicesValidation = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid page"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Invalid limit"),

    query("customer")
        .optional()
        .isMongoId()
        .withMessage("Invalid customer id"),

    query("status")
        .optional()
        .isIn([
            "Unpaid",
            "PartiallyPaid",
            "Paid",
            "Cancelled"
        ])
        .withMessage("Invalid invoice status")

];