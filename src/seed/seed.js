import "dotenv/config";
import mongoose from "mongoose";

import User from "../models/user.model.js";
import Department from "../models/department.model.js";
import Employee from "../models/employee.model.js";
import Attendance from "../models/attendance.model.js";
import Leave from "../models/leave.model.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import Warehouse from "../models/warehouse.model.js";
import Stock from "../models/stock.model.js";
import StockTransaction from "../models/stockTransaction.model.js";
import Supplier from "../models/supplier.model.js";
import Purchase from "../models/purchase.model.js";
import Customer from "../models/customer.model.js";
import Sale from "../models/sale.model.js";
import Invoice from "../models/invoice.model.js";
import Payment from "../models/payment.model.js";
import Notification from "../models/notification.model.js";
import AuditLog from "../models/auditLog.model.js";

/* =========================================================
   CONFIG
========================================================= */

const PASSWORD = "Password123!";

/* =========================================================
   HELPERS
========================================================= */

const rand = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const pick = (items) =>
    items[rand(0, items.length - 1)];

const money = (value) =>
    Math.round(value * 100) / 100;

const dateDaysAgo = (days) => {

    const date = new Date();

    date.setDate(
        date.getDate() - days
    );

    return date;
};

const randomDate = (from, to) =>
    new Date(
        from.getTime() +
        Math.random() *
        (to.getTime() - from.getTime())
    );

const randomBusinessDate = () =>
    randomDate(
        dateDaysAgo(180),
        new Date()
    );

const makePhone = (index) =>
    `010${String(10000000 + index).slice(-8)}`;

const getItems = (
    products,
    quantity = rand(1, 4)
) => {

    const selected = new Set();

    while (
        selected.size <
        Math.min(quantity, products.length)
    ) {

        selected.add(
            rand(0, products.length - 1)
        );

    }

    return [...selected].map(
        index => products[index]
    );
};

/* =========================================================
   CLEAR DATABASE
========================================================= */

const clearDatabase = async () => {

    const models = [

        Payment,
        Invoice,
        Sale,
        Purchase,

        StockTransaction,
        Stock,

        Leave,
        Attendance,

        Employee,

        Notification,
        AuditLog,

        Product,
        Category,

        Supplier,
        Customer,

        Warehouse,
        Department,

        User

    ];

    await Promise.all(

        models.map(
            model =>
                model.deleteMany({})
        )

    );

};

/* =========================================================
   USERS
========================================================= */

const createUsers = async () => {

    const users = await User.create([

        {
            name: "System Administrator",
            email: "admin@erp.com",
            password: PASSWORD,
            phone: makePhone(1),

            role: "Admin",
            status: "Active",

            isActive: true,
            isVerified: true,

            forcePasswordChange: false,

            lastLogin: dateDaysAgo(1)
        },

        {
            name: "Ahmed Manager",
            email: "manager@erp.com",
            password: PASSWORD,
            phone: makePhone(2),

            role: "Manager",
            status: "Active",

            isActive: true,
            isVerified: true,

            forcePasswordChange: false,

            lastLogin: dateDaysAgo(2)
        },

        {
            name: "Mona HR",
            email: "hr@erp.com",
            password: PASSWORD,
            phone: makePhone(3),

            role: "Manager",
            status: "Active",

            isActive: true,
            isVerified: true,

            lastLogin: dateDaysAgo(3)
        },

        {
            name: "Omar Sales",
            email: "sales@erp.com",
            password: PASSWORD,
            phone: makePhone(4),

            role: "Employee",
            status: "Active",

            isActive: true,
            isVerified: true
        },

        {
            name: "Sara Warehouse",
            email: "warehouse@erp.com",
            password: PASSWORD,
            phone: makePhone(5),

            role: "Employee",
            status: "Active",

            isActive: true,
            isVerified: true
        },

        {
            name: "Youssef Accountant",
            email: "accountant@erp.com",
            password: PASSWORD,
            phone: makePhone(6),

            role: "Employee",
            status: "Active",

            isActive: true,
            isVerified: true
        },

        {
            name: "Nour Developer",
            email: "developer@erp.com",
            password: PASSWORD,
            phone: makePhone(7),

            role: "Employee",
            status: "Active",

            isActive: true,
            isVerified: true
        },

        {
            name: "Karim Support",
            email: "support@erp.com",
            password: PASSWORD,
            phone: makePhone(8),

            role: "Employee",
            status: "Active",

            isActive: true,
            isVerified: true
        },

        {
            name: "Hana Procurement",
            email: "procurement@erp.com",
            password: PASSWORD,
            phone: makePhone(9),

            role: "Employee",
            status: "Active",

            isActive: true,
            isVerified: true
        },

        {
            name: "Mostafa Analyst",
            email: "analyst@erp.com",
            password: PASSWORD,
            phone: makePhone(10),

            role: "Employee",
            status: "Inactive",

            isActive: false,
            isVerified: true
        },

        {
            name: "Laila Employee",
            email: "laila@erp.com",
            password: PASSWORD,
            phone: makePhone(11),

            role: "Employee",
            status: "Active",

            isActive: true,
            isVerified: true
        },

        {
            name: "Khaled Employee",
            email: "khaled@erp.com",
            password: PASSWORD,
            phone: makePhone(12),

            role: "Employee",
            status: "Suspended",

            isActive: false,
            isVerified: true
        }

    ]);

    return users;

};

