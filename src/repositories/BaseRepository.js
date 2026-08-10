class BaseRepository {

    constructor(model) {

        this.model = model;

    }

    async find(filter = {}, options = {}) {

        let query = this.model.find(filter);

        if (options.select)
            query = query.select(options.select);

        if (options.populate)
            query = query.populate(options.populate);

        if (options.sort)
            query = query.sort(options.sort);

        if (options.skip !== undefined)
            query = query.skip(options.skip);

        if (options.limit !== undefined)
            query = query.limit(options.limit);

        return await query;

    }

    async findOne(filter = {}, options = {}) {

        let query = this.model.findOne(filter);

        if (options.select)
            query = query.select(options.select);

        if (options.populate)
            query = query.populate(options.populate);

        return await query;

    }

  async findById(id, options = {}) {

    return this.model
        .findById(id)
        .setOptions(options);

}

    async create(data) {

        return await this.model.create(data);

    }

    async save(document) {

        return await document.save();

    }

    async count(filter = {}) {

        return await this.model.countDocuments(filter);

    }

    async exists(filter = {}) {

        return await this.model.exists(filter);

    }

}

export default BaseRepository;