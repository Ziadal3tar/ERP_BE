import { Router } from "express";

import * as reportController
    from "../controllers/report.controller.js";

import auth from "../middleware/auth.middleware.js";

import authorize
    from "../middleware/authorize.js";

import validate
    from "../middleware/validate.js";

import {
    salesReportValidation,
    purchasesReportValidation
} from "../validations/report.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(

    "/dashboard",

    auth,

    authorize("Admin"),

    reportController.getDashboardSummary

);

/*
|--------------------------------------------------------------------------
| Sales Report
|--------------------------------------------------------------------------
*/

router.get(

    "/sales",

    auth,

    authorize("Admin"),

    salesReportValidation,

    validate,

    reportController.getSalesReport

);

/*
|--------------------------------------------------------------------------
| Purchases Report
|--------------------------------------------------------------------------
*/

router.get(

    "/purchases",

    auth,

    authorize("Admin"),

    purchasesReportValidation,

    validate,

    reportController.getPurchasesReport

);

/*
|--------------------------------------------------------------------------
| Stock Report
|--------------------------------------------------------------------------
*/

router.get(

    "/stock",

    auth,

    authorize("Admin"),

    reportController.getStockReport

);

/*
|--------------------------------------------------------------------------
| Low Stock
|--------------------------------------------------------------------------
*/

router.get(

    "/low-stock",

    auth,

    authorize("Admin"),

    reportController.getLowStock

);

export default router;