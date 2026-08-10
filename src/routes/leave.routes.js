import { Router } from "express";

import * as leaveController
    from "../controllers/leave.controller.js";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

import {
    idValidation,
    createLeaveValidation,
    createAdminLeaveValidation,
    rejectLeaveValidation,
    getLeavesValidation
} from "../validations/leave.validation.js";

const router = Router();

router.post(

    "/",

    auth,

    createLeaveValidation,

    validate,

    leaveController.createLeave

);

router.get(

    "/me",

    auth,

    getLeavesValidation,

    validate,

    leaveController.getMyLeaves

);

router.patch(

    "/:id/cancel",

    auth,

    idValidation,

    validate,

    leaveController.cancelLeave

);

router.post(

    "/admin",

    auth,

    authorize("Admin"),

    createAdminLeaveValidation,

    validate,

    leaveController.createAdminLeave

);

router.get(

    "/",

    auth,

    authorize("Admin"),

    getLeavesValidation,

    validate,

    leaveController.getLeaves

);

router.get(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    leaveController.getLeaveById

);

router.patch(

    "/:id/approve",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    leaveController.approveLeave

);

router.patch(

    "/:id/reject",

    auth,

    authorize("Admin"),

    idValidation,

    rejectLeaveValidation,

    validate,

    leaveController.rejectLeave

);

export default router;