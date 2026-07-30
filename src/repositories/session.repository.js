import Session from "../models/session.model.js";

class SessionRepository {

    async create(data) {

        return await Session.create(data);

    }

async findByRefreshTokenHash(refreshTokenHash) {

    return await Session.findOne({

        refreshTokenHash

    }).populate("user");

}

    async findByUser(userId) {

        return await Session.find({
            user: userId
        });

    }

    async deleteById(id) {

        return await Session.findByIdAndDelete(id);

    }

async deleteByRefreshTokenHash(refreshTokenHash) {

    return await Session.findOneAndDelete({

        refreshTokenHash

    });

}

    async deleteAllByUser(userId) {

        return await Session.deleteMany({
            user: userId
        });

    }


async deleteExpiredSessions() {

    return await Session.deleteMany({

        expiresAt: {

            $lt: new Date()

        }

    });

}

async findById(id){

    return await Session.findById(id);

}
}


export default new SessionRepository();