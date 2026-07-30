import asyncHandler from "../middleware/asyncHandler.js";
import employeeService from "../services/employee.service.js";
import response from "../utils/apiResponse.js";

export const getEmployees = asyncHandler(async (req, res) => {

    const result = await employeeService.getEmployees(req.query);

    response.paginated(
        res,
        result.data,
        result.pagination
    );

});

export const getEmployeeById = asyncHandler(async (req, res) => {

    const employee = await employeeService.getEmployeeById(
        req.params.id
    );

    response.success(
        res,
        employee
    );

});

export const createEmployee = asyncHandler(async (req, res) => {

    const employee = await employeeService.createEmployee(

        req.body,

        req.user._id

    );

    response.success(

        res,

        employee,

        "Employee created successfully",

        201

    );

});

export const updateEmployee = asyncHandler(async (req, res) => {

    const employee = await employeeService.updateEmployee(

        req.params.id,

        req.body,

        req.user._id

    );

    response.success(

        res,

        employee,

        "Employee updated successfully"

    );

});

export const deleteEmployee = asyncHandler(async (req, res) => {

    const employee = await employeeService.deleteEmployee(

        req.params.id,

        req.user._id

    );

    response.success(

        res,

        employee,

        "Employee deleted successfully"

    );

});

export const restoreEmployee = asyncHandler(async (req, res) => {

    const employee = await employeeService.restoreEmployee(

        req.params.id,

        req.user._id

    );

    response.success(

        res,

        employee,

        "Employee restored successfully"

    );

});

export const changeDepartment = asyncHandler(async (req, res) => {

    const employee = await employeeService.changeDepartment(

        req.params.id,

        req.body.department,

        req.user._id

    );

    response.success(

        res,

        employee,

        "Department changed successfully"

    );

});

export const changeSalary = asyncHandler(async (req, res) => {

    const employee = await employeeService.changeSalary(

        req.params.id,

        req.body.salary,

        req.user._id

    );

    response.success(

        res,

        employee,

        "Salary updated successfully"

    );

});