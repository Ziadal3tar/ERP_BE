import { body, param, query } from "express-validator";

const leaveTypes = [
    "Annual",
    "Sick",
    "Emergency",
    "Unpaid"
];

const leaveStatuses = [
    "Pending",
    "Approved",
    "Rejected",
    "Cancelled"
];

/*
|--------------------------------------------------------------------------
| ID Validation
|--------------------------------------------------------------------------
*/

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid leave id")

];

/*
|--------------------------------------------------------------------------
| Create Leave
|--------------------------------------------------------------------------
*/

export const createLeaveValidation = [

    body("type")
        .isIn(leaveTypes)
        .withMessage("Invalid leave type"),

    body("startDate")
        .isISO8601()
        .withMessage("Invalid start date"),

    body("endDate")
        .isISO8601()
        .withMessage("Invalid end date"),

    body("reason")
        .optional()
        .trim()
        .isLength({
            max: 500
        })
        .withMessage(
            "Reason cannot exceed 500 characters"
        )

];

/*
|--------------------------------------------------------------------------
| Reject Leave
|--------------------------------------------------------------------------
*/

export const rejectLeaveValidation = [

    body("reason")
        .trim()
        .notEmpty()
        .withMessage(
            "Rejection reason is required"
        )
        .isLength({
            max: 500
        })
        .withMessage(
            "Rejection reason cannot exceed 500 characters"
        )

];

/*
|--------------------------------------------------------------------------
| Get Leaves
|--------------------------------------------------------------------------
*/

export const getLeavesValidation = [

    query("page")
        .optional()
        .isInt({
            min: 1
        })
        .withMessage(
            "Page must be greater than 0"
        ),

    query("limit")
        .optional()
        .isInt({
            min: 1,
            max: 100
        })
        .withMessage(
            "Limit must be between 1 and 100"
        ),

    query("employee")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid employee id"
        ),

    query("type")
        .optional()
        .isIn(leaveTypes)
        .withMessage(
            "Invalid leave type"
        ),

    query("status")
        .optional()
        .isIn(leaveStatuses)
        .withMessage(
            "Invalid leave status"
        ),

    query("from")
        .optional()
        .isISO8601()
        .withMessage(
            "Invalid from date"
        ),

    query("to")
        .optional()
        .isISO8601()
        .withMessage(
            "Invalid to date"
        )

];
export const createAdminLeaveValidation = [

    body("employee")
        .isMongoId()
        .withMessage("Invalid employee id"),

    body("type")
        .isIn(leaveTypes)
        .withMessage("Invalid leave type"),

    body("startDate")
        .isISO8601()
        .withMessage("Invalid start date"),

    body("endDate")
        .isISO8601()
        .withMessage("Invalid end date"),

    body("reason")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Reason cannot exceed 500 characters"
        )

];