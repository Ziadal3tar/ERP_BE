import Warehouse from "../models/warehouse.model.js";
import BaseRepository from "./BaseRepository.js";

class WarehouseRepository extends BaseRepository {

    constructor() {

        super(Warehouse);

    }

}

export default new WarehouseRepository();