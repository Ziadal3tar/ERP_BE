import { body, param, query } from "express-validator";

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid warehouse id")

];

export const createWarehouseValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Warehouse name is required")
        .isLength({ max: 100 })
        .withMessage(
            "Warehouse name cannot exceed 100 characters"
        ),

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Warehouse code is required")
        .isLength({ max: 30 })
        .withMessage(
            "Warehouse code cannot exceed 30 characters"
        )
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage(
            "Warehouse code can only contain letters, numbers, _ and -"
        ),

    body("location")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 200 })
        .withMessage(
            "Location cannot exceed 200 characters"
        ),

    body("description")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Description cannot exceed 500 characters"
        )

];

export const updateWarehouseValidation = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
            "Warehouse name cannot be empty"
        )
        .isLength({ max: 100 })
        .withMessage(
            "Warehouse name cannot exceed 100 characters"
        ),

    body("code")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
            "Warehouse code cannot be empty"
        )
        .isLength({ max: 30 })
        .withMessage(
            "Warehouse code cannot exceed 30 characters"
        )
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage(
            "Invalid warehouse code"
        ),

    body("location")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 200 })
        .withMessage(
            "Location cannot exceed 200 characters"
        ),

    body("description")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Description cannot exceed 500 characters"
        )

];

export const getWarehousesValidation = [

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

    query("search")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Search cannot exceed 100 characters"
        ),

    query("isActive")
        .optional()
        .isBoolean()
        .withMessage(
            "isActive must be boolean"
        )

];