/* =========================================================
   DEPARTMENTS
========================================================= */

const createDepartments = async users => {

    const admin = users[0];
    const manager = users[1];
    const hrManager = users[2];

    return Department.create([

        {
            name: "Management",
            code: "MGT",
            description:
                "Executive and management operations",

            manager: manager._id,

            createdBy: admin._id,
            updatedBy: admin._id
        },

        {
            name: "Human Resources",
            code: "HR",
            description:
                "Employee and HR operations",

            manager: hrManager._id,

            createdBy: admin._id,
            updatedBy: admin._id
        },

        {
            name: "Sales",
            code: "SAL",
            description:
                "Sales and customer operations",

            manager: manager._id,

            createdBy: admin._id,
            updatedBy: admin._id
        },

        {
            name: "Warehouse",
            code: "WH",
            description:
                "Inventory and warehouse operations",

            manager: manager._id,

            createdBy: admin._id,
            updatedBy: admin._id
        },

        {
            name: "Finance",
            code: "FIN",
            description:
                "Finance and payment operations",

            manager: hrManager._id,

            createdBy: admin._id,
            updatedBy: admin._id
        },

        {
            name: "IT",
            code: "IT",
            description:
                "Technology and system operations",

            manager: manager._id,

            createdBy: admin._id,
            updatedBy: admin._id
        }

    ]);

};

/* =========================================================
   EMPLOYEES
========================================================= */

const createEmployees = async (
    users,
    departments
) => {

    const admin = users[0];

    const managerUser = users[1];

    const hrManagerUser = users[2];

    const departmentByCode = code => {

        return departments.find(
            department =>
                department.code === code
        )._id;

    };

    const definitions = [

        [
            users[1],
            "EMP-001",
            "MGT",
            "Operations Manager",
            "Full Time",
            32000
        ],

        [
            users[2],
            "EMP-002",
            "HR",
            "HR Manager",
            "Full Time",
            28000
        ],

        [
            users[3],
            "EMP-003",
            "SAL",
            "Sales Executive",
            "Full Time",
            17000
        ],

        [
            users[4],
            "EMP-004",
            "WH",
            "Warehouse Specialist",
            "Full Time",
            15000
        ],

        [
            users[5],
            "EMP-005",
            "FIN",
            "Accountant",
            "Full Time",
            19000
        ],

        [
            users[6],
            "EMP-006",
            "IT",
            "Software Developer",
            "Full Time",
            26000
        ],

        [
            users[7],
            "EMP-007",
            "SAL",
            "Customer Support",
            "Full Time",
            14000
        ],

        [
            users[8],
            "EMP-008",
            "WH",
            "Procurement Officer",
            "Contract",
            16000
        ],

        [
            users[9],
            "EMP-009",
            "FIN",
            "Financial Analyst",
            "Part Time",
            12000
        ],

        [
            users[10],
            "EMP-010",
            "HR",
            "HR Specialist",
            "Full Time",
            15500
        ],

        [
            users[11],
            "EMP-011",
            "WH",
            "Warehouse Assistant",
            "Intern",
            7000
        ]

    ];

    const employees =
        await Employee.create(

            definitions.map(
                ([
                    user,
                    employeeCode,
                    departmentCode,
                    jobTitle,
                    employmentType,
                    salary
                ]) => ({

                    user: user._id,

                    employeeCode,

                    department:
                        departmentByCode(
                            departmentCode
                        ),

                    jobTitle,

                    employmentType,

                    hireDate:
                        randomDate(
                            new Date("2023-01-01"),
                            new Date()
                        ),

                    salary,

                    isActive:
                        user.isActive,

                    createdBy:
                        admin._id,

                    updatedBy:
                        admin._id

                })
            )

        );

    const managerEmployee =
        employees.find(
            employee =>
                employee.user.toString() ===
                managerUser._id.toString()
        );

    const hrManagerEmployee =
        employees.find(
            employee =>
                employee.user.toString() ===
                hrManagerUser._id.toString()
        );

    for (
        const employee of employees
    ) {

        if (

            employee._id.equals(
                managerEmployee._id
            )

            ||

            employee._id.equals(
                hrManagerEmployee._id
            )

        ) {

            continue;

        }

        const manager =
            employee.department.equals(
                departmentByCode("HR")
            )

                ? hrManagerEmployee

                : managerEmployee;

        employee.manager =
            manager._id;

        await employee.save();

    }

    return Employee.find({}).lean();

};

/* =========================================================
   CATEGORIES
========================================================= */

