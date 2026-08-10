import asyncHandler
    from "../utils/asyncHandler.js";

import saleService
    from "../services/sale.service.js";

import * as response
    from "../utils/apiResponse.js";

export const createSale = asyncHandler(
    async (req, res) => {

        const sale =
            await saleService.createSale(
                req.body,
                req.user._id
            );

        response.success(
            res,
            sale,
            "Sale created successfully",
            201
        );

    }
);

export const getSales = asyncHandler(
    async (req, res) => {

        const result =
            await saleService.getSales(
                req.query
            );

        response.paginated(
            res,
            result.data,
            result.pagination
        );

    }
);

export const getSaleById = asyncHandler(
    async (req, res) => {

        const sale =
            await saleService.getSaleById(
                req.params.id
            );

        response.success(
            res,
            sale
        );

    }
);

export const confirmSale = asyncHandler(
    async (req, res) => {

        const sale =
            await saleService.confirmSale(
                req.params.id,
                req.user._id
            );

        response.success(
            res,
            sale,
            "Sale confirmed successfully"
        );

    }
);

export const cancelSale = asyncHandler(
    async (req, res) => {

        const sale =
            await saleService.cancelSale(
                req.params.id,
                req.user._id
            );

        response.success(
            res,
            sale,
            "Sale cancelled successfully"
        );

    }
);