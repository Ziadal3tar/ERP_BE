import Sale from "../models/sale.model.js";
import BaseRepository from "./BaseRepository.js";

class SaleRepository extends BaseRepository {

    constructor() {
        super(Sale);
    }

}

export default new SaleRepository();