const createCategories = async adminId => {

    const parents =
        await Category.create([

            {
                name: "Electronics",
                code: "ELEC",
                description:
                    "Electronic devices",

                createdBy: adminId,
                updatedBy: adminId
            },

            {
                name: "Office Supplies",
                code: "OFF",
                description:
                    "Office equipment and supplies",

                createdBy: adminId,
                updatedBy: adminId
            },

            {
                name: "Furniture",
                code: "FURN",
                description:
                    "Office furniture",

                createdBy: adminId,
                updatedBy: adminId
            },

            {
                name: "Networking",
                code: "NET",
                description:
                    "Networking equipment",

                createdBy: adminId,
                updatedBy: adminId
            },

            {
                name: "Accessories",
                code: "ACC",
                description:
                    "Computer and office accessories",

                createdBy: adminId,
                updatedBy: adminId
            }

        ]);

    const children =
        await Category.create([

            {
                name: "Laptops",
                code: "LAP",

                parent:
                    parents[0]._id,

                createdBy: adminId,
                updatedBy: adminId
            },

            {
                name: "Monitors",
                code: "MON",

                parent:
                    parents[0]._id,

                createdBy: adminId,
                updatedBy: adminId
            },

            {
                name: "Printers",
                code: "PRN",

                parent:
                    parents[1]._id,

                createdBy: adminId,
                updatedBy: adminId
            }

        ]);

    return [
        ...children,
        ...parents
    ];

};

/* =========================================================
   PRODUCTS
========================================================= */

const createProducts = async (
    categories,
    adminId
) => {

    const names = [

        ["Dell Latitude 5440", 700, 950, "LAP"],

        ["HP ProBook 450", 650, 890, "LAP"],

        ["Lenovo ThinkPad E14", 680, 920, "LAP"],

        ["MacBook Air M2", 900, 1250, "LAP"],

        ["Samsung 24 Monitor", 150, 230, "MON"],

        ["LG 27 Monitor", 220, 330, "MON"],

        ["Dell 27 Monitor", 250, 370, "MON"],

        ["HP LaserJet Pro", 180, 270, "PRN"],

        ["Canon Office Printer", 210, 310, "PRN"],

        ["Epson EcoTank", 260, 390, "PRN"],

        ["Logitech Keyboard", 25, 45, "ACC"],

        ["Logitech Mouse", 15, 30, "ACC"],

        ["Mechanical Keyboard", 45, 80, "ACC"],

        ["Wireless Mouse", 25, 50, "ACC"],

        ["USB-C Hub", 30, 65, "ACC"],

        ["Webcam Full HD", 35, 75, "ACC"],

        ["Noise Cancelling Headset", 60, 110, "ACC"],

        ["Office Desk", 130, 220, "FURN"],

        ["Executive Desk", 260, 420, "FURN"],

        ["Office Chair", 100, 180, "FURN"],

        ["Executive Chair", 220, 360, "FURN"],

        ["Filing Cabinet", 80, 140, "FURN"],

        ["Meeting Table", 300, 500, "FURN"],

        ["24 Port Switch", 120, 190, "NET"],

        ["8 Port Switch", 45, 80, "NET"],

        ["WiFi Router", 55, 100, "NET"],

        ["Access Point", 70, 125, "NET"],

        ["Network Rack", 250, 400, "NET"],

        ["Cat6 Cable 305m", 90, 140, "NET"],

        ["External SSD 1TB", 75, 125, "ELEC"]

    ];

    const categoryMap =
        new Map(

            categories.map(
                category => [
                    category.code,
                    category._id
                ]
            )

        );

    return Product.create(

        names.map(
            (
                [
                    name,
                    purchasePrice,
                    sellingPrice,
                    categoryCode
                ],
                index
            ) => ({

                name,

                sku:
                    `SKU-${String(index + 1).padStart(4, "0")}`,

                barcode:
                    `622${String(100000000 + index)}`,

                category:
                    categoryMap.get(
                        categoryCode
                    ),

                description:
                    `${name} - ERP demo product`,

                purchasePrice,

                sellingPrice,

                unit: "piece",

                minStock:
                    rand(5, 20),

                image: null,

                isActive:
                    index !== 29,

                createdBy: adminId,

                updatedBy: adminId

            })
        )

    );

};

/* =========================================================
   WAREHOUSES
========================================================= */

const createWarehouses = async adminId => {

    return Warehouse.create([

        {
            name: "Main Warehouse",
            code: "WH-01",
            location: "Cairo",
            description:
                "Main central warehouse",

            createdBy: adminId,
            updatedBy: adminId
        },

        {
            name: "Alexandria Warehouse",
            code: "WH-02",
            location: "Alexandria",
            description:
                "Alexandria distribution warehouse",

            createdBy: adminId,
            updatedBy: adminId
        },

        {
            name: "Giza Warehouse",
            code: "WH-03",
            location: "Giza",
            description:
                "Giza regional warehouse",

            createdBy: adminId,
            updatedBy: adminId
        },

        {
            name: "Showroom Stock",
            code: "WH-04",
            location: "New Cairo",
            description:
                "Showroom and display stock",

            createdBy: adminId,
            updatedBy: adminId
        }

    ]);

};

/* =========================================================
   SUPPLIERS
========================================================= */

