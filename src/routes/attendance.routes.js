import { Router } from "express";

import * as attendanceController
    from "../controllers/attendance.controller.js";

import auth from "../middleware/auth.middleware.js";

import authorize from "../middleware/authorize.js";

import validate from "../middleware/validate.js";

import {

    idValidation,

    checkInValidation,

    checkOutValidation,

    createAttendanceValidation,

    updateAttendanceValidation,

    getAttendanceValidation

} from "../validations/attendance.validation.js";

const router = Router();

router.post(

    "/check-in",

    auth,

    checkInValidation,

    validate,

    attendanceController.checkIn

);

router.patch(

    "/check-out",

    auth,

    checkOutValidation,

    validate,

    attendanceController.checkOut

);

router.get(

    "/me",

    auth,

    getAttendanceValidation,

    validate,

    attendanceController.getMyAttendance

);

router.post(

    "/",

    auth,

    authorize("Admin"),

    createAttendanceValidation,

    validate,

    attendanceController.createAttendance

);

router.get(

    "/",

    auth,

    authorize("Admin"),

    getAttendanceValidation,

    validate,

    attendanceController.getAttendance

);

router.get(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    attendanceController.getAttendanceById

);

router.put(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    updateAttendanceValidation,

    validate,

    attendanceController.updateAttendance

);

router.delete(

    "/:id",

    auth,

    authorize("Admin"),

    idValidation,

    validate,

    attendanceController.deleteAttendance

);

export default router;