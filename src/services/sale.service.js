import mongoose from "mongoose";

import saleRepository
    from "../repositories/sale.repository.js";

import customerRepository
    from "../repositories/customer.repository.js";

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

class SaleService {

    

    async validateCustomer(id) {

        const customer =
            await customerRepository.findById(id);

        if (!customer) {

            throw new AppError(
                "Customer not found",
                404
            );

        }

        if (!customer.isActive) {

            throw new AppError(
                "Customer is inactive",
                400
            );

        }

        return customer;

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

                "A product cannot appear more than once in the sale",

                400

            );

        }

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

        }

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

                return {

                    product: item.product,

                    quantity,

                    unitPrice,

                    total:
                        quantity * unitPrice

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

                "Sale total cannot be negative",

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

    

    async createSale(data, userId) {

        await this.validateCustomer(
            data.customer
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

        /*
         * Credit validation
         *
         * We only check that a Credit
         * customer has a credit limit.
         */

        if (
            data.paymentMethod ===
            "Credit"
        ) {

            const customer =
                await customerRepository.findById(
                    data.customer
                );

            if (
                customer.creditLimit <= 0
            ) {

                throw new AppError(

                    "Customer does not have a credit limit",

                    400

                );

            }

        }

        return await saleRepository.create({

            customer:
                data.customer,

            warehouse:
                data.warehouse,

            items:
                totals.items,

            subtotal:
                totals.subtotal,

            discount:
                totals.discount,

            tax:
                totals.tax,

            total:
                totals.total,

            paymentMethod:
                data.paymentMethod || "Cash",

            notes:
                data.notes || null,

            status:
                "Draft",

            createdBy:
                userId

        });

    }

    

    async confirmSale(id, userId) {

        const session =
            await mongoose.startSession();

        try {

            session.startTransaction();

            const sale =
                await saleRepository.findById(
                    id,
                    { session }
                );

            if (!sale) {

                throw new AppError(
                    "Sale not found",
                    404
                );

            }

            if (
                sale.status !==
                "Draft"
            ) {

                throw new AppError(

                    "Only draft sales can be confirmed",

                    400

                );

            }

            /*
             * Check and remove stock
             */

            for (
                const item of sale.items
            ) {

                const stock =
                    await stockRepository.findOne(

                        {

                            product:
                                item.product,

                            warehouse:
                                sale.warehouse

                        },

                        {
                            session
                        }

                    );

                if (!stock) {

                    throw new AppError(

                        "No stock found for one of the products",

                        404

                    );

                }

                if (
                    stock.quantity <
                    item.quantity
                ) {

                    throw new AppError(

                        `Insufficient stock for product ${item.product}`,

                        400

                    );

                }

                stock.quantity -=
                    item.quantity;

                stock.updatedBy =
                    userId;

                await stockRepository.save(

                    stock,

                    {
                        session
                    }

                );

                /*
                 * Stock history
                 */

                await stockTransactionRepository.create(

                    {

                        product:
                            item.product,

                        warehouse:
                            sale.warehouse,

                        type:
                            "OUT",

                        quantity:
                            item.quantity,

                        reference:
                            `SALE-${sale._id}`,

                        notes:
                            "Stock removed from sale",

                        createdBy:
                            userId

                    },

                    {
                        session
                    }

                );

            }

            sale.status =
                "Confirmed";

            sale.confirmedAt =
                new Date();

            sale.confirmedBy =
                userId;

            sale.updatedBy =
                userId;

            await saleRepository.save(

                sale,

                {
                    session
                }

            );

            await session.commitTransaction();

            return sale;

        } catch (error) {

            await session.abortTransaction();

            throw error;

        } finally {

            await session.endSession();

        }

    }

    

    async cancelSale(id, userId) {

        const sale =
            await saleRepository.findById(id);

        if (!sale) {

            throw new AppError(
                "Sale not found",
                404
            );

        }

        /*
         * Confirmed sales already
         * affected stock.
         */

        if (
            sale.status ===
            "Confirmed"
        ) {

            throw new AppError(

                "Confirmed sale cannot be cancelled",

                400

            );

        }

        if (
            sale.status ===
            "Cancelled"
        ) {

            throw new AppError(

                "Sale is already cancelled",

                400

            );

        }

        sale.status =
            "Cancelled";

        sale.updatedBy =
            userId;

        return await saleRepository.save(
            sale
        );

    }

    

    async getSales(query = {}) {

        const page =
            Number(query.page) || 1;

        const limit =
            Number(query.limit) || 10;

        const skip =
            (page - 1) * limit;

        const filter = {};

        if (query.customer) {

            filter.customer =
                query.customer;

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
            await saleRepository.count(
                filter
            );

        const data =
            await saleRepository.find(

                filter,

                {

                    skip,

                    limit,

                    sort: {
                        createdAt: -1
                    },

                    populate: [

                        {
                            path: "customer",

                            select:
                                "name code phone creditLimit"

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
                            path: "confirmedBy",

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

    

    async getSaleById(id) {

        const sale =
            await saleRepository.findOne(

                {
                    _id: id
                },

                {

                    populate: [

                        {
                            path: "customer",

                            select:
                                "name code email phone address"

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
                            path: "confirmedBy",

                            select:
                                "name email"

                        }

                    ]

                }

            );

        if (!sale) {

            throw new AppError(
                "Sale not found",
                404
            );

        }

        return sale;

    }

}

export default new SaleService();