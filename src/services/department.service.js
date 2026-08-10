import departmentRepository from "../repositories/department.repository.js";
import userRepository from "../repositories/user.repository.js";
import AppError from "../utils/AppError.js";

class DepartmentService {

async createDepartment(data, userId) {

    const exists = await departmentRepository.findOne({
        $or: [
            {
                name: {
                    $regex: `^${data.name.trim()}$`,
                    $options: "i"
                }
            },
            {
                code: data.code.trim().toUpperCase()
            }
        ]
    });

    if (exists) {

        throw new AppError(
            "Department already exists",
            400
        );

    }

    if (data.manager) {

        const manager =
            await userRepository.findById(data.manager);

        if (!manager) {

            throw new AppError(
                "Manager not found",
                404
            );

        }

    }

    data.code = data.code
        .trim()
        .toUpperCase();

    return await departmentRepository.create({

        ...data,

        createdBy: userId

    });

}

async updateDepartment(id, data, userId) {

    const department = await departmentRepository.findById(id);

    if (!department) {
        throw new AppError(
            "Department not found",
            404
        );
    }

    // Normalize Code
    if (data.code) {
        data.code = data.code
            .trim()
            .toUpperCase();
    }

    // Check duplicate name/code
    if (data.name || data.code) {

        const conditions = [];

        if (data.name) {
            conditions.push({
                name: {
                    $regex: `^${data.name.trim()}$`,
                    $options: "i"
                }
            });
        }

        const codeExists = await departmentRepository.findOne({
    code: data.code
});

if (codeExists && codeExists._id.toString() !== id) {

    throw new AppError(
        "Department code already exists",
        400
    );

}

        const exists = await departmentRepository.findOne({
            _id: { $ne: id },
            $or: conditions
        });

        if (exists) {
            throw new AppError(
                "Department name or code already exists",
                400
            );
        }
    }

    // Validate manager
    if (data.manager) {

        const manager = await userRepository.findById(data.manager);

        if (!manager) {
            throw new AppError(
                "Manager not found",
                404
            );
        }

    }

    // Allow only editable fields
    const allowedFields = [
        "name",
        "code",
        "description",
        "manager",
        "isActive"
    ];

    allowedFields.forEach(field => {

        if (data[field] !== undefined) {
            department[field] = data[field];
        }

    });

    department.updatedBy = userId;

    return await departmentRepository.save(department);

}
    async getDepartments(query) {

        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        if (query.search) {

            filter.$or = [

                {
                    name: {
                        $regex: query.search,
                        $options: "i"
                    }
                },

                {
                    code: {
                        $regex: query.search,
                        $options: "i"
                    }
                }

            ];

        }

        if (query.isActive !== undefined) {

            filter.isActive = query.isActive === "true";

        }

        const total = await departmentRepository.count(filter);

        const departments = await departmentRepository.find(

            filter,

            {
                skip,
                limit,
                sort: {
                    name: 1
                },
                populate: {

                    path: "manager",

                    select: "name email role"

                }
            }

        );

        return {

            data: departments,

            pagination: {

                total,

                page,

                limit,

                totalPages: Math.ceil(total / limit)

            }

        };

    }
async getDepartmentById(id) {

    const department = await departmentRepository.findById(id);

    if (!department) {

        throw new AppError(
            "Department not found",
            404
        );

    }

    const usersCount = await userRepository.count({
        department: id,
        isDeleted: false
    });

    return {

        ...department.toObject(),

        usersCount

    };

}
    async deleteDepartment(id, userId) {

        const department = await departmentRepository.findById(id);

        if (!department) {
            throw new AppError("Department not found", 404);
        }
if (!department.isActive) {

    throw new AppError(
        "Department already inactive",
        400
    );

}

        const usersCount = await userRepository.count({
            department: id,
            isDeleted: false
        });

        if (usersCount > 0) {
            throw new AppError(
                "Cannot deactivate department because it still contains users",
                400
            );
        }

        if (department.manager) {
            throw new AppError(
                "Remove or change the department manager first",
                400
            );
        }

        department.isActive = false;
        department.updatedBy = userId;

        return await departmentRepository.save(department);

    }
    async restoreDepartment(id, userId) {

        const department = await departmentRepository.findById(id);

        if (!department) {

            throw new AppError(

                "Department not found",

                404

            );

        }

        department.isActive = true;

        department.updatedBy = userId;

        return await departmentRepository.save(department);

    }

    async changeManager(id, managerId, adminId) {

        const department = await departmentRepository.findById(id);

        if (!department) {

            throw new AppError(

                "Department not found",

                404

            );

        }

        const manager = await userRepository.findById(managerId);

        if (!manager) {

            throw new AppError(

                "Manager not found",

                404

            );

        }

        department.manager = managerId;

        department.updatedBy = adminId;

        return await departmentRepository.save(department);

    }

    async removeManager(id, adminId) {

        const department = await departmentRepository.findById(id);

        if (!department) {
            throw new AppError("Department not found", 404);
        }

        department.manager = null;
        department.updatedBy = adminId;

        return await departmentRepository.save(department);

    }
}

export default new DepartmentService();