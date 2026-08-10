import { Router } from "express";

import * as purchaseController
    from "../controllers/purchase.controller.js";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

import {
    idValidation,
    createPurchaseValidation,
    getPurchasesValidation
} from "../validations/purchase.validation.js";

const router = Router();



router.get(

    "/",

    auth,

    getPurchasesValidation,

    validate,

    purchaseController.getPurchases

);

router.post(

    "/",

    auth,

    authorize("Admin"),

    createPurchaseValidation,

    validate,

    purchaseController.createPurchase

);

router.get(

    "/:id",

    auth,

    idValidation,

    validate,

    purchaseController.getPurchaseById

);

router.patch(

    "/:id/confirm",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    purchaseController.confirmPurchase

);

router.patch(

    "/:id/receive",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    purchaseController.receivePurchase

);

router.patch(

    "/:id/cancel",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    purchaseController.cancelPurchase

);

export default router;