import { body, param, query } from "express-validator";

const employmentTypes = [

    "Full Time",

    "Part Time",

    "Contract",

    "Intern"

];

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid employee id")

];

export const createEmployeeValidation = [

    body("user")
        .isMongoId(),

    body("department")
        .isMongoId(),

    body("manager")
        .optional()
        .isMongoId(),

    body("jobTitle")
        .trim()
        .notEmpty(),

    body("employmentType")
        .optional()
        .isIn(employmentTypes),

    body("hireDate")
        .isISO8601(),

    body("salary")
        .optional()
        .isFloat({ min: 0 })

];

export const updateEmployeeValidation = [

    body("department")
        .optional()
        .isMongoId(),

    body("manager")
        .optional()
        .isMongoId(),

    body("jobTitle")
        .optional()
        .trim(),

    body("employmentType")
        .optional()
        .isIn(employmentTypes),

    body("hireDate")
        .optional()
        .isISO8601(),

    body("salary")
        .optional()
        .isFloat({ min: 0 }),

    body("isActive")
        .optional()
        .isBoolean()

];

export const getEmployeesValidation = [

    query("page")
        .optional()
        .isInt({ min: 1 }),

    query("limit")
        .optional()
        .isInt({ min: 1 }),

    query("department")
        .optional()
        .isMongoId(),

    query("isActive")
        .optional()
        .isBoolean()

];

export const changeDepartmentValidation = [

    body("department")
        .isMongoId()
        .withMessage("Invalid department id")

];

export const changeSalaryValidation = [

    body("salary")
        .isFloat({
            min: 0
        })
        .withMessage(
            "Salary must be greater than or equal to zero"
        )

];