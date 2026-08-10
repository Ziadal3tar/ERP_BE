import warehouseRepository from "../repositories/warehouse.repository.js";
import AppError from "../utils/AppError.js";

class WarehouseService {

    async createWarehouse(data, userId) {

        const code = data.code.toUpperCase();

        const existing =
            await warehouseRepository.findOne({ code });

        if (existing) {

            throw new AppError(
                "Warehouse code already exists",
                400
            );

        }

        return await warehouseRepository.create({

            ...data,

            code,

            createdBy: userId

        });

    }

    async getWarehouses(query = {}) {

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
                }

            ];

        }

        if (query.isActive !== undefined) {

            filter.isActive =
                query.isActive === "true";

        }

        const total =
            await warehouseRepository.count(filter);

        const data =
            await warehouseRepository.find(

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

    async getWarehouseById(id) {

        const warehouse =
            await warehouseRepository.findOne(

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

        if (!warehouse) {

            throw new AppError(
                "Warehouse not found",
                404
            );

        }

        return warehouse;

    }

    async updateWarehouse(id, data, userId) {

        const warehouse =
            await warehouseRepository.findById(id);

        if (!warehouse) {

            throw new AppError(
                "Warehouse not found",
                404
            );

        }

        if (data.code) {

            const code =
                data.code.toUpperCase();

            const existing =
                await warehouseRepository.findOne({
                    code
                });

            if (
                existing &&
                existing._id.toString() !== id
            ) {

                throw new AppError(
                    "Warehouse code already exists",
                    400
                );

            }

            warehouse.code = code;

        }

        const allowedFields = [

            "name",
            "location",
            "description"

        ];

        allowedFields.forEach(field => {

            if (data[field] !== undefined) {

                warehouse[field] =
                    data[field];

            }

        });

        warehouse.updatedBy = userId;

        return await warehouseRepository.save(
            warehouse
        );

    }

    async deleteWarehouse(id, userId) {

        const warehouse =
            await warehouseRepository.findById(id);

        if (!warehouse) {

            throw new AppError(
                "Warehouse not found",
                404
            );

        }

        if (!warehouse.isActive) {

            throw new AppError(
                "Warehouse is already inactive",
                400
            );

        }

        warehouse.isActive = false;

        warehouse.updatedBy = userId;

        return await warehouseRepository.save(
            warehouse
        );

    }

    async restoreWarehouse(id, userId) {

        const warehouse =
            await warehouseRepository.findById(id);

        if (!warehouse) {

            throw new AppError(
                "Warehouse not found",
                404
            );

        }

        if (warehouse.isActive) {

            throw new AppError(
                "Warehouse is already active",
                400
            );

        }

        warehouse.isActive = true;

        warehouse.updatedBy = userId;

        return await warehouseRepository.save(
            warehouse
        );

    }

}

export default new WarehouseService();