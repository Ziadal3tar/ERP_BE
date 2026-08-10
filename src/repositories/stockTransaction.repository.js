import StockTransaction from "../models/stockTransaction.model.js";
import BaseRepository from "./BaseRepository.js";

class StockTransactionRepository extends BaseRepository {

    constructor() {
        super(StockTransaction);
    }

}

export default new StockTransactionRepository();