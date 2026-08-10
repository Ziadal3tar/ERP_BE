import asyncHandler from "../utils/asyncHandler.js";

import categoryService from "../services/category.service.js";

import * as response from "../utils/apiResponse.js";

export const createCategory = asyncHandler(
    async (req, res) => {

        const category =
            await categoryService.createCategory(

                req.body,

                req.user._id

            );

        response.success(

            res,

            category,

            "Category created successfully",

            201

        );

    }
);

export const getCategories = asyncHandler(
    async (req, res) => {

        const result =
            await categoryService.getCategories(

                req.query

            );

        response.paginated(

            res,

            result.data,

            result.pagination

        );

    }
);

export const getCategoryById = asyncHandler(
    async (req, res) => {

        const category =
            await categoryService.getCategoryById(

                req.params.id

            );

        response.success(

            res,

            category

        );

    }
);

export const updateCategory = asyncHandler(
    async (req, res) => {

        const category =
            await categoryService.updateCategory(

                req.params.id,

                req.body,

                req.user._id

            );

        response.success(

            res,

            category,

            "Category updated successfully"

        );

    }
);

export const deleteCategory = asyncHandler(
    async (req, res) => {

        await categoryService.deleteCategory(

            req.params.id,

            req.user._id

        );

        response.success(

            res,

            null,

            "Category deleted successfully"

        );

    }
);

export const restoreCategory = asyncHandler(
    async (req, res) => {

        const category =
            await categoryService.restoreCategory(

                req.params.id,

                req.user._id

            );

        response.success(

            res,

            category,

            "Category restored successfully"

        );

    }
);