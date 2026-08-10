import Stock from "../models/stock.model.js";
import BaseRepository from "./BaseRepository.js";

class StockRepository extends BaseRepository {

    constructor() {

        super(Stock);

    }

}

export default new StockRepository();