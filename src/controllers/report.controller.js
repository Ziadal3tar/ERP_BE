import asyncHandler
    from "../utils/asyncHandler.js";

import reportService
    from "../services/report.service.js";

import * as response
    from "../utils/apiResponse.js";

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const getDashboardSummary =
    asyncHandler(
        async (req, res) => {

            const result =
                await reportService
                    .getDashboardSummary();

            response.success(
                res,
                result
            );

        }
    );

/*
|--------------------------------------------------------------------------
| Sales Report
|--------------------------------------------------------------------------
*/

export const getSalesReport =
    asyncHandler(
        async (req, res) => {

            const result =
                await reportService
                    .getSalesReport(
                        req.query
                    );

            response.success(
                res,
                result
            );

        }
    );

/*
|--------------------------------------------------------------------------
| Purchases Report
|--------------------------------------------------------------------------
*/

export const getPurchasesReport =
    asyncHandler(
        async (req, res) => {

            const result =
                await reportService
                    .getPurchasesReport(
                        req.query
                    );

            response.success(
                res,
                result
            );

        }
    );

/*
|--------------------------------------------------------------------------
| Stock Report
|--------------------------------------------------------------------------
*/

export const getStockReport =
    asyncHandler(
        async (req, res) => {

            const result =
                await reportService
                    .getStockReport();

            response.success(
                res,
                result
            );

        }
    );

/*
|--------------------------------------------------------------------------
| Low Stock
|--------------------------------------------------------------------------
*/

export const getLowStock =
    asyncHandler(
        async (req, res) => {

            const result =
                await reportService
                    .getLowStock();

            response.success(
                res,
                result
            );

        }
    );