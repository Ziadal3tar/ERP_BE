import User from "../models/user.model.js";
import BaseRepository from "./BaseRepository.js";

class UserRepository extends BaseRepository {

    constructor() {

        super(User);

    }

    async findOne(filter, options = {}) {

        let query = this.model.findOne(filter);

        if (options.selectPassword) {
            query = query.select("+password");
        }

        if (options.select) {
            query = query.select(options.select);
        }

        if (options.populate) {
            query = query.populate(options.populate);
        }

        return await query;

    }

    async findLastEmployee() {

        return await this.model
            .findOne({
                employeeCode: {
                    $exists: true
                }
            })
            .sort({
                createdAt: -1
            });

    }

}

export default new UserRepository();