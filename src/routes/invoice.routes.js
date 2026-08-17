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



router.get(

    "/",

    auth,

    getInvoicesValidation,

    validate,

    invoiceController.getInvoices

);



router.post(

    "/sale/:saleId",

    auth,

    authorize("Admin"),

    saleIdValidation,

    validate,

    invoiceController.createInvoiceFromSale

);



router.get(

    "/:id",

    auth,

    idValidation,

    validate,

    invoiceController.getInvoiceById

);



router.patch(

    "/:id/cancel",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    invoiceController.cancelInvoice

);

export default router;