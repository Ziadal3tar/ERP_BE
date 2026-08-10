import { Router } from "express";
import * as employeeController from "../controllers/employee.controller.js";
import auth from "../middleware/auth.middleware.js";

import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

import * as employeeValidation from "../validations/employee.validation.js";

const router = Router();
router.get(
    "/",
    auth,
    authorize("Admin"),
    employeeValidation.getEmployeesValidation,
    validate,
    employeeController.getEmployees
);
router.post(
    "/",
    auth,
    authorize("Admin"),
    employeeValidation.createEmployeeValidation,
    validate,
    employeeController.createEmployee
);
router.get(
    "/:id",
    auth,
    authorize("Admin"),
    employeeValidation.idValidation,
    validate,
    employeeController.getEmployeeById
);
router.put(
    "/:id",
    auth,
    authorize("Admin"),
    employeeValidation.idValidation,
    employeeValidation.updateEmployeeValidation,
    validate,
    employeeController.updateEmployee
);
router.delete(
    "/:id",
    auth,
    authorize("Admin"),
    employeeValidation.idValidation,
    validate,
    employeeController.deleteEmployee
);

router.patch(
    "/:id/restore",
    auth,
    authorize("Admin"),
    employeeValidation.idValidation,
    validate,
    employeeController.restoreEmployee
);
router.patch(
    "/:id/department",
    auth,
    authorize("Admin"),
    employeeValidation.idValidation,
    employeeValidation.changeDepartmentValidation,
    validate,
    employeeController.changeDepartment
);
router.patch(
    "/:id/salary",
    auth,
    authorize("Admin"),
    employeeValidation.idValidation,
    employeeValidation.changeSalaryValidation,
    validate,
    employeeController.changeSalary
);
// router.patch(
//     "/:id/manager",
//     auth,
//     authorize("Admin"),
//     employeeValidation.idValidation,
//     employeeValidation.changeManagerValidation,
//     validate,
//     employeeController.changeManager
// );
// router.patch(
//     "/:id/remove-manager",
//     auth,
//     authorize("Admin"),
//     employeeValidation.idValidation,
//     employeeValidation.removeManagerValidation,
//     validate,
//     employeeController.removeManager
// );
export default router;