const createSuppliers = async adminId => {

    const names = [

        "TechSource Egypt",
        "Cairo Electronics",
        "Nile Office Solutions",
        "Future Networks",
        "Smart Devices Co",
        "Delta Furniture",
        "Prime IT Supplies",
        "Modern Business Supplies",
        "Cairo Hardware",
        "Enterprise Solutions"

    ];

    return Supplier.create(

        names.map(
            (name, index) => ({

                name,

                code:
                    `SUP-${String(index + 1).padStart(3, "0")}`,

                email:
                    `supplier${index + 1}@example.com`,

                phone:
                    makePhone(100 + index),

                address:
                    `${pick([
                        "Cairo",
                        "Giza",
                        "Alexandria",
                        "Mansoura"
                    ])} Industrial Zone`,

                taxNumber:
                    `TAX-${100000 + index}`,

                notes:
                    "ERP demo supplier",

                isActive:
                    index !== 9,

                createdBy: adminId,
                updatedBy: adminId

            })
        )

    );

};

/* =========================================================
   CUSTOMERS
========================================================= */

const createCustomers = async adminId => {

    const firstNames = [

        "Mohamed",
        "Ahmed",
        "Omar",
        "Youssef",
        "Mahmoud",
        "Mostafa",
        "Karim",
        "Hassan",
        "Tarek",
        "Amr",
        "Mariam",
        "Sara",
        "Nour",
        "Hana"

    ];

    const lastNames = [

        "Ali",
        "Hassan",
        "Ibrahim",
        "Mahmoud",
        "Khaled",
        "Samir",
        "Adel",
        "Fathy"

    ];

    return Customer.create(

        Array.from(
            { length: 35 },

            (_, index) => ({

                name:
                    `${pick(firstNames)} ${pick(lastNames)}`,

                code:
                    `CUS-${String(index + 1).padStart(4, "0")}`,

                email:
                    `customer${index + 1}@example.com`,

                phone:
                    makePhone(200 + index),

                address:
                    `${pick([
                        "Cairo",
                        "Giza",
                        "Alexandria",
                        "Mansoura",
                        "Tanta"
                    ])} - Egypt`,

                taxNumber:
                    index % 3 === 0
                        ? `CTAX-${50000 + index}`
                        : null,

                creditLimit:
                    rand(0, 10) * 1000,

                notes:
                    index % 5 === 0
                        ? "VIP customer"
                        : null,

                isActive:
                    index !== 34,

                createdBy: adminId,
                updatedBy: adminId

            })

        )

    );

};

/* =========================================================
   PURCHASES
========================================================= */

const createPurchases = async (
    products,
    suppliers,
    warehouses,
    adminId
) => {

    const purchases = [];

    for (
        let index = 0;
        index < 50;
        index++
    ) {

        const createdAt =
            randomBusinessDate();

        const status =
            pick([

                "Received",
                "Received",
                "Received",

                "Confirmed",
                "Confirmed",

                "Draft",

                "Cancelled"

            ]);

        const selectedProducts =
            getItems(
                products,
                rand(2, 4)
            );

        const items =
            selectedProducts.map(
                product => {

                    const quantity =
                        rand(5, 40);

                    const unitPrice =
                        product.purchasePrice;

                    return {

                        product:
                            product._id,

                        quantity,

                        unitPrice,

                        total:
                            money(
                                quantity *
                                unitPrice
                            )

                    };

                }
            );

        const subtotal =
            money(

                items.reduce(
                    (sum, item) =>
                        sum + item.total,

                    0
                )

            );

        const discount =
            money(
                subtotal *
                pick([
                    0,
                    0.03,
                    0.05,
                    0.08
                ])
            );

        const tax =
            money(
                (subtotal - discount) *
                0.10
            );

        const total =
            money(
                subtotal -
                discount +
                tax
            );

        purchases.push({

            supplier:
                pick(suppliers)._id,

            warehouse:
                pick(warehouses)._id,

            items,

            subtotal,

            discount,

            tax,

            total,

            status,

            receivedAt:
                status === "Received"

                    ? new Date(
                        createdAt.getTime() +
                        rand(1, 5) *
                        86400000
                    )

                    : null,

            receivedBy:
                status === "Received"
                    ? adminId
                    : null,

            notes:
                status === "Cancelled"
                    ? "Cancelled demo purchase"
                    : "ERP demo purchase",

            createdBy: adminId,

            updatedBy: adminId,

            createdAt,

            updatedAt: createdAt

        });

    }

    return Purchase.create(
        purchases
    );

};

/* =========================================================
   SALES
========================================================= */

