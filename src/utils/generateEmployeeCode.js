import employeeRepository from "../repositories/employee.repository.js";

const generateEmployeeCode = async () => {

    const lastEmployee = await employeeRepository.find(
        {
            employeeCode: {
                $regex: /^EMP-\d+$/
            }
        },
        {
            sort: {
                employeeCode: -1
            },
            limit: 1
        }
    );

    if (!lastEmployee.length) {

        return "EMP-00001";

    }

    const lastCode =
        lastEmployee[0].employeeCode;

    const lastNumber =
        parseInt(
            lastCode.replace("EMP-", ""),
            10
        );

    const nextNumber =
        lastNumber + 1;

    return `EMP-${String(nextNumber).padStart(5, "0")}`;

};

export default generateEmployeeCode;