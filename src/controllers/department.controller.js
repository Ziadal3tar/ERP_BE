import asyncHandler from "../middleware/asyncHandler.js";
import departmentService from "../services/department.service.js";
import response from "../utils/apiResponse.js";


export const getDepartments = asyncHandler(async (req, res) => {

    const result = await departmentService.getDepartments(req.query);

    response.paginated(

        res,

        result.data,

        result.pagination

    );

});

export const getDepartmentById = asyncHandler(async (req, res) => {

    const department = await departmentService.getDepartmentById(

        req.params.id

    );

    response.success(

        res,

        department

    );

});

export const createDepartment = asyncHandler(async (req, res) => {

    const department = await departmentService.createDepartment(

        req.body,

        req.user._id

    );

    response.success(

        res,

        department,

        "Department created successfully",

        201

    );

});

export const updateDepartment = asyncHandler(async (req, res) => {

    const department = await departmentService.updateDepartment(

        req.params.id,

        req.body,

        req.user._id

    );

    response.success(

        res,

        department,

        "Department updated successfully"

    );

});

export const deleteDepartment = asyncHandler(async (req, res) => {

    const department = await departmentService.deleteDepartment(

        req.params.id,

        req.user._id

    );

    response.success(

        res,

        department,

        "Department deleted successfully"

    );

});

export const restoreDepartment = asyncHandler(async (req, res) => {

    const department = await departmentService.restoreDepartment(

        req.params.id,

        req.user._id

    );

    response.success(

        res,

        department,

        "Department restored successfully"

    );

});

export const changeManager = asyncHandler(async (req, res) => {

    const department = await departmentService.changeManager(

        req.params.id,

        req.body.manager,

        req.user._id

    );

    response.success(

        res,

        department,

        "Department manager updated successfully"

    );

});

export const removeManager = asyncHandler(async (req, res) => {

    const department = await departmentService.removeManager(

        req.params.id,

        req.user._id

    );

    response.success(

        res,

        department,

        "Department manager removed successfully"

    );

});