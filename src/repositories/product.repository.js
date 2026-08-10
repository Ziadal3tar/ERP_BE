import Product from "../models/product.model.js";
import BaseRepository from "./BaseRepository.js";

class ProductRepository extends BaseRepository {

    constructor() {

        super(Product);

    }

}

export default new ProductRepository();