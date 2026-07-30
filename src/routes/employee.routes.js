import { Router } from "express";

import * as employeeController from "../controllers/employee.controller.js";

import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

import {

    idValidation,

    createEmployeeValidation,

    updateEmployeeValidation,

    getEmployeesValidation, changeSalaryValidation, changeDepartmentValidation

} from "../validations/employee.validation.js";

const router = Router();

router.get(

    "/",

    auth,

    authorize("Admin"),

    getEmployeesValidation,

    validate,

    employeeController.getEmployees

);

router.post(

    "/",

    auth,

    authorize("Admin"),

    createEmployeeValidation,

    validate,

    employeeController.createEmployee

);

router.get(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    employeeController.getEmployeeById

);

router.put(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    updateEmployeeValidation,

    validate,

    employeeController.updateEmployee

);

router.delete(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    employeeController.deleteEmployee

);

router.patch(

    "/:id/restore",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    employeeController.restoreEmployee

);
router.patch(

    "/:id/department",

    auth,

    authorize("Admin"),

    idValidation,

    changeDepartmentValidation,

    validate,

    employeeController.changeDepartment

);
router.patch(

    "/:id/salary",

    auth,

    authorize("Admin"),

    idValidation,

    changeSalaryValidation,

    validate,

    employeeController.changeSalary

);
export default router;