import { Router } from "express";

import * as auditLogController
    from "../controllers/auditLog.controller.js";

import auth
    from "../middleware/auth.middleware.js";

import authorize
    from "../middleware/authorize.js";

import validate
    from "../middleware/validate.js";

import {
    idValidation,
    getAuditLogsValidation
} from "../validations/auditLog.validation.js";

const router = Router();

router.get(

    "/",

    auth,

    authorize("Admin"),

    getAuditLogsValidation,

    validate,

    auditLogController.getAuditLogs

);

router.get(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    auditLogController.getAuditLogById

);

export default router;