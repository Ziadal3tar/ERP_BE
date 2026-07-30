import Employee from "../models/employee.model.js";
import BaseRepository from "./BaseRepository.js";

class EmployeeRepository extends BaseRepository {

    constructor() {

        super(Employee);

    }

}

export default new EmployeeRepository();