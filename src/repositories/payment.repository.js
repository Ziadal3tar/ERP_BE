import Payment from "../models/payment.model.js";
import BaseRepository from "./BaseRepository.js";

class PaymentRepository extends BaseRepository {

    constructor() {
        super(Payment);
    }

}

export default new PaymentRepository();