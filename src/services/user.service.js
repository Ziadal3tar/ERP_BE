import userRepository from "../repositories/user.repository.js";
import generateEmployeeCode from "../utils/generateEmployeeCode.js";
import AppError from "../utils/AppError.js";
class UserService {

    async getUsers(query) {

        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.max(Number(query.limit) || 10, 1);
        const skip = (page - 1) * limit;

        const filter = {};

        // Search
        if (query.search) {

            filter.$or = [
                {
                    name: {
                        $regex: query.search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: query.search,
                        $options: "i"
                    }
                },
                {
                    employeeCode: {
                        $regex: query.search,
                        $options: "i"
                    }
                }
                ,
                {
                    phone: {
                        $regex: query.search,
                        $options: "i"
                    }
                }
            ];

        }

        // Filters
        if (query.role) {

            filter.role = query.role;

        }

        if (query.status) {

            filter.status = query.status;

        }

        if (query.isVerified !== undefined) {

            filter.isVerified = query.isVerified === "true";

        }

        if (query.isActive !== undefined) {

            filter.isActive = query.isActive === "true";

        }

        const sort = {};

        if (query.sortBy) {

            sort[query.sortBy] =
                query.order === "asc" ? 1 : -1;

        } else {

            sort.createdAt = -1;

        }

        const users = await userRepository.find(

            filter,

            {

                skip,

                limit,

                sort,

                populate: "department"

            }

        );

        const total = await userRepository.count(filter);

        return {

            data: users,

            pagination: {

                total,

                page,

                limit,

                totalPages: Math.ceil(total / limit)

            }

        };

    }
    async getUserById(id) {

        const user = await userRepository.findById(

            id,

            {

                populate: [

                    "department",

                    "createdBy",

                    "updatedBy"

                ]

            }

        );

        if (!user) {

            throw new AppError(

                "User not found",

                404

            );

        }

        return user;

    }

    async getCurrentUser(userId) {

        const user = await userRepository.findById(

            userId,

            {

                populate: [

                    "department"

                ]

            }

        );

        if (!user) {

            throw new AppError(

                "User not found",

                404

            );

        }

        return user;

    }

    async createUser(data, adminId) {

        const exists =
            await userRepository.exists({

                email: data.email

            });

        if (exists) {


            throw new AppError(

                "Email already exists",

                409

            );
        }

        data.employeeCode =
            await generateEmployeeCode();

        data.createdBy = adminId;

        data.forcePasswordChange = true;

        const user =
            await userRepository.create(data);

        return user;

    }


    async updateProfile(userId, data) {

        const user = await userRepository.findById(userId);

        if (!user) {

            throw new AppError(

                "User not found",

                404

            );

        }

        const allowedFields = [

            "name",

            "phone",

            "avatar"

        ];

        allowedFields.forEach(field => {

            if (data[field] !== undefined) {

                user[field] = data[field];

            }

        });

        await userRepository.save(user);

        return user;

    }
    async updateProfile(userId, data) {

        const user = await userRepository.findById(userId);

        if (!user) {

            throw new AppError(

                "User not found",

                404

            );

        }

        const allowedFields = [

            "name",

            "phone",

            "avatar"

        ];

        allowedFields.forEach(field => {

            if (data[field] !== undefined) {

                user[field] = data[field];

            }

        });

        await userRepository.save(user);

        return user;

    }
    async deleteUser(id, adminId) {

        const user = await userRepository.findById(id);
if(id.toString()==adminId.toString()){

    throw new AppError(

        "You can't delete your own account",

        400

    );

}
        if (!user) {

            throw new AppError(

                "User not found",

                404

            );

        }

        user.isActive = false;
        user.status = "Inactive";
        user.updatedBy = adminId;
        await userRepository.save(user);

        return user;

    }

    async restoreUser(id, adminId) {

        const user = await userRepository.findById(id);

        if (!user) {

            throw new AppError(

                "User not found",

                404

            );

        }

        user.isActive = true;
        user.status = "Active";
        user.updatedBy = adminId;
        await userRepository.save(user);

        return user;

    }

    async changeRole(id, role, adminId) {

        const user = await userRepository.findById(id);
if (id.toString() === adminId.toString()) {

    throw new AppError(

        "You can't change your own role",

        400

    );

}
        if (!user) {

            throw new AppError(

                "User not found",

                404

            );

        }

        user.role = role;

        user.updatedBy = adminId;

        await userRepository.save(user);

        return user;

    }

    async changeStatus(id, active, adminId) {

        const user = await userRepository.findById(id);

        if (!user) {

            throw new AppError(

                "User not found",

                404

            );

        }

        user.isActive = active;

        user.status = active

            ? "Active"

            : "Inactive";

        user.updatedBy = adminId;

        await userRepository.save(user);

        return user;

    }
    async resetPassword(id, password, adminId) {

        const user = await userRepository.findById(

            id,

            {

                selectPassword: true

            }

        );
if(id.toString()==adminId.toString()){

    throw new AppError(

        "Use Change Password endpoint",

        400

    );

}
        if (!user) {

            throw new AppError(

                "User not found",

                404

            );

        }

        user.password = password;

        user.forcePasswordChange = true;

        user.updatedBy = adminId;

        await userRepository.save(user);

    }
}

export default new UserService();