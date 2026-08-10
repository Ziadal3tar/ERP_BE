import categoryRepository from "../repositories/category.repository.js";

import AppError from "../utils/AppError.js";

class CategoryService {

    async createCategory(data, userId) {

        const code = data.code.toUpperCase();

        const existing =
            await categoryRepository.findOne({

                code

            });

        if (existing) {

            throw new AppError(

                "Category code already exists",

                400

            );

        }

     if (data.parent) {

            const parent =
                await categoryRepository.findById(
                    data.parent
                );

            if (!parent) {

                throw new AppError(

                    "Parent category not found",

                    404

                );

            }

            if (!parent.isActive) {

                throw new AppError(

                    "Parent category is inactive",

                    400

                );

            }

            // if (
            //     data.parent.toString() ===
            //     data._id?.toString()
            // ) {

            //     throw new AppError(

            //         "Category cannot be its own parent",

            //         400

            //     );

            // }

        }

        return await categoryRepository.create({

            ...data,

            code,

            createdBy: userId

        });

    }

    async getCategories(query = {}) {

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

        if (query.parent) {

            filter.parent =
                query.parent;

        }

        if (
            query.isActive !== undefined
        ) {

            filter.isActive =
                query.isActive === "true";

        }

        const total =
            await categoryRepository.count(

                filter

            );

        const categories =
            await categoryRepository.find(

                filter,

                {

                    skip,

                    limit,

                    sort: {
                        name: 1
                    },

                    populate: [

                        {
                            path: "parent",

                            select:
                                "name code"

                        },

                        {
                            path: "createdBy",

                            select:
                                "name email"

                        },

                        {
                            path: "updatedBy",

                            select:
                                "name email"

                        }

                    ]

                }

            );

        return {

            data: categories,

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

    async getCategoryById(id) {

        const category =
            await categoryRepository.findOne(

                {
                    _id: id
                },

                {

                    populate: [

                        {
                            path: "parent",

                            select:
                                "name code"

                        },

                        {
                            path: "createdBy",

                            select:
                                "name email"

                        },

                        {
                            path: "updatedBy",

                            select:
                                "name email"

                        }

                    ]

                }

            );

        if (!category) {

            throw new AppError(

                "Category not found",

                404

            );

        }

        return category;

    }

    async updateCategory(id, data, userId) {

        const category =
            await categoryRepository.findById(id);

        if (!category) {

            throw new AppError(

                "Category not found",

                404

            );

        }

        if (data.code) {

            const code =
                data.code.toUpperCase();

            const existing =
                await categoryRepository.findOne({

                    code

                });

            if (
                existing &&
                existing._id.toString() !== id
            ) {

                throw new AppError(

                    "Category code already exists",

                    400

                );

            }

            category.code = code;

        }

        if (data.parent !== undefined) {

            if (data.parent === null) {

                category.parent = null;

            } else {

                if (
                    data.parent.toString() === id
                ) {

                    throw new AppError(

                        "Category cannot be its own parent",

                        400

                    );

                }

                const parent =
                    await categoryRepository.findById(
                        data.parent
                    );

                if (!parent) {

                    throw new AppError(

                        "Parent category not found",

                        404

                    );

                }

                if (!parent.isActive) {

                    throw new AppError(

                        "Parent category is inactive",

                        400

                    );

                }

                category.parent =
                    data.parent;

            }

        }

        const allowedFields = [

            "name",

            "description"

        ];

        allowedFields.forEach(field => {

            if (
                data[field] !== undefined
            ) {

                category[field] =
                    data[field];

            }

        });

        category.updatedBy =
            userId;

        return await categoryRepository.save(

            category

        );

    }

    async deleteCategory(id, userId) {

        const category =
            await categoryRepository.findById(id);

        if (!category) {

            throw new AppError(

                "Category not found",

                404

            );

        }

        if (!category.isActive) {

            throw new AppError(

                "Category is already inactive",

                400

            );

        }

        const childCategory =
            await categoryRepository.findOne({

                parent: id,

                isActive: true

            });

        if (childCategory) {

            throw new AppError(

                "Cannot delete category with active child categories",

                400

            );

        }

        category.isActive = false;

        category.updatedBy = userId;

        return await categoryRepository.save(

            category

        );

    }

    async restoreCategory(id, userId) {

        const category =
            await categoryRepository.findById(id);

        if (!category) {

            throw new AppError(

                "Category not found",

                404

            );

        }

        if (category.isActive) {

            throw new AppError(

                "Category is already active",

                400

            );

        }

        if (category.parent) {

            const parent =
                await categoryRepository.findById(

                    category.parent

                );

            if (
                !parent ||
                !parent.isActive
            ) {

                throw new AppError(

                    "Cannot restore category because its parent is inactive",

                    400

                );

            }

        }

        category.isActive = true;

        category.updatedBy = userId;

        return await categoryRepository.save(

            category

        );

    }

}

export default new CategoryService();