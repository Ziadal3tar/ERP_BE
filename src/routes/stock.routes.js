import { Router } from "express";

import * as stockController
    from "../controllers/stock.controller.js";

import auth from "../middleware/auth.middleware.js";

import authorize from "../middleware/authorize.js";

import validate from "../middleware/validate.js";

import {
    stockInValidation,
    stockOutValidation,
    stockTransferValidation,
    getStockValidation,
    getStockHistoryValidation
} from "../validations/stock.validation.js";

const router = Router();



router.get(

    "/",

    auth,

    getStockValidation,

    validate,

    stockController.getStock

);

router.get(

    "/history",

    auth,

    getStockHistoryValidation,

    validate,

    stockController.getStockHistory

);

router.post(

    "/in",

    auth,

    authorize("Admin"),

    stockInValidation,

    validate,

    stockController.stockIn

);

router.post(

    "/out",

    auth,

    authorize("Admin"),

    stockOutValidation,

    validate,

    stockController.stockOut

);

router.post(

    "/transfer",

    auth,

    authorize("Admin"),

    stockTransferValidation,

    validate,

    stockController.transferStock

);

export default router;