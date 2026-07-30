import { body, param, query } from "express-validator";

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid department id")

];

export const getDepartmentsValidation = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than 0"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),

    query("search")
        .optional()
        .trim(),

    query("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be boolean")

];

export const createDepartmentValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Department name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Department name must be between 2 and 100 characters"),

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Department code is required")
        .isLength({ min: 2, max: 10 })
        .withMessage("Department code must be between 2 and 10 characters")
        .matches(/^[A-Za-z0-9_-]+$/)
        .withMessage("Department code contains invalid characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    body("manager")
        .optional()
        .isMongoId()
        .withMessage("Invalid manager id")

];

export const updateDepartmentValidation = [

    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Department name must be between 2 and 100 characters"),

    body("code")
        .optional()
        .trim()
        .isLength({ min: 2, max: 10 })
        .withMessage("Department code must be between 2 and 10 characters")
        .matches(/^[A-Za-z0-9_-]+$/)
        .withMessage("Department code contains invalid characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    body("manager")
        .optional()
        .isMongoId()
        .withMessage("Invalid manager id"),

    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be boolean")

];

export const changeManagerValidation = [

    body("manager")
        .notEmpty()
        .withMessage("Manager is required")
        .isMongoId()
        .withMessage("Invalid manager id")

];