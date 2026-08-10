import { Router } from "express";

import * as invoiceController
    from "../controllers/invoice.controller.js";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

import {
    idValidation,
    saleIdValidation,
    getInvoicesValidation
} from "../validations/invoice.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Get Invoices
|--------------------------------------------------------------------------
*/

router.get(

    "/",

    auth,

    getInvoicesValidation,

    validate,

    invoiceController.getInvoices

);

/*
|--------------------------------------------------------------------------
| Create Invoice From Sale
|--------------------------------------------------------------------------
*/

router.post(

    "/sale/:saleId",

    auth,

    authorize("Admin"),

    saleIdValidation,

    validate,

    invoiceController.createInvoiceFromSale

);

/*
|--------------------------------------------------------------------------
| Get Invoice
|--------------------------------------------------------------------------
*/

router.get(

    "/:id",

    auth,

    idValidation,

    validate,

    invoiceController.getInvoiceById

);

/*
|--------------------------------------------------------------------------
| Cancel Invoice
|--------------------------------------------------------------------------
*/

router.patch(

    "/:id/cancel",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    invoiceController.cancelInvoice

);

export default router;