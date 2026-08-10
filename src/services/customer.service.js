import customerRepository
    from "../repositories/customer.repository.js";

import AppError
    from "../utils/AppError.js";

class CustomerService {

    async createCustomer(data, userId) {

        const code =
            data.code.toUpperCase();

        const existing =
            await customerRepository.findOne({
                code
            });

        if (existing) {

            throw new AppError(
                "Customer code already exists",
                400
            );

        }

        return await customerRepository.create({

            ...data,

            code,

            createdBy: userId

        });

    }

    async getCustomers(query = {}) {

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
            await customerRepository.count(
                filter
            );

        const data =
            await customerRepository.find(

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
                    Math.ceil(
                        total / limit
                    )

            }

        };

    }

    async getCustomerById(id) {

        const customer =
            await customerRepository.findOne(

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

        if (!customer) {

            throw new AppError(
                "Customer not found",
                404
            );

        }

        return customer;

    }

    async updateCustomer(
        id,
        data,
        userId
    ) {

        const customer =
            await customerRepository.findById(id);

        if (!customer) {

            throw new AppError(
                "Customer not found",
                404
            );

        }

        if (data.code) {

            const code =
                data.code.toUpperCase();

            const existing =
                await customerRepository.findOne({
                    code
                });

            if (

                existing &&

                existing._id.toString() !== id

            ) {

                throw new AppError(
                    "Customer code already exists",
                    400
                );

            }

            customer.code = code;

        }

        const allowedFields = [

            "name",
            "email",
            "phone",
            "address",
            "taxNumber",
            "creditLimit",
            "notes"

        ];

        allowedFields.forEach(field => {

            if (data[field] !== undefined) {

                customer[field] =
                    data[field];

            }

        });

        customer.updatedBy =
            userId;

        return await customerRepository.save(
            customer
        );

    }

    async deleteCustomer(
        id,
        userId
    ) {

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
                "Customer is already inactive",
                400
            );

        }

        customer.isActive = false;

        customer.updatedBy =
            userId;

        return await customerRepository.save(
            customer
        );

    }

    async restoreCustomer(
        id,
        userId
    ) {

        const customer =
            await customerRepository.findById(id);

        if (!customer) {

            throw new AppError(
                "Customer not found",
                404
            );

        }

        if (customer.isActive) {

            throw new AppError(
                "Customer is already active",
                400
            );

        }

        customer.isActive = true;

        customer.updatedBy =
            userId;

        return await customerRepository.save(
            customer
        );

    }

}

export default new CustomerService();