import { param, query } from "express-validator";

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid notification id"
        )

];

export const getNotificationsValidation = [

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

    query("isRead")
        .optional()
        .isBoolean()
        .withMessage(
            "isRead must be boolean"
        )

];