import userService from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import * as response from "../utils/apiResponse.js";

export const getUsers = asyncHandler(async (req, res) => {

    const result =
        await userService.getUsers(req.query);

    response.paginated(

        res,

        result.data,

        result.pagination

    );

});

export const getUserById =
    asyncHandler(async (req, res) => {

        const user =
            await userService.getUserById(

                req.params.id

            );

        response.success(
    res,
    user
);

    });

export const getCurrentUser = asyncHandler(async (req, res) => {

    const user = await userService.getCurrentUser(

        req.user._id

    );

    response.success(

        res,

        user

    );

});

export const createUser =
    asyncHandler(async (req, res) => {

        const user =
            await userService.createUser(

                req.body,

                req.user._id

            );

        response.success(

            res,

            user,

            "User created",

            201

        );

    });

export const updateUser = asyncHandler(async (req, res) => {

    const user = await userService.updateUser(

        req.params.id,
        req.body,
        req.user._id

    );

    res.json({

        success: true,
        data: user

    });

});
export const updateProfile = asyncHandler(async (req, res) => {

    const user = await userService.updateProfile(

        req.user._id,

        req.body

    );

    response.success(

        res,

        user,

        "Profile updated"

    );

});
export const deleteUser = asyncHandler(async (req, res) => {

    const user = await userService.deleteUser(req.params.id);

    response.success(
        res,
        user,
        "User deleted successfully"
    );

});

export const restoreUser = asyncHandler(async (req, res) => {

    const user = await userService.restoreUser(req.params.id);

    response.success(
        res,
        user,
        "User restored successfully"
    );

});

export const changeRole = asyncHandler(async (req, res) => {

    const { role } = req.body;

    const user = await userService.changeRole(

        req.params.id,

        role,

        req.user._id

    );

    response.success(

        res,

        user,

        "User role updated successfully"

    );

});

export const changeStatus = asyncHandler(async (req, res) => {

    const { isActive } = req.body;

    const user = await userService.changeStatus(

        req.params.id,

        isActive,

        req.user._id

    );

    response.success(

        res,

        user,

        `User ${isActive ? "activated" : "deactivated"} successfully`

    );

});
export const resetPassword = asyncHandler(async (req, res) => {

    const { password } = req.body;

    await userService.resetPassword(

        req.params.id,

        password,

        req.user._id

    );

    response.success(

        res,

        null,

        "Password reset successfully"

    );

});