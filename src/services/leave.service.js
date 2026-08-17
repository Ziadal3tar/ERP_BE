import leaveRepository from "../repositories/leave.repository.js";
import employeeRepository from "../repositories/employee.repository.js";

import AppError from "../utils/AppError.js";

const getStartOfDay = (date) => {

    const result = new Date(date);

    result.setHours(0, 0, 0, 0);

    return result;

};

const getEndOfDay = (date) => {

    const result = new Date(date);

    result.setHours(23, 59, 59, 999);

    return result;

};

class LeaveService {

    async createLeave(userId, data) {
console.log(data)
console.log(userId)
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

        if (!employee.isActive) {

            throw new AppError(

                "Employee is inactive",

                400

            );

        }

        const startDate =
            getStartOfDay(data.startDate);

        const endDate =
            getEndOfDay(data.endDate);

        if (startDate > endDate) {

            throw new AppError(

                "Start date cannot be after end date",

                400

            );

        }

        const overlappingLeave =
            await leaveRepository.findOne({

                employee: employee._id,

                status: {
                    $in: [
                        "Pending",
                        "Approved"
                    ]
                },

                startDate: {
                    $lte: endDate
                },

                endDate: {
                    $gte: startDate
                }

            });

        if (overlappingLeave) {

            throw new AppError(

                "You already have a leave request for these dates",

                400

            );

        }

        const leave =
            await leaveRepository.create({

                employee: employee._id,

                type: data.type,

                startDate,

                endDate,

                reason: data.reason || null,

                status: "Pending",

                createdBy: userId

            });

        return leave;

    }

    async createLeaveByAdmin(data, adminId) {

    const employee =
        await employeeRepository.findById(data.employee);

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

    const startDate =
        getStartOfDay(data.startDate);

    const endDate =
        getEndOfDay(data.endDate);

    if (startDate > endDate) {

        throw new AppError(
            "Start date cannot be after end date",
            400
        );

    }

    const overlappingLeave =
        await leaveRepository.findOne({

            employee: employee._id,

            status: {
                $in: [
                    "Pending",
                    "Approved"
                ]
            },

            startDate: {
                $lte: endDate
            },

            endDate: {
                $gte: startDate
            }

        });

    if (overlappingLeave) {

        throw new AppError(
            "Employee already has a leave request for these dates",
            400
        );

    }

    return await leaveRepository.create({

        employee: employee._id,

        type: data.type,

        startDate,

        endDate,

        reason: data.reason || null,

        status: "Approved",

        reviewedBy: adminId,

        reviewedAt: new Date(),

        createdBy: adminId,

        updatedBy: adminId

    });

}

    async getMyLeaves(userId, query = {}) {

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

        return this.getLeaves({

            ...query,

            employee:
                employee._id.toString()

        });

    }

    async getLeaves(query = {}) {

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

        if (query.type) {

            filter.type =
                query.type;

        }

        if (query.status) {

            filter.status =
                query.status;

        }

        if (query.from || query.to) {

            filter.startDate = {};

            if (query.from) {

                filter.startDate.$gte =
                    getStartOfDay(query.from);

            }

            if (query.to) {

                filter.startDate.$lte =
                    getEndOfDay(query.to);

            }

        }

        const total =
            await leaveRepository.count(filter);

        const data =
            await leaveRepository.find(

                filter,

                {

                    skip,

                    limit,

                    sort: {
                        createdAt: -1
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

                            path: "reviewedBy",

                            select:
                                "name email"

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

    async getLeaveById(id) {

        const leave =
            await leaveRepository.findOne(

                {
                    _id: id
                },

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

                            path: "reviewedBy",

                            select:
                                "name email"

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

        if (!leave) {

            throw new AppError(

                "Leave request not found",

                404

            );

        }

        return leave;

    }

    async approveLeave(id, adminId) {

        const leave =
            await leaveRepository.findById(id);

        if (!leave) {

            throw new AppError(

                "Leave request not found",

                404

            );

        }

        // if (leave.status !== "Pending") {

        //     throw new AppError(

        //         `Cannot approve a ${leave.status.toLowerCase()} leave request`,

        //         400

        //     );

        // }
if(leave.rejectionReason) {
            leave.rejectionReason = null;
        }
        leave.status = "Approved";

        leave.reviewedBy = adminId;

        leave.reviewedAt = new Date();

        leave.updatedBy = adminId;

        return await leaveRepository.save(

            leave

        );

    }

    async rejectLeave(id, reason, adminId) {

        const leave =
            await leaveRepository.findById(id);

        if (!leave) {

            throw new AppError(

                "Leave request not found",

                404

            );

        }

        // if (leave.status !== "Pending") {

        //     throw new AppError(

        //         `Cannot reject a ${leave.status.toLowerCase()} leave request`,

        //         400

        //     );

        // }

        leave.status = "Rejected";

        leave.rejectionReason = reason;

        leave.reviewedBy = adminId;

        leave.reviewedAt = new Date();

        leave.updatedBy = adminId;

        return await leaveRepository.save(

            leave

        );

    }

    async cancelLeave(userId, id) {

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

        const leave =
            await leaveRepository.findOne({

                _id: id,

                employee: employee._id

            });

        if (!leave) {

            throw new AppError(

                "Leave request not found",

                404

            );

        }

        if (leave.status !== "Pending") {

            throw new AppError(

                "Only pending leave requests can be cancelled",

                400

            );

        }

        leave.status = "Cancelled";

        leave.updatedBy = userId;

        return await leaveRepository.save(

            leave

        );

    }

}

export default new LeaveService();