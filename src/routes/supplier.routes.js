import { Router } from "express";

import * as supplierController
    from "../controllers/supplier.controller.js";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

import {
    idValidation,
    createSupplierValidation,
    updateSupplierValidation,
    getSuppliersValidation
} from "../validations/supplier.validation.js";

const router = Router();

router.get(

    "/",

    auth,

    getSuppliersValidation,

    validate,

    supplierController.getSuppliers

);

router.post(

    "/",

    auth,

    authorize("Admin"),

    createSupplierValidation,

    validate,

    supplierController.createSupplier

);

router.get(

    "/:id",

    auth,

    idValidation,

    validate,

    supplierController.getSupplierById

);

router.put(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    updateSupplierValidation,

    validate,

    supplierController.updateSupplier

);

router.delete(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    supplierController.deleteSupplier

);

router.patch(

    "/:id/restore",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    supplierController.restoreSupplier

);

export default router;