import Department from "../models/department.model.js";
import BaseRepository from "./BaseRepository.js";

class DepartmentRepository extends BaseRepository {

    constructor() {

        super(Department);

    }

    async getDepartmentsWithUsersCount(filter = {}) {

        return await this.model.aggregate([

            {
                $match: filter
            },

            {
$lookup: {
    from: "users",
    let: { departmentId: "$_id" },
    pipeline: [
        {
            $match: {
                $expr: {
                    $eq: ["$department", "$$departmentId"]
                }
            }
        },
        {
            $match: {
                isActive: true
            }
        }
    ],
    as: "users"
}
            },

            {
                $addFields: {
                    usersCount: {
                        $size: "$users"
                    }
                }
            },

            {
                $project: {
                    users: 0
                }
            }

        ]);

    }

}

export default new DepartmentRepository();