const createSales = async (
    products,
    customers,
    warehouses,
    adminId,
    stockBalance
) => {

    const sales = [];

    for (
        let index = 0;
        index < 70;
        index++
    ) {

        const createdAt =
            randomBusinessDate();

        const status =
            pick([

                "Confirmed",
                "Confirmed",
                "Confirmed",
                "Confirmed",

                "Draft",

                "Cancelled"

            ]);

        const warehouse =
            pick(warehouses);

        const candidateProducts =
            getItems(
                products,
                rand(2, 4)
            );

        const items = [];

        for (
            const product of candidateProducts
        ) {

            const key =
                `${warehouse._id}:${product._id}`;

            const available =
                stockBalance.get(key) ?? 0;

            if (
                status === "Confirmed" &&
                available < 1
            ) {

                continue;

            }

            const quantity =
                status === "Confirmed"

                    ? Math.max(
                        1,
                        Math.min(
                            rand(1, 8),
                            Math.floor(
                                available
                            )
                        )
                    )

                    : rand(1, 8);

            if (
                status === "Confirmed"
            ) {

                stockBalance.set(

                    key,

                    available -
                    quantity

                );

            }

            items.push({

                product:
                    product._id,

                quantity,

                unitPrice:
                    product.sellingPrice,

                total:
                    money(
                        quantity *
                        product.sellingPrice
                    )

            });

        }

        if (!items.length) {

            index--;

            continue;

        }

        const subtotal =
            money(

                items.reduce(
                    (sum, item) =>
                        sum + item.total,

                    0
                )

            );

        const discount =
            money(
                subtotal *
                pick([
                    0,
                    0.02,
                    0.05,
                    0.10
                ])
            );

        const tax =
            money(
                (subtotal - discount) *
                0.10
            );

        const total =
            money(
                subtotal -
                discount +
                tax
            );

        sales.push({

            customer:
                pick(customers)._id,

            warehouse:
                warehouse._id,

            items,

            subtotal,

            discount,

            tax,

            total,

            paymentMethod:
                pick([
                    "Cash",
                    "Card",
                    "Bank",
                    "Credit"
                ]),

            status,

            notes:
                status === "Cancelled"
                    ? "Cancelled demo sale"
                    : "ERP demo sale",

            confirmedAt:
                status === "Confirmed"

                    ? new Date(
                        createdAt.getTime() +
                        rand(1, 24) *
                        3600000
                    )

                    : null,

            confirmedBy:
                status === "Confirmed"
                    ? adminId
                    : null,

            createdBy:
                adminId,

            updatedBy:
                adminId,

            createdAt,

            updatedAt:
                createdAt

        });

    }

    return Sale.create(
        sales
    );

};

/* =========================================================
   INVOICES + PAYMENTS
========================================================= */

const createInvoicesAndPayments = async (
    sales,
    adminId
) => {

    const invoices = [];

    const payments = [];

    const invoiceStatusPool = [

        "Paid",
        "Paid",
        "Paid",

        "PartiallyPaid",
        "PartiallyPaid",

        "Unpaid",

        "Cancelled"

    ];

    for (
        const sale of sales
    ) {

        if (
            ![
                "Confirmed",
                "Cancelled"
            ].includes(sale.status)
        ) {

            continue;

        }

        const issueDate =
            sale.confirmedAt ||
            sale.createdAt;

        const status =
            sale.status === "Cancelled"

                ? "Cancelled"

                : pick(
                    invoiceStatusPool
                );

        let paidAmount = 0;

        if (
            status === "Paid"
        ) {

            paidAmount =
                sale.total;

        }

        else if (
            status === "PartiallyPaid"
        ) {

            paidAmount =
                money(

                    sale.total *
                    pick([
                        0.25,
                        0.40,
                        0.50,
                        0.65,
                        0.75
                    ])

                );

        }

        const remainingAmount =
            status === "Cancelled"

                ? 0

                : money(
                    sale.total -
                    paidAmount
                );

        const invoice =
            await Invoice.create({

                invoiceNumber:
                    `INV-${String(
                        invoices.length + 1
                    ).padStart(5, "0")}`,

                sale:
                    sale._id,

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

                paidAmount,

                remainingAmount,

                status,

                issueDate,

                dueDate:

                    status === "Paid" ||
                    status === "Cancelled"

                        ? null

                        : new Date(
                            issueDate.getTime() +
                            rand(7, 30) *
                            86400000
                        ),

                notes:
                    "ERP demo invoice",

                createdBy:
                    adminId,

                updatedBy:
                    adminId,

                createdAt:
                    issueDate,

                updatedAt:
                    issueDate

            });

        invoices.push(invoice);

        if (
            paidAmount > 0
        ) {

            payments.push({

                invoice:
                    invoice._id,

                customer:
                    sale.customer,

                amount:
                    paidAmount,

                method:

                    sale.paymentMethod ===
                    "Credit"

                        ? pick([
                            "Cash",
                            "Card",
                            "Bank"
                        ])

                        : sale.paymentMethod,

                reference:
                    `PAY-${String(
                        payments.length + 1
                    ).padStart(5, "0")}`,

                notes:
                    "ERP demo payment",

                paymentDate:
                    new Date(
                        issueDate.getTime() +
                        rand(0, 7) *
                        86400000
                    ),

                createdBy:
                    adminId,

                updatedBy:
                    adminId

            });

        }

    }

    if (
        payments.length
    ) {

        await Payment.create(
            payments
        );

    }

    return invoices;

};

/* =========================================================
   STOCK + STOCK TRANSACTIONS
========================================================= */

