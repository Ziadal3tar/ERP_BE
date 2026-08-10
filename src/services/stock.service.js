import mongoose from "mongoose";

import stockRepository
    from "../repositories/stock.repository.js";

import stockTransactionRepository
    from "../repositories/stockTransaction.repository.js";

import productRepository
    from "../repositories/product.repository.js";

import warehouseRepository
    from "../repositories/warehouse.repository.js";

import AppError from "../utils/AppError.js";

class StockService {



    async validateProduct(productId) {

        const product =
            await productRepository.findById(
                productId
            );

        if (!product) {

            throw new AppError(
                "Product not found",
                404
            );

        }

        if (!product.isActive) {

            throw new AppError(
                "Product is inactive",
                400
            );

        }

        return product;

    }

    async validateWarehouse(warehouseId) {

        const warehouse =
            await warehouseRepository.findById(
                warehouseId
            );

        if (!warehouse) {

            throw new AppError(
                "Warehouse not found",
                404
            );

        }

        if (!warehouse.isActive) {

            throw new AppError(
                "Warehouse is inactive",
                400
            );

        }

        return warehouse;

    }

    async stockIn(data, userId) {

        await this.validateProduct(
            data.product
        );

        await this.validateWarehouse(
            data.warehouse
        );

        let stock =
            await stockRepository.findOne({

                product: data.product,

                warehouse: data.warehouse

            });

        if (!stock) {

            stock =
                await stockRepository.create({

                    product: data.product,

                    warehouse: data.warehouse,

                    quantity: 0,

                    createdBy: userId

                });

        }

        stock.quantity += Number(
            data.quantity
        );

        stock.updatedBy = userId;

        await stockRepository.save(stock);

        const transaction =
            await stockTransactionRepository.create({

                product: data.product,

                warehouse: data.warehouse,

                type: "IN",

                quantity: data.quantity,

                reference:
                    data.reference || null,

                notes:
                    data.notes || null,

                createdBy: userId

            });

        return {

            stock,

            transaction

        };

    }

    async stockOut(data, userId) {

        await this.validateProduct(
            data.product
        );

        await this.validateWarehouse(
            data.warehouse
        );

        const stock =
            await stockRepository.findOne({

                product: data.product,

                warehouse: data.warehouse

            });

        if (!stock) {

            throw new AppError(

                "No stock found for this product in this warehouse",

                404

            );

        }

        const quantity =
            Number(data.quantity);

        if (stock.quantity < quantity) {

            throw new AppError(

                "Insufficient stock",

                400

            );

        }

        stock.quantity -= quantity;

        stock.updatedBy = userId;

        await stockRepository.save(stock);

        const transaction =
            await stockTransactionRepository.create({

                product: data.product,

                warehouse: data.warehouse,

                type: "OUT",

                quantity,

                reference:
                    data.reference || null,

                notes:
                    data.notes || null,

                createdBy: userId

            });

        return {

            stock,

            transaction

        };

    }

    async transferStock(data, userId) {

        const {

            product,

            fromWarehouse,

            toWarehouse,

            quantity,

            reference,
            notes

        } = data;

        if (
            fromWarehouse ===
            toWarehouse
        ) {

            throw new AppError(

                "Source and destination warehouses must be different",

                400

            );

        }

        await this.validateProduct(product);

        await this.validateWarehouse(
            fromWarehouse
        );

        await this.validateWarehouse(
            toWarehouse
        );

        const amount =
            Number(quantity);

        const session =
            await mongoose.startSession();

        try {

            session.startTransaction();

            const sourceStock =
                await stockRepository.findOne(

                    {
                        product,

                        warehouse:
                            fromWarehouse

                    },

                    {
                        session
                    }

                );

            if (!sourceStock) {

                throw new AppError(

                    "No stock found in source warehouse",

                    404

                );

            }

            if (
                sourceStock.quantity <
                amount
            ) {

                throw new AppError(

                    "Insufficient stock in source warehouse",

                    400

                );

            }

            let destinationStock =
                await stockRepository.findOne(

                    {
                        product,

                        warehouse:
                            toWarehouse

                    },

                    {
                        session
                    }

                );

            if (!destinationStock) {

                destinationStock =
                    await stockRepository.create(

                        {

                            product,

                            warehouse:
                                toWarehouse,

                            quantity: 0,

                            createdBy: userId

                        },

                        {
                            session
                        }

                    );

            }

            sourceStock.quantity -= amount;

            destinationStock.quantity += amount;

            sourceStock.updatedBy = userId;

            destinationStock.updatedBy = userId;

            await stockRepository.save(

                sourceStock,

                {
                    session
                }

            );

            await stockRepository.save(

                destinationStock,

                {
                    session
                }

            );

            const transferOut =
                await stockTransactionRepository.create(

                    {

                        product,

                        warehouse:
                            fromWarehouse,

                        type:
                            "TRANSFER_OUT",

                        quantity: amount,

                        reference:
                            reference || null,

                        notes:
                            notes || null,

                        createdBy:
                            userId

                    },

                    {
                        session
                    }

                );

            const transferIn =
                await stockTransactionRepository.create(

                    {

                        product,

                        warehouse:
                            toWarehouse,

                        type:
                            "TRANSFER_IN",

                        quantity: amount,

                        reference:
                            reference || null,

                        notes:
                            notes || null,

                        createdBy:
                            userId

                    },

                    {
                        session
                    }

                );

            await session.commitTransaction();

            return {

                from: sourceStock,

                to: destinationStock,

                transactions: [

                    transferOut,

                    transferIn

                ]

            };

        } catch (error) {

            await session.abortTransaction();

            throw error;

        } finally {

            await session.endSession();

        }

    }

    async getStock(query = {}) {

        const page =
            Number(query.page) || 1;

        const limit =
            Number(query.limit) || 10;

        const skip =
            (page - 1) * limit;

        const filter = {};

        if (query.product) {

            filter.product =
                query.product;

        }

        if (query.warehouse) {

            filter.warehouse =
                query.warehouse;

        }

        const total =
            await stockRepository.count(
                filter
            );

        const data =
            await stockRepository.find(

                filter,

                {

                    skip,

                    limit,

                    sort: {
                        updatedAt: -1
                    },

                    populate: [

                        {
                            path: "product",

                            select:
                                "name sku barcode unit minStock"

                        },

                        {
                            path: "warehouse",

                            select:
                                "name code"

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
                    Math.ceil(
                        total / limit
                    )

            }

        };

    }


    async getStockHistory(query = {}) {

        const page =
            Number(query.page) || 1;

        const limit =
            Number(query.limit) || 20;

        const skip =
            (page - 1) * limit;

        const filter = {};

        if (query.product) {

            filter.product =
                query.product;

        }

        if (query.warehouse) {

            filter.warehouse =
                query.warehouse;

        }

        if (query.type) {

            filter.type =
                query.type;

        }

        const total =
            await stockTransactionRepository.count(
                filter
            );

        const data =
            await stockTransactionRepository.find(

                filter,

                {

                    skip,

                    limit,

                    sort: {
                        createdAt: -1
                    },

                    populate: [

                        {
                            path: "product",

                            select:
                                "name sku"

                        },

                        {
                            path: "warehouse",

                            select:
                                "name code"

                        },

                        {
                            path: "createdBy",

                            select:
                                "name email"

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
                    Math.ceil(
                        total / limit
                    )

            }

        };

    }

}

export default new StockService();