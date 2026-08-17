import mongoose from "mongoose";

import paymentRepository
    from "../repositories/payment.repository.js";

import invoiceRepository
    from "../repositories/invoice.repository.js";

import AppError
    from "../utils/AppError.js";

class PaymentService {

    /*
    |--------------------------------------------------------------------------
    | Create Payment
    |--------------------------------------------------------------------------
    */

    async createPayment(
        invoiceId,
        data,
        userId
    ) {

        const session =
            await mongoose.startSession();

        try {

            session.startTransaction();

            /*
             * Find Invoice
             */

            const invoice =
                await invoiceRepository.findById(

                    invoiceId,

                    {
                        session
                    }

                );

            if (!invoice) {

                throw new AppError(
                    "Invoice not found",
                    404
                );

            }

            /*
             * Cannot pay cancelled invoice
             */

            if (
                invoice.status ===
                "Cancelled"
            ) {

                throw new AppError(

                    "Cannot pay a cancelled invoice",

                    400

                );

            }

            /*
             * Already Paid
             */

            if (
                invoice.status ===
                "Paid"
            ) {

                throw new AppError(

                    "Invoice is already fully paid",

                    400

                );

            }

            const amount =
                Number(data.amount);

            /*
             * Prevent overpayment
             */

            if (
                amount >
                invoice.remainingAmount
            ) {

                throw new AppError(

                    `Payment exceeds remaining amount: ${invoice.remainingAmount}`,

                    400

                );

            }

            /*
             * Create Payment
             */

            const payment =
                await paymentRepository.create(

                    {

                        invoice:
                            invoice._id,

                        customer:
                            invoice.customer,

                        amount,

                        method:
                            data.method,

                        reference:
                            data.reference ||
                            null,

                        notes:
                            data.notes ||
                            null,

                        createdBy:
                            userId

                    },

                    {
                        session
                    }

                );

            /*
             * Update Invoice
             */

            invoice.paidAmount +=
                amount;

            invoice.remainingAmount =
                invoice.total -
                invoice.paidAmount;

            /*
             * Avoid floating point
             * precision problems
             */

            invoice.paidAmount =
                Number(
                    invoice.paidAmount.toFixed(2)
                );

            invoice.remainingAmount =
                Number(
                    invoice.remainingAmount.toFixed(2)
                );

            /*
             * Update Status
             */

            if (
                invoice.remainingAmount ===
                0
            ) {

                invoice.status =
                    "Paid";

            } else {

                invoice.status =
                    "PartiallyPaid";

            }

            invoice.updatedBy =
                userId;

            await invoiceRepository.save(

                invoice,

                {
                    session
                }

            );

            await session.commitTransaction();

            return {

                payment,

                invoice

            };

        } catch (error) {

            await session.abortTransaction();

            throw error;

        } finally {

            await session.endSession();

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Get Payments
    |--------------------------------------------------------------------------
    */

    async getPayments(query = {}) {

        const page =
            Number(query.page) || 1;

        const limit =
            Number(query.limit) || 10;

        const skip =
            (page - 1) * limit;

        const filter = {};

        if (query.invoice) {

            filter.invoice =
                query.invoice;

        }

        if (query.customer) {

            filter.customer =
                query.customer;

        }

        const total =
            await paymentRepository.count(
                filter
            );

        const data =
            await paymentRepository.find(

                filter,

                {

                    skip,

                    limit,

                    sort: {
                        paymentDate: -1
                    },

                    populate: [

                        {
                            path: "invoice",

                            select:
                                "invoiceNumber total status"

                        },

                        {
                            path: "customer",

                            select:
                                "name code phone"

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

    /*
    |--------------------------------------------------------------------------
    | Get Payment By ID
    |--------------------------------------------------------------------------
    */

    async getPaymentById(id) {

        const payment =
            await paymentRepository.findOne(

                {
                    _id: id
                },

                {

                    populate: [

                        {
                            path: "invoice",

                            select:
                                "invoiceNumber total paidAmount remainingAmount status"

                        },

                        {
                            path: "customer",

                            select:
                                "name code phone"

                        },

                        {
                            path: "createdBy",

                            select:
                                "name email"

                        }

                    ]

                }

            );

        if (!payment) {

            throw new AppError(
                "Payment not found",
                404
            );

        }

        return payment;

    }

}

export default new PaymentService();