import Purchase from "../models/purchase.model.js";
import BaseRepository from "./BaseRepository.js";

class PurchaseRepository extends BaseRepository {

    constructor() {

        super(Purchase);

    }

}

export default new PurchaseRepository();