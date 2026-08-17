import auditLogService
    from "../services/auditLog.service.js";

const auditLogger = ({
    action,
    module,
    getResourceId,
    getDescription
}) => {

    return async (req, res, next) => {

        res.on("finish", async () => {

            /*
             * Only log successful requests
             */

            if (
                res.statusCode < 200 ||
                res.statusCode >= 300
            ) {
                return;
            }

            try {

                const resourceId =
                    getResourceId
                        ? getResourceId(req)
                        : null;

                const description =
                    getDescription
                        ? getDescription(req)
                        : `${action} ${module}`;

                await auditLogService.createLog({

                    user:
                        req.user?._id || null,

                    action,

                    module,

                    resourceId,

                    description,

                    ipAddress:
                        req.ip,

                    userAgent:
                        req.get("user-agent")

                });

            } catch (error) {

                /*
                 * Audit logging should
                 * never break the request.
                 */

                console.error(
                    "Audit log error:",
                    error.message
                );

            }

        });

        next();

    };

};

export default auditLogger;