const createStockAndTransactions = async (
    products,
    warehouses,
    purchases,
    sales,
    adminId
) => {

    const balance =
        new Map();

    const transactions =
        [];

    const addBalance = (
        warehouseId,
        productId,
        quantity
    ) => {

        const key =
            `${warehouseId}:${productId}`;

        balance.set(

            key,

            (
                balance.get(key) ||
                0
            ) + quantity

        );

    };

    /* Initial stock */

    for (
        const product of products
    ) {

        for (
            const warehouse of warehouses
        ) {

            addBalance(

                warehouse._id,

                product._id,

                rand(
                    product.minStock + 5,
                    product.minStock + 60
                )

            );

        }

    }

    /* Purchases */

    for (
        const purchase of purchases
    ) {

        if (
            purchase.status !==
            "Received"
        ) {

            continue;

        }

        for (
            const item of purchase.items
        ) {

            addBalance(

                purchase.warehouse,

                item.product,

                item.quantity

            );

            transactions.push({

                product:
                    item.product,

                warehouse:
                    purchase.warehouse,

                type:
                    "IN",

                quantity:
                    item.quantity,

                reference:
                    `PURCHASE-${purchase._id}`,

                notes:
                    "Stock received from purchase",

                createdBy:
                    adminId,

                createdAt:
                    purchase.receivedAt ||
                    purchase.createdAt,

                updatedAt:
                    purchase.receivedAt ||
                    purchase.createdAt

            });

        }

    }

    /* Sales */

    for (
        const sale of sales
    ) {

        if (
            sale.status !==
            "Confirmed"
        ) {

            continue;

        }

        for (
            const item of sale.items
        ) {

            const key =
                `${sale.warehouse}:${item.product}`;

            const current =
                balance.get(key) || 0;

            balance.set(

                key,

                Math.max(
                    0,
                    current -
                    item.quantity
                )

            );

            transactions.push({

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
                    "Stock issued for confirmed sale",

                createdBy:
                    adminId,

                createdAt:
                    sale.confirmedAt ||
                    sale.createdAt,

                updatedAt:
                    sale.confirmedAt ||
                    sale.createdAt

            });

        }

    }

    /* Stock documents */

    const stockDocuments = [];

    for (
        const product of products
    ) {

        for (
            const warehouse of warehouses
        ) {

            const key =
                `${warehouse._id}:${product._id}`;

            let quantity =
                Math.max(
                    0,
                    Math.floor(
                        balance.get(key) || 0
                    )
                );

            /*
             * Force some low-stock products
             * for Dashboard alerts.
             */

            if (
                product._id.equals(
                    products[0]._id
                )
            ) {

                quantity =
                    Math.max(
                        0,
                        product.minStock - 2
                    );

            }

            if (
                product._id.equals(
                    products[1]._id
                )
            ) {

                quantity =
                    product.minStock;

            }

            stockDocuments.push({

                product:
                    product._id,

                warehouse:
                    warehouse._id,

                quantity,

                createdBy:
                    adminId,

                updatedBy:
                    adminId

            });

        }

    }

    const stocks =
        await Stock.create(
            stockDocuments
        );

    /* Manual adjustments */

    const adjustmentProducts =
        products.slice(0, 8);

    for (
        const product of adjustmentProducts
    ) {

        const warehouse =
            pick(warehouses);

        transactions.push({

            product:
                product._id,

            warehouse:
                warehouse._id,

            type:
                "ADJUSTMENT",

            quantity:
                rand(1, 5),

            reference:
                `ADJ-${rand(
                    10000,
                    99999
                )}`,

            notes:
                "Manual inventory adjustment",

            createdBy:
                adminId,

            createdAt:
                randomBusinessDate(),

            updatedAt:
                new Date()

        });

    }

    await StockTransaction.create(
        transactions
    );

    return stocks;

};

/* =========================================================
   ATTENDANCE
========================================================= */

const createAttendance = async (
    employees,
    adminId
) => {

    const records = [];

    const startDate =
        dateDaysAgo(90);

    for (
        const employee of employees
    ) {

        for (
            let day = 0;
            day < 90;
            day++
        ) {

            const date =
                new Date(startDate);

            date.setDate(
                startDate.getDate() +
                day
            );

            date.setHours(
                0,
                0,
                0,
                0
            );

            const weekday =
                date.getDay();

            /*
             * Friday + Saturday
             * weekend
             */

            if (
                weekday === 5 ||
                weekday === 6
            ) {

                continue;

            }

            const status =
                pick([

                    "Present",
                    "Present",
                    "Present",
                    "Present",

                    "Late",
                    "Late",

                    "Absent",

                    "Leave"

                ]);

            let checkIn =
                null;

            let checkOut =
                null;

            if (
                [
                    "Present",
                    "Late"
                ].includes(status)
            ) {

                checkIn =
                    new Date(date);

                checkIn.setHours(

                    status === "Late"
                        ? rand(9, 10)
                        : rand(8, 9),

                    rand(0, 59),

                    0,

                    0

                );

                checkOut =
                    new Date(date);

                checkOut.setHours(

                    rand(16, 18),

                    rand(0, 59),

                    0,

                    0

                );

            }

            records.push({

                employee:
                    employee._id,

                date,

                checkIn,

                checkOut,

                status,

                notes:
                    status === "Late"
                        ? "Late arrival"
                        : null,

                createdBy:
                    adminId,

                updatedBy:
                    adminId

            });

        }

    }

    return Attendance.insertMany(
        records,
        {
            ordered: false
        }
    );

};

/* =========================================================
   LEAVES
========================================================= */

