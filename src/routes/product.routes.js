import { Router } from "express";

import * as productController
    from "../controllers/product.controller.js";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

import {
    idValidation,
    createProductValidation,
    updateProductValidation,
    getProductsValidation
} from "../validations/product.validation.js";

const router = Router();

router.get(

    "/",

    auth,

    getProductsValidation,

    validate,

    productController.getProducts

);

router.post(

    "/",

    auth,

    authorize("Admin"),

    createProductValidation,

    validate,

    productController.createProduct

);

router.get(

    "/:id",

    auth,

    idValidation,

    validate,

    productController.getProductById

);

router.put(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    updateProductValidation,

    validate,

    productController.updateProduct

);

router.delete(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    productController.deleteProduct

);

router.patch(

    "/:id/restore",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    productController.restoreProduct

);

export default router;