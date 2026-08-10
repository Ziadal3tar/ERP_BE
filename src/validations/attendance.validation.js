import { body, param, query } from "express-validator";

const attendanceStatuses = [
    "Present",
    "Absent",
    "Late",
    "Leave"
];

/*
|--------------------------------------------------------------------------
| ID Validation
|--------------------------------------------------------------------------
*/

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid attendance id")

];


/*
|--------------------------------------------------------------------------
| Check In Validation
|--------------------------------------------------------------------------
|
| Employee:
| لا يرسل employeeId، لأننا سنعرف الموظف من req.user
|
| Admin / HR:
| يمكنه تحديد employeeId
|
*/

export const checkInValidation = [

    body("employee")
        .optional()
        .isMongoId()
        .withMessage("Invalid employee id"),

    body("notes")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes cannot exceed 500 characters"
        )

];


/*
|--------------------------------------------------------------------------
| Check Out Validation
|--------------------------------------------------------------------------
*/

export const checkOutValidation = [

    body("notes")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes cannot exceed 500 characters"
        )

];


/*
|--------------------------------------------------------------------------
| Create Attendance
|--------------------------------------------------------------------------
|
| خاص بالـ Admin / HR
|
*/

export const createAttendanceValidation = [

    body("employee")
        .isMongoId()
        .withMessage("Invalid employee id"),

    body("date")
        .isISO8601()
        .withMessage("Invalid attendance date"),

    body("checkIn")
        .optional()
        .isISO8601()
        .withMessage("Invalid check-in time"),

    body("checkOut")
        .optional()
        .isISO8601()
        .withMessage("Invalid check-out time"),

    body("status")
        .optional()
        .isIn(attendanceStatuses)
        .withMessage("Invalid attendance status"),

    body("notes")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes cannot exceed 500 characters"
        )

];


/*
|--------------------------------------------------------------------------
| Update Attendance
|--------------------------------------------------------------------------
|
| Admin / HR
|
*/

export const updateAttendanceValidation = [

    body("date")
        .optional()
        .isISO8601()
        .withMessage("Invalid attendance date"),

    body("checkIn")
        .optional()
        .isISO8601()
        .withMessage("Invalid check-in time"),

    body("checkOut")
        .optional()
        .isISO8601()
        .withMessage("Invalid check-out time"),

    body("status")
        .optional()
        .isIn(attendanceStatuses)
        .withMessage("Invalid attendance status"),

    body("notes")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes cannot exceed 500 characters"
        )

];


/*
|--------------------------------------------------------------------------
| Get Attendance Validation
|--------------------------------------------------------------------------
*/

export const getAttendanceValidation = [

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

    query("employee")
        .optional()
        .isMongoId()
        .withMessage("Invalid employee id"),

    query("department")
        .optional()
        .isMongoId()
        .withMessage("Invalid department id"),

    query("status")
        .optional()
        .isIn(attendanceStatuses)
        .withMessage("Invalid attendance status"),

    query("date")
        .optional()
        .isISO8601()
        .withMessage("Invalid date"),

    query("from")
        .optional()
        .isISO8601()
        .withMessage("Invalid from date"),

    query("to")
        .optional()
        .isISO8601()
        .withMessage("Invalid to date"),

    query("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be boolean")

];