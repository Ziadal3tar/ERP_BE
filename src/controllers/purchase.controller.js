import asyncHandler from "../utils/asyncHandler.js";

import purchaseService
    from "../services/purchase.service.js";

import * as response
    from "../utils/apiResponse.js";



export const createPurchase = asyncHandler(
    async (req, res) => {

        const purchase =
            await purchaseService.createPurchase(

                req.body,

                req.user._id

            );

        response.success(

            res,

            purchase,

            "Purchase created successfully",

            201

        );

    }
);

export const getPurchases = asyncHandler(
    async (req, res) => {

        const result =
            await purchaseService.getPurchases(

                req.query

            );

        response.paginated(

            res,

            result.data,

            result.pagination

        );

    }
);

export const getPurchaseById = asyncHandler(
    async (req, res) => {

        const purchase =
            await purchaseService.getPurchaseById(

                req.params.id

            );

        response.success(

            res,

            purchase

        );

    }
);

export const confirmPurchase = asyncHandler(
    async (req, res) => {

        const purchase =
            await purchaseService.confirmPurchase(

                req.params.id,

                req.user._id

            );

        response.success(

            res,

            purchase,

            "Purchase confirmed successfully"

        );

    }
);

export const receivePurchase = asyncHandler(
    async (req, res) => {

        const purchase =
            await purchaseService.receivePurchase(

                req.params.id,

                req.user._id

            );

        response.success(

            res,

            purchase,

            "Purchase received successfully"

        );

    }
);

export const cancelPurchase = asyncHandler(
    async (req, res) => {

        const purchase =
            await purchaseService.cancelPurchase(

                req.params.id,

                req.user._id

            );

        response.success(

            res,

            purchase,

            "Purchase cancelled successfully"

        );

    }
);