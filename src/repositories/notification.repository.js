import Notification from "../models/notification.model.js";
import BaseRepository from "./BaseRepository.js";

class NotificationRepository extends BaseRepository {

    constructor() {
        super(Notification);
    }

}

export default new NotificationRepository();