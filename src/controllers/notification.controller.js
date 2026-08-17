import asyncHandler
    from "../utils/asyncHandler.js";

import notificationService
    from "../services/notification.service.js";

import * as response
    from "../utils/apiResponse.js";

export const getMyNotifications =
    asyncHandler(
        async (req, res) => {

            const result =
                await notificationService
                    .getMyNotifications(

                        req.user._id,

                        req.query

                    );

            response.paginated(

                res,

                result.data,

                result.pagination

            );

        }
    );

export const getUnreadCount =
    asyncHandler(
        async (req, res) => {

            const result =
                await notificationService
                    .getUnreadCount(

                        req.user._id

                    );

            response.success(
                res,
                result
            );

        }
    );

export const markAsRead =
    asyncHandler(
        async (req, res) => {

            const notification =
                await notificationService
                    .markAsRead(

                        req.params.id,

                        req.user._id

                    );

            response.success(

                res,

                notification,

                "Notification marked as read"

            );

        }
    );

export const markAllAsRead =
    asyncHandler(
        async (req, res) => {

            const result =
                await notificationService
                    .markAllAsRead(

                        req.user._id

                    );

            response.success(
                res,
                result
            );

        }
    );

export const deleteNotification =
    asyncHandler(
        async (req, res) => {

            await notificationService
                .deleteNotification(

                    req.params.id,

                    req.user._id

                );

            response.success(

                res,

                null,

                "Notification deleted successfully"

            );

        }
    );