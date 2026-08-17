import { Router } from "express";

import * as notificationController
    from "../controllers/notification.controller.js";

import auth
    from "../middleware/auth.middleware.js";

import validate
    from "../middleware/validate.js";

import {
    idValidation,
    getNotificationsValidation
} from "../validations/notification.validation.js";

const router = Router();



router.get(

    "/",

    auth,

    getNotificationsValidation,

    validate,

    notificationController.getMyNotifications

);



router.get(

    "/unread-count",

    auth,

    notificationController.getUnreadCount

);



router.patch(

    "/read-all",

    auth,

    notificationController.markAllAsRead

);



router.patch(

    "/:id/read",

    auth,

    idValidation,

    validate,

    notificationController.markAsRead

);



router.delete(

    "/:id",

    auth,

    idValidation,

    validate,

    notificationController.deleteNotification

);

export default router;