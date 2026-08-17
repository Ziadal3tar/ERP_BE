import notificationRepository
    from "../repositories/notification.repository.js";

import AppError
    from "../utils/AppError.js";

class NotificationService {

    

    async createNotification(data) {

        return await notificationRepository.create({

            recipient: data.recipient,

            title: data.title,

            message: data.message,

            type: data.type || "INFO",

            module: data.module || null,

            resourceId:
                data.resourceId || null

        });

    }

    

    async getMyNotifications(
        userId,
        query = {}
    ) {

        const page =
            Number(query.page) || 1;

        const limit =
            Number(query.limit) || 20;

        const skip =
            (page - 1) * limit;

        const filter = {
            recipient: userId
        };

        if (query.isRead !== undefined) {

            filter.isRead =
                query.isRead === "true";

        }

        const total =
            await notificationRepository.count(
                filter
            );

        const data =
            await notificationRepository.find(

                filter,

                {

                    skip,

                    limit,

                    sort: {
                        createdAt: -1
                    }

                }

            );

        return {

            data,

            pagination: {

                total,

                page,

                limit,

                totalPages:
                    Math.ceil(
                        total / limit
                    )

            }

        };

    }

    

    async getUnreadCount(userId) {

        const count =
            await notificationRepository.count({

                recipient: userId,

                isRead: false

            });

        return {
            count
        };

    }

    

    async markAsRead(
        id,
        userId
    ) {

        const notification =
            await notificationRepository.findOne({

                _id: id,

                recipient: userId

            });

        if (!notification) {

            throw new AppError(
                "Notification not found",
                404
            );

        }

        if (!notification.isRead) {

            notification.isRead = true;

            notification.readAt =
                new Date();

            await notificationRepository.save(
                notification
            );

        }

        return notification;

    }

    

    async markAllAsRead(userId) {

        await notificationRepository.updateMany(

            {
                recipient: userId,

                isRead: false
            },

            {
                isRead: true,

                readAt: new Date()
            }

        );

        return {
            message:
                "All notifications marked as read"
        };

    }

    

    async deleteNotification(
        id,
        userId
    ) {

        const notification =
            await notificationRepository.findOne({

                _id: id,

                recipient: userId

            });

        if (!notification) {

            throw new AppError(
                "Notification not found",
                404
            );

        }

        await notificationRepository.deleteById(
            id
        );

        return true;

    }

}

export default new NotificationService();