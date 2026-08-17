import AuditLog from "../models/auditLog.model.js";
import BaseRepository from "./BaseRepository.js";

class AuditLogRepository extends BaseRepository {

    constructor() {
        super(AuditLog);
    }

}

export default new AuditLogRepository();