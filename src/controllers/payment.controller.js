import asyncHandler
    from "../utils/asyncHandler.js";

import paymentService
    from "../services/payment.service.js";

import *as response
    from "../utils/apiResponse.js";

export const createPayment =
    asyncHandler(
        async (req, res) => {

            const result =
                await paymentService.createPayment(

                    req.params.invoiceId,

                    req.body,

                    req.user._id

                );

            response.success(

                res,

                result,

                "Payment created successfully",

                201

            );

        }
    );

export const getPayments =
    asyncHandler(
        async (req, res) => {

            const result =
                await paymentService.getPayments(
                    req.query
                );

            response.paginated(

                res,

                result.data,

                result.pagination

            );

        }
    );

export const getPaymentById =
    asyncHandler(
        async (req, res) => {

            const payment =
                await paymentService.getPaymentById(

                    req.params.id

                );

            response.success(

                res,

                payment

            );

        }
    );