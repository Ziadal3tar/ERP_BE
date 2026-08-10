import Supplier from "../models/supplier.model.js";
import BaseRepository from "./BaseRepository.js";

class SupplierRepository extends BaseRepository {

    constructor() {
        super(Supplier);
    }

}

export default new SupplierRepository();