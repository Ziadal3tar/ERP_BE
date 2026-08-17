import mongoose from "mongoose";
import Sale from "../models/sale.model.js";
import Purchase from "../models/purchase.model.js";
import Stock from "../models/stock.model.js";
import Product from "../models/product.model.js";
import Customer from "../models/customer.model.js";
import Supplier from "../models/supplier.model.js";

class ReportService {

    /*
    |--------------------------------------------------------------------------
    | Dashboard Summary
    |--------------------------------------------------------------------------
    */

    async getDashboardSummary() {

        const [
            products,
            customers,
            suppliers,
            stock,
            sales,
            purchases
        ] = await Promise.all([

            Product.countDocuments({
                isActive: true
            }),

            Customer.countDocuments({
                isActive: true
            }),

            Supplier.countDocuments({
                isActive: true
            }),

            Stock.aggregate([

                {
                    $group: {
                        _id: null,

                        totalQuantity: {
                            $sum: "$quantity"
                        }
                    }
                }

            ]),

            Sale.aggregate([

                {
                    $match: {
                        status: "Confirmed"
                    }
                },

                {
                    $group: {

                        _id: null,

                        totalSales: {
                            $sum: "$total"
                        },

                        salesCount: {
                            $sum: 1
                        }

                    }
                }

            ]),

            Purchase.aggregate([

                {
                    $match: {
                        status: "Received"
                    }
                },

                {
                    $group: {

                        _id: null,

                        totalPurchases: {
                            $sum: "$total"
                        },

                        purchasesCount: {
                            $sum: 1
                        }

                    }
                }

            ])

        ]);

        return {

            products,

            customers,

            suppliers,

            stockQuantity:
                stock[0]?.totalQuantity || 0,

            sales: {

                total:
                    sales[0]?.totalSales || 0,

                count:
                    sales[0]?.salesCount || 0

            },

            purchases: {

                total:
                    purchases[0]?.totalPurchases || 0,

                count:
                    purchases[0]?.purchasesCount || 0

            }

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Sales Report
    |--------------------------------------------------------------------------
    */

async getSalesReport(query = {}) {

    const match = {
        status: "Confirmed"
    };


    const filters = [];


    if (query.customer) {

        filters.push({

            $eq: [
                {
                    $toString: "$customer"
                },

                query.customer

            ]

        });

    }


    if (query.warehouse) {

        filters.push({

            $eq: [
                {
                    $toString: "$warehouse"
                },

                query.warehouse

            ]

        });

    }


    const pipeline = [];


    /*
    |--------------------------------------------------------------------------
    | Base Match
    |--------------------------------------------------------------------------
    */

    pipeline.push({

        $match: match

    });


    /*
    |--------------------------------------------------------------------------
    | Customer / Warehouse Filters
    |--------------------------------------------------------------------------
    */

    if (filters.length) {

        pipeline.push({

            $match: {

                $expr: {

                    $and: filters

                }

            }

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Group
    |--------------------------------------------------------------------------
    */

    pipeline.push({

        $group: {

            _id: null,

            totalSales: {
                $sum: "$total"
            },

            subtotal: {
                $sum: "$subtotal"
            },

            discount: {
                $sum: "$discount"
            },

            tax: {
                $sum: "$tax"
            },

            count: {
                $sum: 1
            }

        }

    });


    console.log(
        "SALES REPORT QUERY:",
        query
    );


    const result =
        await Sale.aggregate(
            pipeline
        );


    console.log(
        "SALES REPORT RESULT:",
        result
    );


    return {

        totalSales:
            result[0]?.totalSales || 0,

        subtotal:
            result[0]?.subtotal || 0,

        discount:
            result[0]?.discount || 0,

        tax:
            result[0]?.tax || 0,

        count:
            result[0]?.count || 0

    };

}

    /*
    |--------------------------------------------------------------------------
    | Purchases Report
    |--------------------------------------------------------------------------
    */

   async getPurchasesReport(query = {}) {

    const match = {
        status: "Received"
    };


    if (query.supplier) {

        match.supplier =
            new mongoose.Types.ObjectId(
                query.supplier
            );

    }


    if (query.warehouse) {

        match.warehouse =
            new mongoose.Types.ObjectId(
                query.warehouse
            );

    }


    const result =
        await Purchase.aggregate([

            {
                $match: match
            },

            {
                $group: {

                    _id: null,

                    totalPurchases: {
                        $sum: "$total"
                    },

                    subtotal: {
                        $sum: "$subtotal"
                    },

                    discount: {
                        $sum: "$discount"
                    },

                    tax: {
                        $sum: "$tax"
                    },

                    count: {
                        $sum: 1
                    }

                }
            }

        ]);


    return {

        totalPurchases:
            result[0]?.totalPurchases || 0,

        subtotal:
            result[0]?.subtotal || 0,

        discount:
            result[0]?.discount || 0,

        tax:
            result[0]?.tax || 0,

        count:
            result[0]?.count || 0

    };

}

    /*
    |--------------------------------------------------------------------------
    | Stock Report
    |--------------------------------------------------------------------------
    */

    async getStockReport() {

        const result =
            await Stock.aggregate([

                {
                    $lookup: {

                        from: "products",

                        localField: "product",

                        foreignField: "_id",

                        as: "product"

                    }
                },

                {
                    $unwind: "$product"
                },

                {
                    $lookup: {

                        from: "warehouses",

                        localField: "warehouse",

                        foreignField: "_id",

                        as: "warehouse"

                    }
                },

                {
                    $unwind: "$warehouse"
                },

                {
                    $project: {

                        _id: 1,

                        quantity: 1,

                        product: {

                            _id:
                                "$product._id",

                            name:
                                "$product.name",

                            sku:
                                "$product.sku",

                            minStock:
                                "$product.minStock"

                        },

                        warehouse: {

                            _id:
                                "$warehouse._id",

                            name:
                                "$warehouse.name",

                            code:
                                "$warehouse.code"

                        },

                        isLowStock: {

                            $lte: [

                                "$quantity",

                                "$product.minStock"

                            ]

                        }

                    }

                },

                {
                    $sort: {
                        quantity: 1
                    }
                }

            ]);

        return result;

    }

    /*
    |--------------------------------------------------------------------------
    | Low Stock
    |--------------------------------------------------------------------------
    */

    async getLowStock() {

        const result =
            await Stock.aggregate([

                {
                    $lookup: {

                        from: "products",

                        localField: "product",

                        foreignField: "_id",

                        as: "product"

                    }
                },

                {
                    $unwind: "$product"
                },

                {
                    $match: {

                        $expr: {

                            $lte: [

                                "$quantity",

                                "$product.minStock"

                            ]

                        }

                    }

                },

                {
                    $project: {

                        _id: 1,

                        quantity: 1,

                        product: {

                            _id:
                                "$product._id",

                            name:
                                "$product.name",

                            sku:
                                "$product.sku",

                            minStock:
                                "$product.minStock"

                        }

                    }

                },

                {
                    $sort: {
                        quantity: 1
                    }

                }

            ]);

        return result;

    }

}

export default new ReportService();