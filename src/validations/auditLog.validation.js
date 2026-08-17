import {
    param,
    query
} from "express-validator";

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid audit log id"
        )

];

export const getAuditLogsValidation = [

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

    query("user")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid user id"
        ),

    query("module")
        .optional()
        .isIn([
            "Auth",
            "User",
            "Department",
            "Employee",
            "Attendance",
            "Leave",
            "Category",
            "Product",
            "Warehouse",
            "Stock",
            "Supplier",
            "Purchase",
            "Customer",
            "Sale",
            "Invoice",
            "Payment"
        ])
        .withMessage(
            "Invalid module"
        ),

    query("action")
        .optional()
        .isIn([
            "LOGIN",
            "CREATE",
            "UPDATE",
            "DELETE",
            "RESTORE",
            "CONFIRM",
            "CANCEL",
            "RECEIVE",
            "PAYMENT"
        ])
        .withMessage(
            "Invalid action"
        )

];