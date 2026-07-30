import { Router } from "express";
import * as departmentController from "../controllers/department.controller.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

import {
    getDepartmentsValidation,
    createDepartmentValidation,
    updateDepartmentValidation,
    idValidation,
    changeManagerValidation
} from "../validations/department.validation.js";
const router = Router();

router.get(
    "/",
    auth,
    authorize("Admin"),
    getDepartmentsValidation,
    validate,
    departmentController.getDepartments
);

router.post(
    "/",
    auth,
    authorize("Admin"),
    createDepartmentValidation,
    validate,
    departmentController.createDepartment
);

router.get(
    "/:id",
    auth,
    authorize("Admin"),
    idValidation,
    validate,
    departmentController.getDepartmentById
);

router.patch(
    "/:id/manager",
    auth,
    authorize("Admin"),
    idValidation,
    changeManagerValidation,
    validate,
    departmentController.changeManager
);

router.delete(
    "/:id",
    auth,
    authorize("Admin"),
    idValidation,
    validate,
    departmentController.deleteDepartment
);

router.patch(
    "/:id/restore",
    auth,
    authorize("Admin"),
    idValidation,
    validate,
    departmentController.restoreDepartment
);
router.patch(

    "/:id/remove-manager",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    departmentController.removeManager

);

router.put(
    "/:id",
    auth,
    authorize("Admin"),
    idValidation,
    updateDepartmentValidation,
    validate,
    departmentController.updateDepartment
);
export default router;