import { query } from "express-validator";

export const salesReportValidation = [

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
        )

];

export const purchasesReportValidation = [

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
        )

];