const createLeaves = async (
    employees,
    users,
    adminId
) => {

    const records = [];

    const leaveStatuses = [

        "Pending",

        "Approved",
        "Approved",

        "Rejected",

        "Cancelled"

    ];

    const leaveTypes = [

        "Annual",
        "Sick",
        "Emergency",
        "Unpaid"

    ];

    for (
        let index = 0;
        index < 28;
        index++
    ) {

        const employee =
            pick(employees);

        const startDate =
            randomDate(
                dateDaysAgo(150),
                dateDaysAgo(5)
            );

        const duration =
            rand(1, 5);

        const endDate =
            new Date(startDate);

        endDate.setDate(
            endDate.getDate() +
            duration -
            1
        );

        const status =
            pick(leaveStatuses);

        const reviewed =
            status !== "Pending";

        records.push({

            employee:
                employee._id,

            type:
                pick(leaveTypes),

            startDate,

            endDate,

            reason:
                pick([

                    "Annual vacation",

                    "Personal matter",

                    "Family emergency",

                    "Medical appointment",

                    "Personal leave"

                ]),

            status,

            reviewedBy:
                reviewed
                    ? pick(
                        users.slice(0, 3)
                    )._id
                    : null,

            reviewedAt:
                reviewed
                    ? new Date(
                        startDate.getTime() -
                        86400000
                    )
                    : null,

            rejectionReason:
                status === "Rejected"

                    ? "Leave balance or business requirements"

                    : null,

            createdBy:
                adminId,

            updatedBy:
                adminId

        });

    }

    return Leave.create(
        records
    );

};

/* =========================================================
   NOTIFICATIONS
========================================================= */

const createNotifications = async (
    users,
    invoices,
    products,
    adminId
) => {

    const notifications = [];

    const templates = [

        [
            "INFO",
            "Daily Summary",
            "Your ERP daily summary is ready.",
            "Reports",
            null
        ],

        [
            "SUCCESS",
            "Payment Received",
            "A customer payment was recorded successfully.",
            "Payment",
            null
        ],

        [
            "WARNING",
            "Low Stock Alert",
            "One or more products have reached the minimum stock level.",
            "Stock",
            products[0]?._id
        ],

        [
            "WARNING",
            "Pending Leave",
            "There are leave requests waiting for review.",
            "Leave",
            null
        ],

        [
            "ERROR",
            "Invoice Overdue",
            "An invoice requires payment attention.",
            "Invoice",
            invoices[0]?._id
        ]

    ];

    for (
        let index = 0;
        index < 30;
        index++
    ) {

        const [
            type,
            title,
            message,
            module,
            resourceId
        ] =
            pick(templates);

        const user =
            pick(users);

        const createdAt =
            randomBusinessDate();

        const isRead =
            index % 3 === 0;

        notifications.push({

            recipient:
                user._id,

            title,

            message,

            type,

            module,

            resourceId:
                resourceId ||
                null,

            isRead,

            readAt:

                isRead

                    ? new Date(
                        createdAt.getTime() +
                        rand(1, 48) *
                        3600000
                    )

                    : null,

            createdAt,

            updatedAt:
                createdAt

        });

    }

    return Notification.create(
        notifications
    );

};

/* =========================================================
   AUDIT LOGS
========================================================= */

const createAuditLogs = async (
    users,
    documents,
    adminId
) => {

    const modules =
        Object.entries(
            documents
        );

    const actions = [

        "LOGIN",

        "CREATE",
        "CREATE",

        "UPDATE",
        "UPDATE",

        "DELETE",

        "RESTORE",

        "CONFIRM",

        "CANCEL",

        "RECEIVE",

        "PAYMENT"

    ];

    const logs = [];

    for (
        let index = 0;
        index < 120;
        index++
    ) {

        const [
            module,
            resources
        ] =
            pick(modules);

        const resource =
            resources.length
                ? pick(resources)
                : null;

        const action =
            pick(actions);

        const user =
            pick(users);

        const createdAt =
            randomBusinessDate();

        logs.push({

            user:
                user?._id ||
                adminId,

            action,

            module,

            resourceId:
                resource?._id ||
                null,

            description:
                `${action} action performed on ${module}`,

            ipAddress:
                `192.168.1.${rand(
                    10,
                    250
                )}`,

            userAgent:
                "ERP Demo Browser",

            metadata: {

                demo: true,

                source: "seed",

                index

            },

            createdAt,

            updatedAt:
                createdAt

        });

    }

    return AuditLog.create(
        logs
    );

};

/* =========================================================
   MAIN SEED
========================================================= */

