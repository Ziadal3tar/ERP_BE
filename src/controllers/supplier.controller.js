import asyncHandler from "../utils/asyncHandler.js";

import supplierService
    from "../services/supplier.service.js";

import * as response
    from "../utils/apiResponse.js";

export const createSupplier = asyncHandler(
    async (req, res) => {

        const supplier =
            await supplierService.createSupplier(
                req.body,
                req.user._id
            );

        response.success(
            res,
            supplier,
            "Supplier created successfully",
            201
        );

    }
);

export const getSuppliers = asyncHandler(
    async (req, res) => {

        const result =
            await supplierService.getSuppliers(
                req.query
            );

        response.paginated(
            res,
            result.data,
            result.pagination
        );

    }
);

export const getSupplierById = asyncHandler(
    async (req, res) => {

        const supplier =
            await supplierService.getSupplierById(
                req.params.id
            );

        response.success(
            res,
            supplier
        );

    }
);

export const updateSupplier = asyncHandler(
    async (req, res) => {

        const supplier =
            await supplierService.updateSupplier(
                req.params.id,
                req.body,
                req.user._id
            );

        response.success(
            res,
            supplier,
            "Supplier updated successfully"
        );

    }
);

export const deleteSupplier = asyncHandler(
    async (req, res) => {

        await supplierService.deleteSupplier(
            req.params.id,
            req.user._id
        );

        response.success(
            res,
            null,
            "Supplier deleted successfully"
        );

    }
);

export const restoreSupplier = asyncHandler(
    async (req, res) => {

        const supplier =
            await supplierService.restoreSupplier(
                req.params.id,
                req.user._id
            );

        response.success(
            res,
            supplier,
            "Supplier restored successfully"
        );

    }
);