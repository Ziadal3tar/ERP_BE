import asyncHandler from "../utils/asyncHandler.js";

import productService from "../services/product.service.js";

import * as response from "../utils/apiResponse.js";

export const createProduct = asyncHandler(
    async (req, res) => {

        const product =
            await productService.createProduct(

                req.body,

                req.user._id

            );

        response.success(

            res,

            product,

            "Product created successfully",

            201

        );

    }
);

export const getProducts = asyncHandler(
    async (req, res) => {

        const result =
            await productService.getProducts(

                req.query

            );

        response.paginated(

            res,

            result.data,

            result.pagination

        );

    }
);

export const getProductById = asyncHandler(
    async (req, res) => {

        const product =
            await productService.getProductById(

                req.params.id

            );

        response.success(

            res,

            product

        );

    }
);

export const updateProduct = asyncHandler(
    async (req, res) => {

        const product =
            await productService.updateProduct(

                req.params.id,

                req.body,

                req.user._id

            );

        response.success(

            res,

            product,

            "Product updated successfully"

        );

    }
);

export const deleteProduct = asyncHandler(
    async (req, res) => {

        const product =await productService.deleteProduct(

            req.params.id,

            req.user._id

        );

        response.success(

            res,

            product,

            "Product deleted successfully"

        );

    }
);

export const restoreProduct = asyncHandler(
    async (req, res) => {

        const product =
            await productService.restoreProduct(

                req.params.id,

                req.user._id

            );

        response.success(

            res,

            product,

            "Product restored successfully"

        );

    }
);