import asyncHandler
    from "../utils/asyncHandler.js";

import auditLogService
    from "../services/auditLog.service.js";

import * as response
    from "../utils/apiResponse.js";

export const getAuditLogs =
    asyncHandler(
        async (req, res) => {

            const result =
                await auditLogService.getLogs(
                    req.query
                );

            response.paginated(

                res,

                result.data,

                result.pagination

            );

        }
    );

export const getAuditLogById =
    asyncHandler(
        async (req, res) => {

            const log =
                await auditLogService.getLogById(
                    req.params.id
                );

            response.success(
                res,
                log
            );

        }
    );