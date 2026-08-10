import asyncHandler
    from "../utils/asyncHandler.js";

import invoiceService
    from "../services/invoice.service.js";

import * as response
    from "../utils/apiResponse.js";

export const createInvoiceFromSale =
    asyncHandler(
        async (req, res) => {

            const invoice =
                await invoiceService.createFromSale(

                    req.params.saleId,

                    req.user._id

                );

            response.success(

                res,

                invoice,

                "Invoice created successfully",

                201

            );

        }
    );

export const getInvoices =
    asyncHandler(
        async (req, res) => {

            const result =
                await invoiceService.getInvoices(
                    req.query
                );

            response.paginated(

                res,

                result.data,

                result.pagination

            );

        }
    );

export const getInvoiceById =
    asyncHandler(
        async (req, res) => {

            const invoice =
                await invoiceService.getInvoiceById(

                    req.params.id

                );

            response.success(
                res,
                invoice
            );

        }
    );

export const cancelInvoice =
    asyncHandler(
        async (req, res) => {

            const invoice =
                await invoiceService.cancelInvoice(

                    req.params.id,

                    req.user._id

                );

            response.success(

                res,

                invoice,

                "Invoice cancelled successfully"

            );

        }
    );