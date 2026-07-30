import DepartmentRepository from "../repositories/department.repository.js";
import UserRepository from "../repositories/user.repository.js";
import AppError from "../utils/AppError.js";

const departmentRepository = new DepartmentRepository();
const userRepository = new UserRepository();
class DepartmentService {

    async createDepartment(data, userId) {
  const code = data.code
            .trim()
            .toUpperCase();
        const exists = await departmentRepository.findOne({

            $or: [

                {
                    name: {
                        $regex: `^${data.name.trim()}$`,
                        $options: "i"
                    }
                },

                { code: data.code }

            ]

        });

        if (exists) {

            throw new AppError(

                "Department already exists",

                400

            );

        }

        if (data.manager) {

            const manager = await userRepository.findById(data.manager);

            if (!manager) {

                throw new AppError(

                    "Manager not found",

                    404

                );

            }

        }
      

        data.code = code;
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

        if (data.code) {
            conditions.push({
                code: data.code
            });
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

        // 1- منع حذف القسم إذا كان يحتوي على مستخدمين
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

        // 2- منع حذف القسم إذا كان له مدير
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