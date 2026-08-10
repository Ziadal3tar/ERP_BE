import Category from "../models/category.model.js";
import BaseRepository from "./BaseRepository.js";

class CategoryRepository extends BaseRepository {

    constructor() {

        super(Category);

    }

}

export default new CategoryRepository();