import employeeRepository from "../repositories/employee.repository.js";
import userRepository from "../repositories/user.repository.js";
import departmentRepository from "../repositories/department.repository.js";
import AppError from "../utils/AppError.js";
import generateEmployeeCode from "../utils/generateEmployeeCode.js";

// const employeeRepository = new EmployeeRepository();
// const userRepository = new UserRepository();
// const departmentRepository = new DepartmentRepository();

class EmployeeService {
async createEmployee(data, adminId) {

    // 1. Check User
    const user = await userRepository.findById(data.user);

    if (!user) {

        throw new AppError(
            "User not found",
            404
        );

    }

    // 2. Check if user already has an employee profile
    const existingEmployee =
        await employeeRepository.findOne({
            user: data.user
        });

    if (existingEmployee) {

        throw new AppError(
            "This user already has an employee profile",
            409
        );

    }

    // 3. Check Department
    const department =
        await departmentRepository.findById(
            data.department
        );

    if (!department) {

        throw new AppError(
            "Department not found",
            404
        );

    }

    // 4. Department must be active
    if (!department.isActive) {

        throw new AppError(
            "Department is inactive",
            400
        );

    }

    // 5. User must be active
    if (!user.isActive) {

        throw new AppError(
            "User is inactive",
            400
        );

    }

    // 6. Generate Employee Code
    const employeeCode =
        await generateEmployeeCode();

    // 7. Create Employee
    const employee =
        await employeeRepository.create({

            ...data,

            employeeCode,

            createdBy: adminId

        });

    return employee;

}

    async getEmployeeById(id) {

        const employee =
            await employeeRepository.findById(id);

        if (!employee) {

            throw new AppError(

                "Employee not found",

                404

            );

        }

        return employee;

    }
    async updateEmployee(id, data, adminId) {

    const employee = await employeeRepository.findById(id);

    if (!employee) {

        throw new AppError(
            "Employee not found",
            404
        );

    }

    if (data.department) {

        const department = await departmentRepository.findById(
            data.department
        );

        if (!department) {

            throw new AppError(
                "Department not found",
                404
            );

        }

        if (!department.isActive) {

            throw new AppError(
                "Department is inactive",
                400
            );

        }

    }

    if (data.manager) {

        if (data.manager === id) {

            throw new AppError(
                "Employee cannot be his own manager",
                400
            );

        }

        const manager = await employeeRepository.findById(
            data.manager
        );

        if (!manager) {

            throw new AppError(
                "Manager not found",
                404
            );

        }

    }

    const allowedFields = [

        "department",

        "manager",

        "jobTitle",

        "employmentType",

        "hireDate",

        "salary",

        "isActive"

    ];

    allowedFields.forEach(field => {

        if (data[field] !== undefined) {

            employee[field] = data[field];

        }

    });

    employee.updatedBy = adminId;

    return await employeeRepository.save(employee);

}

async deleteEmployee(id, adminId) {

    const employee = await employeeRepository.findById(id);

    if (!employee) {

        throw new AppError(
            "Employee not found",
            404
        );

    }
if (!employee.isActive) {

    throw new AppError(
        "Employee already inactive",
        400
    );

}
    const subordinates = await employeeRepository.count({

        manager: id,

        isActive: true

    });

    if (subordinates > 0) {

        throw new AppError(

            "Cannot deactivate employee because they still manage other employees",

            400

        );

    }

    employee.isActive = false;

    employee.updatedBy = adminId;

    return await employeeRepository.save(employee);

}

async restoreEmployee(id, adminId) {

    const employee = await employeeRepository.findById(id);

    if (!employee) {

        throw new AppError(

            "Employee not found",

            404

        );

    }
    if (employee.isActive) {

    throw new AppError(
        "Employee already active",
        400
    );

}

    if (employee.department) {

        const department = await departmentRepository.findById(
            employee.department
        );

        if (!department || !department.isActive) {

            throw new AppError(

                "Employee department is inactive",

                400

            );

        }

    }

    employee.isActive = true;

    employee.updatedBy = adminId;

    return await employeeRepository.save(employee);

}

async getEmployeeByUserId(userId) {

    const employee = await employeeRepository.findOne(
        { user: userId },
        {
            populate: [
                {
                    path: "department",
                    select: "name code"
                },
                {
                    path: "manager",
                    select: "employeeCode jobTitle"
                },
                {
                    path: "user",
                    select: "name email phone avatar"
                }
            ]
        }
    );

    if (!employee) {

        throw new AppError(
            "Employee not found",
            404
        );

    }

    return employee;

}

async changeManager(id, managerId, adminId) {

    const employee =
        await employeeRepository.findById(id);

    if (!employee) {

        throw new AppError(
            "Employee not found",
            404
        );

    }

    if (id === managerId) {

        throw new AppError(
            "Employee cannot manage himself",
            400
        );

    }

    const manager =
        await employeeRepository.findById(managerId);

    if (!manager) {

        throw new AppError(
            "Manager not found",
            404
        );

    }

    employee.manager = managerId;

    employee.updatedBy = adminId;

    return await employeeRepository.save(employee);

}

async removeManager(id, adminId) {

    const employee =
        await employeeRepository.findById(id);

    if (!employee) {

        throw new AppError(
            "Employee not found",
            404
        );

    }

    employee.manager = null;

    employee.updatedBy = adminId;

    return await employeeRepository.save(employee);

}

async changeDepartment(id, departmentId, adminId) {

    const employee = await employeeRepository.findById(id);

    if (!employee) {

        throw new AppError(
            "Employee not found",
            404
        );

    }

    const department = await departmentRepository.findById(
        departmentId
    );

    if (!department) {

        throw new AppError(
            "Department not found",
            404
        );

    }

    if (!department.isActive) {

        throw new AppError(
            "Department is inactive",
            400
        );

    }

    employee.department = departmentId;

    employee.updatedBy = adminId;

    return await employeeRepository.save(employee);

}

async changeSalary(id, salary, adminId) {

    const employee = await employeeRepository.findById(id);

    if (!employee) {

        throw new AppError(
            "Employee not found",
            404
        );

    }

    if (salary < 0) {

        throw new AppError(
            "Salary must be greater than or equal to zero",
            400
        );

    }

    employee.salary = salary;

    employee.updatedBy = adminId;

    return await employeeRepository.save(employee);

}
}

export default new EmployeeService();