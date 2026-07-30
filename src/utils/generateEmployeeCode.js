import userRepository from "../repositories/user.repository.js";

const generateEmployeeCode = async () => {

    const lastUser =
        await userRepository.findLastEmployee();

    if (!lastUser || !lastUser.employeeCode) {

        return "EMP-00001";

    }

    const number = Number(

        lastUser.employeeCode.split("-")[1]

    );

    return `EMP-${String(number + 1).padStart(5, "0")}`;

};

export default generateEmployeeCode;