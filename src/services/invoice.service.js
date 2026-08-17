import invoiceRepository
    from "../repositories/invoice.repository.js";

import saleRepository
    from "../repositories/sale.repository.js";

import AppError
    from "../utils/AppError.js";

class InvoiceService {

    

    async generateInvoiceNumber() {

        const count =
            await invoiceRepository.count({});

        const number =
            String(count + 1)
                .padStart(6, "0");

        return `INV-${number}`;

    }

    

    async createFromSale(
        saleId,
        userId
    ) {

        const sale =
            await saleRepository.findById(
                saleId
            );

        if (!sale) {

            throw new AppError(
                "Sale not found",
                404
            );

        }

        if (
            sale.status !==
            "Confirmed"
        ) {

            throw new AppError(

                "Invoice can only be created for a confirmed sale",

                400

            );

        }

        /*
         * Prevent duplicate invoice
         */

        const existing =
            await invoiceRepository.findOne({
                sale: sale._id
            });

        if (existing) {

            throw new AppError(

                "Invoice already exists for this sale",

                400

            );

        }

        const invoiceNumber =
            await this.generateInvoiceNumber();

        const invoice =
            await invoiceRepository.create({

                invoiceNumber,

                sale: sale._id,

                customer:
                    sale.customer,

                items:
                    sale.items,

                subtotal:
                    sale.subtotal,

                discount:
                    sale.discount,

                tax:
                    sale.tax,

                total:
                    sale.total,

                paidAmount: 0,

                remainingAmount:
                    sale.total,

                status: "Unpaid",

                notes:
                    sale.notes,

                createdBy:
                    userId

            });

        return invoice;

    }

    

    async getInvoices(query = {}) {

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

        if (query.status) {

            filter.status =
                query.status;

        }

        const total =
            await invoiceRepository.count(
                filter
            );

        const data =
            await invoiceRepository.find(

                filter,

                {

                    skip,

                    limit,

                    sort: {
                        issueDate: -1
                    },

                    populate: [

                        {
                            path: "sale",

                            select:
                                "warehouse paymentMethod status"

                        },

                        {
                            path: "customer",

                            select:
                                "name code phone"

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

    

    async getInvoiceById(id) {

        const invoice =
            await invoiceRepository.findOne(

                {
                    _id: id
                },

                {

                    populate: [

                        {
                            path: "sale",

                            select:
                                "warehouse paymentMethod status"

                        },

                        {
                            path: "customer",

                            select:
                                "name code email phone address"

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

                        }

                    ]

                }

            );

        if (!invoice) {

            throw new AppError(
                "Invoice not found",
                404
            );

        }

        return invoice;

    }

    

    async cancelInvoice(
        id,
        userId
    ) {

        const invoice =
            await invoiceRepository.findById(id);

        if (!invoice) {

            throw new AppError(
                "Invoice not found",
                404
            );

        }

        if (
            invoice.status ===
            "Paid"
        ) {

            throw new AppError(

                "Paid invoice cannot be cancelled",

                400

            );

        }

        invoice.status =
            "Cancelled";

        invoice.updatedBy =
            userId;

        return await invoiceRepository.save(
            invoice
        );

    }

}

export default new InvoiceService();