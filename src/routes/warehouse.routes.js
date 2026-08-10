import { Router } from "express";

import * as warehouseController
    from "../controllers/warehouse.controller.js";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

import {
    idValidation,
    createWarehouseValidation,
    updateWarehouseValidation,
    getWarehousesValidation
} from "../validations/warehouse.validation.js";

const router = Router();

router.get(

    "/",

    auth,

    getWarehousesValidation,

    validate,

    warehouseController.getWarehouses

);

router.post(

    "/",

    auth,

    authorize("Admin"),

    createWarehouseValidation,

    validate,

    warehouseController.createWarehouse

);

router.get(

    "/:id",

    auth,

    idValidation,

    validate,

    warehouseController.getWarehouseById

);

router.put(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    updateWarehouseValidation,

    validate,

    warehouseController.updateWarehouse

);

router.delete(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    warehouseController.deleteWarehouse

);

router.patch(

    "/:id/restore",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    warehouseController.restoreWarehouse

);

export default router;