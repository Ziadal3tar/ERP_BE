import { Router } from "express";

import * as saleController
    from "../controllers/sale.controller.js";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

import {
    idValidation,
    createSaleValidation,
    getSalesValidation
} from "../validations/sale.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Get Sales
|--------------------------------------------------------------------------
*/

router.get(

    "/",

    auth,

    getSalesValidation,

    validate,

    saleController.getSales

);

/*
|--------------------------------------------------------------------------
| Create Sale
|--------------------------------------------------------------------------
*/

router.post(

    "/",

    auth,

    authorize("Admin"),

    createSaleValidation,

    validate,

    saleController.createSale

);

/*
|--------------------------------------------------------------------------
| Get Sale
|--------------------------------------------------------------------------
*/

router.get(

    "/:id",

    auth,

    idValidation,

    validate,

    saleController.getSaleById

);

/*
|--------------------------------------------------------------------------
| Confirm Sale
|--------------------------------------------------------------------------
*/

router.patch(

    "/:id/confirm",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    saleController.confirmSale

);

/*
|--------------------------------------------------------------------------
| Cancel Sale
|--------------------------------------------------------------------------
*/

router.patch(

    "/:id/cancel",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    saleController.cancelSale

);

export default router;