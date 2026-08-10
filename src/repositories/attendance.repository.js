import Attendance from "../models/attendance.model.js";
import BaseRepository from "./BaseRepository.js";

class AttendanceRepository extends BaseRepository {

    constructor() {

        super(Attendance);

    }

}

export default new AttendanceRepository();