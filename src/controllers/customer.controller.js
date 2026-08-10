import asyncHandler
    from "../utils/asyncHandler.js";

import customerService
    from "../services/customer.service.js";

import * as response
    from "../utils/apiResponse.js";

export const createCustomer = asyncHandler(
    async (req, res) => {

        const customer =
            await customerService.createCustomer(
                req.body,
                req.user._id
            );

        response.success(
            res,
            customer,
            "Customer created successfully",
            201
        );

    }
);

export const getCustomers = asyncHandler(
    async (req, res) => {

        const result =
            await customerService.getCustomers(
                req.query
            );

        response.paginated(
            res,
            result.data,
            result.pagination
        );

    }
);

export const getCustomerById = asyncHandler(
    async (req, res) => {

        const customer =
            await customerService.getCustomerById(
                req.params.id
            );

        response.success(
            res,
            customer
        );

    }
);

export const updateCustomer = asyncHandler(
    async (req, res) => {

        const customer =
            await customerService.updateCustomer(
                req.params.id,
                req.body,
                req.user._id
            );

        response.success(
            res,
            customer,
            "Customer updated successfully"
        );

    }
);

export const deleteCustomer = asyncHandler(
    async (req, res) => {

        await customerService.deleteCustomer(
            req.params.id,
            req.user._id
        );

        response.success(
            res,
            null,
            "Customer deleted successfully"
        );

    }
);

export const restoreCustomer = asyncHandler(
    async (req, res) => {

        const customer =
            await customerService.restoreCustomer(
                req.params.id,
                req.user._id
            );

        response.success(
            res,
            customer,
            "Customer restored successfully"
        );

    }
);