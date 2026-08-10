import purchaseRepository
    from "../repositories/purchase.repository.js";

import supplierRepository
    from "../repositories/supplier.repository.js";

import warehouseRepository
    from "../repositories/warehouse.repository.js";

import productRepository
    from "../repositories/product.repository.js";

import stockRepository
    from "../repositories/stock.repository.js";

import stockTransactionRepository
    from "../repositories/stockTransaction.repository.js";

import AppError
    from "../utils/AppError.js";

import mongoose from "mongoose";

class PurchaseService {

    async validateSupplier(id) {

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
                "Supplier is inactive",
                400
            );

        }

        return supplier;

    }

    async validateWarehouse(id) {

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
                "Warehouse is inactive",
                400
            );

        }

        return warehouse;

    }

    async validateItems(items) {

        const productIds =
            items.map(item =>
                item.product.toString()
            );

        const uniqueIds =
            [...new Set(productIds)];

        if (
            productIds.length !==
            uniqueIds.length
        ) {

            throw new AppError(

                "A product cannot appear more than once in the purchase",

                400

            );

        }

        const products = [];

        for (const id of uniqueIds) {

            const product =
                await productRepository.findById(id);

            if (!product) {

                throw new AppError(
                    `Product ${id} not found`,
                    404
                );

            }

            if (!product.isActive) {

                throw new AppError(
                    `Product ${product.name} is inactive`,
                    400
                );

            }

            products.push(product);

        }

        return products;

    }

    calculateTotals(
        items,
        discount = 0,
        tax = 0
    ) {

        const processedItems =
            items.map(item => {

                const quantity =
                    Number(item.quantity);

                const unitPrice =
                    Number(item.unitPrice);

                const total =
                    quantity * unitPrice;

                return {

                    product: item.product,

                    quantity,

                    unitPrice,

                    total

                };

            });

        const subtotal =
            processedItems.reduce(

                (sum, item) =>
                    sum + item.total,

                0

            );

        const total =
            subtotal -
            Number(discount) +
            Number(tax);

        if (total < 0) {

            throw new AppError(

                "Purchase total cannot be negative",

                400

            );

        }

        return {

            items: processedItems,

            subtotal,

            discount:
                Number(discount),

            tax:
                Number(tax),

            total

        };

    }

    async createPurchase(data, userId) {

        await this.validateSupplier(
            data.supplier
        );

        await this.validateWarehouse(
            data.warehouse
        );

        await this.validateItems(
            data.items
        );

        const totals =
            this.calculateTotals(

                data.items,

                data.discount || 0,

                data.tax || 0

            );

        return await purchaseRepository.create({

            supplier: data.supplier,

            warehouse: data.warehouse,

            items: totals.items,

            subtotal: totals.subtotal,

            discount: totals.discount,

            tax: totals.tax,

            total: totals.total,

            notes: data.notes || null,

            status: "Draft",

            createdBy: userId

        });

    }

    async confirmPurchase(id, userId) {

        const purchase =
            await purchaseRepository.findById(id);

        if (!purchase) {

            throw new AppError(
                "Purchase not found",
                404
            );

        }

        if (purchase.status !== "Draft") {

            throw new AppError(

                "Only draft purchases can be confirmed",

                400

            );

        }

        purchase.status = "Confirmed";

        purchase.updatedBy = userId;

        return await purchaseRepository.save(
            purchase
        );

    }

    async receivePurchase(id, userId) {

        const session =
            await mongoose.startSession();

        try {

            session.startTransaction();

            const purchase =
                await purchaseRepository.findById(
                    id,
                    { session }
                );

            if (!purchase) {

                throw new AppError(
                    "Purchase not found",
                    404
                );

            }

            if (
                purchase.status !==
                "Confirmed"
            ) {

                throw new AppError(

                    "Only confirmed purchases can be received",

                    400

                );

            }

            for (
                const item of purchase.items
            ) {

                let stock =
                    await stockRepository.findOne(

                        {

                            product:
                                item.product,

                            warehouse:
                                purchase.warehouse

                        },

                        {
                            session
                        }

                    );

                if (!stock) {

                    stock =
                        await stockRepository.create(

                            {

                                product:
                                    item.product,

                                warehouse:
                                    purchase.warehouse,

                                quantity: 0,

                                createdBy:
                                    userId

                            },

                            {
                                session
                            }

                        );

                }

                stock.quantity +=
                    item.quantity;

                stock.updatedBy =
                    userId;

                await stockRepository.save(

                    stock,

                    {
                        session
                    }

                );

                await stockTransactionRepository.create(

                    {

                        product:
                            item.product,

                        warehouse:
                            purchase.warehouse,

                        type: "IN",

                        quantity:
                            item.quantity,

                        reference:
                            `PURCHASE-${purchase._id}`,

                        notes:
                            "Stock received from purchase",

                        createdBy:
                            userId

                    },

                    {
                        session
                    }

                );

            }

            purchase.status =
                "Received";

            purchase.receivedAt =
                new Date();

            purchase.receivedBy =
                userId;

            purchase.updatedBy =
                userId;

            await purchaseRepository.save(

                purchase,

                {
                    session
                }

            );

            await session.commitTransaction();

            return purchase;

        } catch (error) {

            await session.abortTransaction();

            throw error;

        } finally {

            await session.endSession();

        }

    }

    async getPurchases(query = {}) {

        const page =
            Number(query.page) || 1;

        const limit =
            Number(query.limit) || 10;

        const skip =
            (page - 1) * limit;

        const filter = {};

        if (query.supplier) {

            filter.supplier =
                query.supplier;

        }

        if (query.warehouse) {

            filter.warehouse =
                query.warehouse;

        }

        if (query.status) {

            filter.status =
                query.status;

        }

        const total =
            await purchaseRepository.count(
                filter
            );

        const data =
            await purchaseRepository.find(

                filter,

                {

                    skip,

                    limit,

                    sort: {
                        createdAt: -1
                    },

                    populate: [

                        {
                            path: "supplier",

                            select:
                                "name code"

                        },

                        {
                            path: "warehouse",

                            select:
                                "name code"

                        },

                        {
                            path: "items.product",

                            select:
                                "name sku"

                        },

                        {
                            path: "createdBy",

                            select:
                                "name email"

                        },

                        {
                            path: "receivedBy",

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

    async getPurchaseById(id) {

        const purchase =
            await purchaseRepository.findOne(

                {
                    _id: id
                },

                {

                    populate: [

                        {
                            path: "supplier",

                            select:
                                "name code email phone"

                        },

                        {
                            path: "warehouse",

                            select:
                                "name code location"

                        },

                        {
                            path: "items.product",

                            select:
                                "name sku barcode unit"

                        },

                        {
                            path: "createdBy",

                            select:
                                "name email"

                        },

                        {
                            path: "receivedBy",

                            select:
                                "name email"

                        }

                    ]

                }

            );

        if (!purchase) {

            throw new AppError(
                "Purchase not found",
                404
            );

        }

        return purchase;

    }

    async cancelPurchase(id, userId) {

        const purchase =
            await purchaseRepository.findById(id);

        if (!purchase) {

            throw new AppError(
                "Purchase not found",
                404
            );

        }

        if (
            purchase.status ===
            "Received"
        ) {

            throw new AppError(

                "Received purchase cannot be cancelled",

                400

            );

        }

        if (
            purchase.status ===
            "Cancelled"
        ) {

            throw new AppError(

                "Purchase is already cancelled",

                400

            );

        }

        purchase.status =
            "Cancelled";

        purchase.updatedBy =
            userId;

        return await purchaseRepository.save(
            purchase
        );

    }

}

export default new PurchaseService();