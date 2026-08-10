import supplierRepository
    from "../repositories/supplier.repository.js";

import AppError from "../utils/AppError.js";

class SupplierService {

    async createSupplier(data, userId) {

        const code =
            data.code.toUpperCase();

        const existing =
            await supplierRepository.findOne({
                code
            });

        if (existing) {

            throw new AppError(
                "Supplier code already exists",
                400
            );

        }

        return await supplierRepository.create({

            ...data,

            code,

            createdBy: userId

        });

    }

    async getSuppliers(query = {}) {

        const page =
            Number(query.page) || 1;

        const limit =
            Number(query.limit) || 10;

        const skip =
            (page - 1) * limit;

        const filter = {};

        if (query.search) {

            filter.$or = [

                {
                    name: {
                        $regex: query.search,
                        $options: "i"
                    }
                },

                {
                    code: {
                        $regex: query.search,
                        $options: "i"
                    }
                },

                {
                    phone: {
                        $regex: query.search,
                        $options: "i"
                    }
                }

            ];

        }

        if (query.isActive !== undefined) {

            filter.isActive =
                query.isActive === "true";

        }

        const total =
            await supplierRepository.count(filter);

        const data =
            await supplierRepository.find(
                filter,
                {
                    skip,
                    limit,
                    sort: {
                        name: 1
                    },

                    populate: [

                        {
                            path: "createdBy",
                            select: "name email"
                        },

                        {
                            path: "updatedBy",
                            select: "name email"
                        }

                    ]

                }
            );

        return {

            data,

            pagination: {

                total,
                page,
                limit,

                totalPages:
                    Math.ceil(total / limit)

            }

        };

    }

    async getSupplierById(id) {

        const supplier =
            await supplierRepository.findOne(
                { _id: id },
                {
                    populate: [

                        {
                            path: "createdBy",
                            select: "name email"
                        },

                        {
                            path: "updatedBy",
                            select: "name email"
                        }

                    ]
                }
            );

        if (!supplier) {

            throw new AppError(
                "Supplier not found",
                404
            );

        }

        return supplier;

    }

    async updateSupplier(id, data, userId) {

        const supplier =
            await supplierRepository.findById(id);

        if (!supplier) {

            throw new AppError(
                "Supplier not found",
                404
            );

        }

        if (data.code) {

            const code =
                data.code.toUpperCase();

            const existing =
                await supplierRepository.findOne({
                    code
                });

            if (
                existing &&
                existing._id.toString() !== id
            ) {

                throw new AppError(
                    "Supplier code already exists",
                    400
                );

            }

            supplier.code = code;

        }

        const allowedFields = [

            "name",
            "email",
            "phone",
            "address",
            "taxNumber",
            "notes"

        ];

        allowedFields.forEach(field => {

            if (data[field] !== undefined) {

                supplier[field] =
                    data[field];

            }

        });

        supplier.updatedBy = userId;

        return await supplierRepository.save(
            supplier
        );

    }

    async deleteSupplier(id, userId) {

        const supplier =
            await supplierRepository.findById(id);

        if (!supplier) {

            throw new AppError(
                "Supplier not found",
                404
            );

        }

        if (!supplier.isActive) {

            throw new AppError(
                "Supplier is already inactive",
                400
            );

        }

        supplier.isActive = false;

        supplier.updatedBy = userId;

        return await supplierRepository.save(
            supplier
        );

    }

    async restoreSupplier(id, userId) {

        const supplier =
            await supplierRepository.findById(id);

        if (!supplier) {

            throw new AppError(
                "Supplier not found",
                404
            );

        }

        if (supplier.isActive) {

            throw new AppError(
                "Supplier is already active",
                400
            );

        }

        supplier.isActive = true;

        supplier.updatedBy = userId;

        return await supplierRepository.save(
            supplier
        );

    }

}

export default new SupplierService();