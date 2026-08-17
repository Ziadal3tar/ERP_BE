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

/*
|--------------------------------------------------------------------------
| My Notifications
|--------------------------------------------------------------------------
*/

router.get(

    "/",

    auth,

    getNotificationsValidation,

    validate,

    notificationController.getMyNotifications

);

/*
|--------------------------------------------------------------------------
| Unread Count
|--------------------------------------------------------------------------
*/

router.get(

    "/unread-count",

    auth,

    notificationController.getUnreadCount

);

/*
|--------------------------------------------------------------------------
| Mark All As Read
|--------------------------------------------------------------------------
*/

router.patch(

    "/read-all",

    auth,

    notificationController.markAllAsRead

);

/*
|--------------------------------------------------------------------------
| Mark One As Read
|--------------------------------------------------------------------------
*/

router.patch(

    "/:id/read",

    auth,

    idValidation,

    validate,

    notificationController.markAsRead

);

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

router.delete(

    "/:id",

    auth,

    idValidation,

    validate,

    notificationController.deleteNotification

);

export default router;