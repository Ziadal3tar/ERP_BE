import productRepository from "../repositories/product.repository.js";
import categoryRepository from "../repositories/category.repository.js";

import AppError from "../utils/AppError.js";

class ProductService {

    /*
    |--------------------------------------------------------------------------
    | Create Product
    |--------------------------------------------------------------------------
    */

    async createProduct(data, userId) {

        const sku = data.sku.toUpperCase();

        /*
         * Check duplicate SKU
         */

        const existingSku =
            await productRepository.findOne({

                sku

            });

        if (existingSku) {

            throw new AppError(

                "Product SKU already exists",

                400

            );

        }

        /*
         * Check duplicate barcode
         */

        if (data.barcode) {

            const existingBarcode =
                await productRepository.findOne({

                    barcode: data.barcode

                });

            if (existingBarcode) {

                throw new AppError(

                    "Product barcode already exists",

                    400

                );

            }

        }

        /*
         * Check category
         */

        const category =
            await categoryRepository.findById(

                data.category

            );

        if (!category) {

            throw new AppError(

                "Category not found",

                404

            );

        }

        if (!category.isActive) {

            throw new AppError(

                "Category is inactive",

                400

            );

        }

        /*
         * Create Product
         */

        return await productRepository.create({

            ...data,

            sku,

            createdBy: userId

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Get Products
    |--------------------------------------------------------------------------
    */

    async getProducts(query = {}) {

        const page =
            Number(query.page) || 1;

        const limit =
            Number(query.limit) || 10;

        const skip =
            (page - 1) * limit;

        const filter = {};

        /*
         * Search
         */

        if (query.search) {

            filter.$or = [

                {
                    name: {
                        $regex: query.search,
                        $options: "i"
                    }
                },

                {
                    sku: {
                        $regex: query.search,
                        $options: "i"
                    }
                },

                {
                    barcode: {
                        $regex: query.search,
                        $options: "i"
                    }
                }

            ];

        }

        /*
         * Category filter
         */

        if (query.category) {

            filter.category =
                query.category;

        }

        /*
         * Active filter
         */

        if (
            query.isActive !== undefined
        ) {

            filter.isActive =
                query.isActive === "true";

        }

        const total =
            await productRepository.count(

                filter

            );

        const products =
            await productRepository.find(

                filter,

                {

                    skip,

                    limit,

                    sort: {
                        createdAt: -1
                    },

                    populate: [

                        {
                            path: "category",

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

            data: products,

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
    | Get Product By ID
    |--------------------------------------------------------------------------
    */

    async getProductById(id) {

        const product =
            await productRepository.findOne(

                {
                    _id: id
                },

                {

                    populate: [

                        {

                            path: "category",

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

        if (!product) {

            throw new AppError(

                "Product not found",

                404

            );

        }

        return product;

    }

    /*
    |--------------------------------------------------------------------------
    | Update Product
    |--------------------------------------------------------------------------
    */

    async updateProduct(id, data, userId) {

        const product =
            await productRepository.findById(id);

        if (!product) {

            throw new AppError(

                "Product not found",

                404

            );

        }

        /*
         * SKU
         */

        if (data.sku) {

            const sku =
                data.sku.toUpperCase();

            const existingSku =
                await productRepository.findOne({

                    sku

                });

            if (

                existingSku &&

                existingSku._id.toString() !== id

            ) {

                throw new AppError(

                    "Product SKU already exists",

                    400

                );

            }

            product.sku = sku;

        }

        /*
         * Barcode
         */

        if (
            data.barcode !== undefined
        ) {

            if (data.barcode === null) {

                product.barcode = null;

            } else {

                const existingBarcode =
                    await productRepository.findOne({

                        barcode: data.barcode

                    });

                if (

                    existingBarcode &&

                    existingBarcode._id.toString() !== id

                ) {

                    throw new AppError(

                        "Product barcode already exists",

                        400

                    );

                }

                product.barcode =
                    data.barcode;

            }

        }

        /*
         * Category
         */

        if (data.category) {

            const category =
                await categoryRepository.findById(

                    data.category

                );

            if (!category) {

                throw new AppError(

                    "Category not found",

                    404

                );

            }

            if (!category.isActive) {

                throw new AppError(

                    "Category is inactive",

                    400

                );

            }

            product.category =
                data.category;

        }

        /*
         * Allowed fields
         */

        const allowedFields = [

            "name",

            "description",

            "purchasePrice",

            "sellingPrice",

            "unit",

            "minStock",

            "image"

        ];

        allowedFields.forEach(field => {

            if (
                data[field] !== undefined
            ) {

                product[field] =
                    data[field];

            }

        });

        product.updatedBy =
            userId;

        return await productRepository.save(

            product

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Delete Product
    |--------------------------------------------------------------------------
    */

    async deleteProduct(id, userId) {

        const product =
            await productRepository.findById(id);

        if (!product) {

            throw new AppError(

                "Product not found",

                404

            );

        }

        if (!product.isActive) {

            throw new AppError(

                "Product is already inactive",

                400

            );

        }

        product.isActive = false;

        product.updatedBy = userId;

        return await productRepository.save(

            product

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Restore Product
    |--------------------------------------------------------------------------
    */

    async restoreProduct(id, userId) {

        const product =
            await productRepository.findById(id);

        if (!product) {

            throw new AppError(

                "Product not found",

                404

            );

        }

        if (product.isActive) {

            throw new AppError(

                "Product is already active",

                400

            );

        }

        /*
         * Category must still be active
         */

        const category =
            await categoryRepository.findById(

                product.category

            );

        if (!category) {

            throw new AppError(

                "Product category not found",

                404

            );

        }

        if (!category.isActive) {

            throw new AppError(

                "Cannot restore product because its category is inactive",

                400

            );

        }

        product.isActive = true;

        product.updatedBy = userId;

        return await productRepository.save(

            product

        );

    }

}

export default new ProductService();