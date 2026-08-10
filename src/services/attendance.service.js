import attendanceRepository from "../repositories/attendance.repository.js";
import employeeRepository from "../repositories/employee.repository.js";
import departmentRepository from "../repositories/department.repository.js";

import AppError from "../utils/AppError.js";

const getStartOfDay = (date = new Date()) => {

    const result = new Date(date);

    result.setHours(0, 0, 0, 0);

    return result;

};

const getEndOfDay = (date = new Date()) => {

    const result = new Date(date);

    result.setHours(23, 59, 59, 999);

    return result;

};

class AttendanceService {

    async checkIn(userId, data = {}) {

        const employee = await employeeRepository.findOne({

            user: userId

        });

        if (!employee) {

            throw new AppError(

                "Employee profile not found",

                404

            );

        }

        if (!employee.isActive) {

            throw new AppError(

                "Employee is inactive",

                400

            );

        }

        const today = getStartOfDay();

        const tomorrow = new Date(today);

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        const existingAttendance =
            await attendanceRepository.findOne({

                employee: employee._id,

                date: {

                    $gte: today,

                    $lt: tomorrow

                }

            });

        if (existingAttendance) {

            throw new AppError(

                "Employee already checked in today",

                400

            );

        }

        const attendance =
            await attendanceRepository.create({

                employee: employee._id,

                date: today,

                checkIn: new Date(),

                status: "Present",

                notes: data.notes || null,

                createdBy: userId

            });

        return attendance;

    }

    async checkOut(userId, data = {}) {
console.log(userId);
console.log(data);

        const employee = await employeeRepository.findOne({

            user: userId

        });

        if (!employee) {

            throw new AppError(

                "Employee profile not found",

                404

            );

        }

        if (!employee.isActive) {

            throw new AppError(

                "Employee is inactive",

                400

            );

        }

        const today = getStartOfDay();

        const tomorrow = new Date(today);

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        const attendance =
            await attendanceRepository.findOne({

                employee: employee._id,

                date: {

                    $gte: today,

                    $lt: tomorrow

                }

            });

        if (!attendance) {

            throw new AppError(

                "No check-in record found for today",

                404

            );

        }

        if (attendance.checkOut) {

            throw new AppError(

                "Employee already checked out today",

                400

            );

        }

        attendance.checkOut = new Date();

        attendance.updatedBy = userId;

        if (data.notes !== undefined) {

            attendance.notes = data.notes;

        }

        return await attendanceRepository.save(

            attendance

        );

    }

    async createAttendance(data, adminId) {

        const employee =
            await employeeRepository.findById(

                data.employee

            );

        if (!employee) {

            throw new AppError(

                "Employee not found",

                404

            );

        }

        if (!employee.isActive) {

            throw new AppError(

                "Employee is inactive",

                400

            );

        }

        const date = getStartOfDay(

            data.date

        );

        const tomorrow = new Date(date);

        tomorrow.setDate(

            tomorrow.getDate() + 1

        );

        const existingAttendance =
            await attendanceRepository.findOne({

                employee: employee._id,

                date: {

                    $gte: date,

                    $lt: tomorrow

                }

            });

        if (existingAttendance) {

            throw new AppError(

                "Attendance already exists for this employee on this date",

                400

            );

        }

        if (

            data.checkIn &&

            data.checkOut &&

            new Date(data.checkOut) <=
            new Date(data.checkIn)

        ) {

            throw new AppError(

                "Check-out must be after check-in",

                400

            );

        }

        return await attendanceRepository.create({

            ...data,

            employee: employee._id,

            date,

            createdBy: adminId

        });

    }

    async getAttendance(query = {}) {

        const page =
            Number(query.page) || 1;

        const limit =
            Number(query.limit) || 10;

        const skip =
            (page - 1) * limit;

        const filter = {};
        if (query.employee) {

            filter.employee =
                query.employee;

        }

        if (query.status) {

            filter.status =
                query.status;

        }

        if (query.date) {

            const start =
                getStartOfDay(query.date);

            const end =
                getEndOfDay(query.date);

            filter.date = {

                $gte: start,

                $lte: end

            };

        }
        if (query.from || query.to) {

            filter.date = {};

            if (query.from) {

                filter.date.$gte =
                    getStartOfDay(query.from);

            }

            if (query.to) {

                filter.date.$lte =
                    getEndOfDay(query.to);

            }

        }

        if (query.department) {

            const employees =
                await employeeRepository.find({

                    department:
                        query.department,

                    isActive: true

                });

            const employeeIds =
                employees.map(
                    employee => employee._id
                );

            filter.employee = {

                $in: employeeIds

            };

        }

        const total =
            await attendanceRepository.count(

                filter

            );

        const data =
            await attendanceRepository.find(

                filter,

                {

                    skip,

                    limit,

                    sort: {

                        date: -1

                    },

                    populate: [

                        {

                            path: "employee",

                            select:
                                "employeeCode jobTitle",

                            populate: {

                                path: "user",

                                select:
                                    "name email avatar"

                            }

                        },

                        {

                            path: "createdBy",

                            select:
                                "name email"

                        },

                        {

                            path: "updatedBy",

                            select:
                                "name email"

                        }

                    ]

                }

            );

        return {

            data,

            pagination: {

                total,

                page,

                limit,

                totalPages:
                    Math.ceil(
                        total / limit
                    )

            }

        };

    }

    async getAttendanceById(id) {

        const attendance =
            await attendanceRepository.findOne(

                { _id: id },

                {

                    populate: [

                        {

                            path: "employee",

                            select:
                                "employeeCode jobTitle",

                            populate: {

                                path: "user",

                                select:
                                    "name email phone avatar"

                            }

                        },

                        {

                            path: "createdBy",

                            select:
                                "name email"

                        },

                        {

                            path: "updatedBy",

                            select:
                                "name email"

                        }

                    ]

                }

            );

        if (!attendance) {

            throw new AppError(

                "Attendance not found",

                404

            );

        }

        return attendance;

    }

    async getMyAttendance(userId, query = {}) {

        const employee =
            await employeeRepository.findOne({

                user: userId

            });

        if (!employee) {

            throw new AppError(

                "Employee profile not found",

                404

            );

        }

        return this.getAttendance({

            ...query,

            employee:
                employee._id.toString()

        });

    }

    async updateAttendance(id, data, adminId) {

        const attendance =
            await attendanceRepository.findById(id);

        if (!attendance) {

            throw new AppError(

                "Attendance not found",

                404

            );

        }

        const checkIn =
            data.checkIn !== undefined

                ? data.checkIn

                : attendance.checkIn;

        const checkOut =
            data.checkOut !== undefined

                ? data.checkOut

                : attendance.checkOut;

        if (

            checkIn &&

            checkOut &&

            new Date(checkOut) <=
            new Date(checkIn)

        ) {

            throw new AppError(

                "Check-out must be after check-in",

                400

            );

        }

        const allowedFields = [

            "date",

            "checkIn",

            "checkOut",

            "status",

            "notes"

        ];

        allowedFields.forEach(field => {

            if (data[field] !== undefined) {

                attendance[field] =
                    data[field];

            }

        });

        if (data.date) {

            attendance.date =
                getStartOfDay(data.date);

        }

        attendance.updatedBy =
            adminId;

        return await attendanceRepository.save(

            attendance

        );

    }

    async deleteAttendance(id, adminId) {

        const attendance =
            await attendanceRepository.findById(id);

        if (!attendance) {

            throw new AppError(

                "Attendance not found",

                404

            );

        }

        await attendance.deleteOne();

        return true;

    }

}

export default new AttendanceService();