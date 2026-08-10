import { Router } from "express";

import * as customerController
    from "../controllers/customer.controller.js";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

import {
    idValidation,
    createCustomerValidation,
    updateCustomerValidation,
    getCustomersValidation
} from "../validations/customer.validation.js";

const router = Router();

router.get(
    "/",
    auth,
    getCustomersValidation,
    validate,
    customerController.getCustomers
);

router.post(
    "/",
    auth,
    authorize("Admin"),
    createCustomerValidation,
    validate,
    customerController.createCustomer
);

router.get(
    "/:id",
    auth,
    idValidation,
    validate,
    customerController.getCustomerById
);

router.put(
    "/:id",
    auth,
    authorize("Admin"),
    idValidation,
    updateCustomerValidation,
    validate,
    customerController.updateCustomer
);

router.delete(
    "/:id",
    auth,
    authorize("Admin"),
    idValidation,
    validate,
    customerController.deleteCustomer
);

router.patch(
    "/:id/restore",
    auth,
    authorize("Admin"),
    idValidation,
    validate,
    customerController.restoreCustomer
);

export default router;