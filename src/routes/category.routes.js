import { Router } from "express";

import * as categoryController
    from "../controllers/category.controller.js";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

import {
    idValidation,
    createCategoryValidation,
    updateCategoryValidation,
    getCategoriesValidation
} from "../validations/category.validation.js";

const router = Router();



router.get(

    "/",

    auth,

    getCategoriesValidation,

    validate,

    categoryController.getCategories

);

router.post(

    "/",

    auth,

    authorize("Admin"),

    createCategoryValidation,

    validate,

    categoryController.createCategory

);

router.get(

    "/:id",

    auth,

    idValidation,

    validate,

    categoryController.getCategoryById

);

router.put(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    updateCategoryValidation,

    validate,

    categoryController.updateCategory

);

router.delete(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    categoryController.deleteCategory

);

router.patch(

    "/:id/restore",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    categoryController.restoreCategory

);

export default router;