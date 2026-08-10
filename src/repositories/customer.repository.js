import Customer from "../models/customer.model.js";
import BaseRepository from "./BaseRepository.js";

class CustomerRepository extends BaseRepository {

    constructor() {
        super(Customer);
    }

}

export default new CustomerRepository();