import { body, param, query } from "express-validator";

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid category id")

];

export const createCategoryValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ max: 100 })
        .withMessage(
            "Category name cannot exceed 100 characters"
        ),

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Category code is required")
        .isLength({ max: 30 })
        .withMessage(
            "Category code cannot exceed 30 characters"
        )
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage(
            "Category code can only contain letters, numbers, _ and -"
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Description cannot exceed 500 characters"
        ),

    body("parent")
        .optional({ nullable: true })
        .isMongoId()
        .withMessage("Invalid parent category id")

];

export const updateCategoryValidation = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category name cannot be empty")
        .isLength({ max: 100 })
        .withMessage(
            "Category name cannot exceed 100 characters"
        ),

    body("code")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category code cannot be empty")
        .isLength({ max: 30 })
        .withMessage(
            "Category code cannot exceed 30 characters"
        )
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage(
            "Category code can only contain letters, numbers, _ and -"
        ),

    body("description")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Description cannot exceed 500 characters"
        ),

    body("parent")
        .optional({ nullable: true })
        .isMongoId()
        .withMessage("Invalid parent category id")

];

export const getCategoriesValidation = [

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

    query("parent")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid parent category id"
        ),

    query("isActive")
        .optional()
        .isBoolean()
        .withMessage(
            "isActive must be boolean"
        )

];