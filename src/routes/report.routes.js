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



router.get(

    "/dashboard",

    auth,

    authorize("Admin"),

    reportController.getDashboardSummary

);



router.get(

    "/sales",

    auth,

    authorize("Admin"),

    salesReportValidation,

    validate,

    reportController.getSalesReport

);



router.get(

    "/purchases",

    auth,

    authorize("Admin"),

    purchasesReportValidation,

    validate,

    reportController.getPurchasesReport

);



router.get(

    "/stock",

    auth,

    authorize("Admin"),

    reportController.getStockReport

);



router.get(

    "/low-stock",

    auth,

    authorize("Admin"),

    reportController.getLowStock

);

export default router;