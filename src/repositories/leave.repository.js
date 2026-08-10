import Leave from "../models/leave.model.js";
import BaseRepository from "./BaseRepository.js";

class LeaveRepository extends BaseRepository {

    constructor() {

        super(Leave);

    }

}

export default new LeaveRepository();