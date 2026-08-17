import { Router } from "express";

import * as paymentController
    from "../controllers/payment.controller.js";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

import {
    invoiceIdValidation,
    idValidation,
    createPaymentValidation,
    getPaymentsValidation
} from "../validations/payment.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Get Payments
|--------------------------------------------------------------------------
*/

router.get(

    "/",

    auth,

    getPaymentsValidation,

    validate,

    paymentController.getPayments

);

/*
|--------------------------------------------------------------------------
| Create Payment
|--------------------------------------------------------------------------
*/

router.post(

    "/invoice/:invoiceId",

    auth,

    authorize("Admin"),

    invoiceIdValidation,

    createPaymentValidation,

    validate,

    paymentController.createPayment

);

/*
|--------------------------------------------------------------------------
| Get Payment
|--------------------------------------------------------------------------
*/

router.get(

    "/:id",

    auth,

    idValidation,

    validate,

    paymentController.getPaymentById

);

export default router;