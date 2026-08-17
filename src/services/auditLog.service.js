import auditLogRepository
    from "../repositories/auditLog.repository.js";

class AuditLogService {

    async createLog({
        user,
        action,
        module,
        resourceId = null,
        description,
        ipAddress = null,
        userAgent = null,
        metadata = null
    }) {

        return await auditLogRepository.create({

            user,

            action,

            module,

            resourceId,

            description,

            ipAddress,

            userAgent,

            metadata

        });

    }

    async getLogs(query = {}) {

        const page =
            Number(query.page) || 1;

        const limit =
            Number(query.limit) || 20;

        const skip =
            (page - 1) * limit;

        const filter = {};

        if (query.user) {

            filter.user =
                query.user;

        }

        if (query.module) {

            filter.module =
                query.module;

        }

        if (query.action) {

            filter.action =
                query.action;

        }

        const total =
            await auditLogRepository.count(
                filter
            );

        const data =
            await auditLogRepository.find(

                filter,

                {

                    skip,

                    limit,

                    sort: {
                        createdAt: -1
                    },

                    populate: [

                        {
                            path: "user",

                            select:
                                "name email role"

                        }

                    ]

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

    async getLogById(id) {

        return await auditLogRepository.findOne(

            {
                _id: id
            },

            {

                populate: [

                    {
                        path: "user",

                        select:
                            "name email role"

                    }

                ]

            }

        );

    }

}

export default new AuditLogService();