import Invoice from "../models/invoice.model.js";
import BaseRepository from "./BaseRepository.js";

class InvoiceRepository extends BaseRepository {

    constructor() {
        super(Invoice);
    }

}

export default new InvoiceRepository();