const seed = async () => {

    if (
        !process.env.MONGO_URI
    ) {

        throw new Error(
            "MONGO_URI is missing from .env"
        );

    }

    console.log(
        "🌱 Starting ERP seed..."
    );

    await mongoose.connect(
        process.env.MONGO_URI
    );

    console.log(
        "✅ MongoDB connected"
    );

    await clearDatabase();

    console.log(
        "🧹 Database cleared"
    );

    /* =========================
       USERS
    ========================= */

    const users =
        await createUsers();

    console.log(
        `👤 Users: ${users.length}`
    );

    const adminId =
        users[0]._id;

    /* =========================
       DEPARTMENTS
    ========================= */

    const departments =
        await createDepartments(
            users
        );

    console.log(
        `🏢 Departments: ${departments.length}`
    );

    /* =========================
       EMPLOYEES
    ========================= */

    const employees =
        await createEmployees(
            users,
            departments
        );

    console.log(
        `👨‍💼 Employees: ${employees.length}`
    );

    /* =========================
       CATEGORIES
    ========================= */

    const categories =
        await createCategories(
            adminId
        );

    console.log(
        `🏷️ Categories: ${categories.length}`
    );

    /* =========================
       PRODUCTS
    ========================= */

    const products =
        await createProducts(
            categories,
            adminId
        );

    console.log(
        `📦 Products: ${products.length}`
    );

    /* =========================
       WAREHOUSES
    ========================= */

    const warehouses =
        await createWarehouses(
            adminId
        );

    console.log(
        `🏭 Warehouses: ${warehouses.length}`
    );

    /* =========================
       SUPPLIERS
    ========================= */

    const suppliers =
        await createSuppliers(
            adminId
        );

    console.log(
        `🚚 Suppliers: ${suppliers.length}`
    );

    /* =========================
       CUSTOMERS
    ========================= */

    const customers =
        await createCustomers(
            adminId
        );

    console.log(
        `👥 Customers: ${customers.length}`
    );

    /* =========================
       PURCHASES
    ========================= */

    const purchases =
        await createPurchases(

            products,

            suppliers,

            warehouses,

            adminId

        );

    console.log(
        `🛒 Purchases: ${purchases.length}`
    );

    /* =====================================================
       SALES GENERATION BALANCE

       This is only used while generating
       sales so confirmed sales don't
       exceed available demo stock.
    ===================================================== */

    const salesGenerationBalance =
        new Map();

    for (
        const product of products
    ) {

        for (
            const warehouse of warehouses
        ) {

            const key =
                `${warehouse._id}:${product._id}`;

            salesGenerationBalance.set(
                key,
                rand(30, 100)
            );

        }

    }

    for (
        const purchase of purchases
    ) {

        if (
            purchase.status !==
            "Received"
        ) {

            continue;

        }

        for (
            const item of purchase.items
        ) {

            const key =
                `${purchase.warehouse}:${item.product}`;

            salesGenerationBalance.set(

                key,

                (
                    salesGenerationBalance.get(
                        key
                    ) || 0
                ) +
                item.quantity

            );

        }

    }

    /* =========================
       SALES
    ========================= */

    const sales =
        await createSales(

            products,

            customers,

            warehouses,

            adminId,

            salesGenerationBalance

        );

    console.log(
        `💰 Sales: ${sales.length}`
    );

    /* =========================
       INVOICES + PAYMENTS
    ========================= */

    const invoices =
        await createInvoicesAndPayments(

            sales,

            adminId

        );

    console.log(
        `🧾 Invoices: ${invoices.length}`
    );

    console.log(
        `💳 Payments: ${await Payment.countDocuments()}`
    );

    /* =========================
       STOCK
    ========================= */

    const stocks =
        await createStockAndTransactions(

            products,

            warehouses,

            purchases,

            sales,

            adminId

        );

    console.log(
        `📊 Stock records: ${stocks.length}`
    );

    console.log(
        `🔄 Stock transactions: ${await StockTransaction.countDocuments()}`
    );

    /* =========================
       ATTENDANCE
    ========================= */

    const attendance =
        await createAttendance(

            employees,

            adminId

        );

    console.log(
        `🕘 Attendance: ${attendance.length}`
    );

    /* =========================
       LEAVES
    ========================= */

    const leaves =
        await createLeaves(

            employees,

            users,

            adminId

        );

    console.log(
        `🌴 Leaves: ${leaves.length}`
    );

    /* =========================
       NOTIFICATIONS
    ========================= */

    const notifications =
        await createNotifications(

            users,

            invoices,

            products,

            adminId

        );

    console.log(
        `🔔 Notifications: ${notifications.length}`
    );

    /* =========================
       AUDIT LOGS
    ========================= */

    const auditLogs =
        await createAuditLogs(

            users,

            {

                User:
                    users,

                Department:
                    departments,

                Employee:
                    employees,

                Category:
                    categories,

                Product:
                    products,

                Warehouse:
                    warehouses,

                Stock:
                    stocks,

                Supplier:
                    suppliers,

                Purchase:
                    purchases,

                Customer:
                    customers,

                Sale:
                    sales,

                Invoice:
                    invoices

            },

            adminId

        );

    console.log(
        `📝 Audit logs: ${auditLogs.length}`
    );

    /* =========================
       DONE
    ========================= */

    console.log(
        "\n===================================="
    );

    console.log(
        "🎉 ERP seed completed successfully"
    );

    console.log(
        "===================================="
    );

    console.log(
        "Login:"
    );

    console.log(
        "Email: admin@erp.com"
    );

    console.log(
        `Password: ${PASSWORD}`
    );

    console.log(
        "====================================\n"
    );

};

/* =========================================================
   RUN
========================================================= */

seed()

    .catch(error => {

        console.error(
            "❌ Seed failed:"
        );

        console.error(
            error
        );

        process.exitCode = 1;

    })

    .finally(
        async () => {

            await mongoose.disconnect();

        }
    );