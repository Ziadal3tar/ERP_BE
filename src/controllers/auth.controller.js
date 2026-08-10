// import { validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import authService from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {

    const result = await authService.register(req.body);

    res.status(201).json({
        success: true,
        token: result.token,
        user: result.user
    });

});
export const verifyEmail = asyncHandler(async(req,res)=>{

    await authService.verifyEmail(

        req.params.token

    );

    res.json({

        success:true,

        message:"Email verified"

    });

});
export const login = asyncHandler(async (req, res) => {

    const result = await authService.login(

    req.body.email,

    req.body.password,

    req.ip,

    req.get("user-agent")

);

   res.cookie(

    "refreshToken",

    result.refreshToken,

    {

        httpOnly:true,

        secure:
            process.env.NODE_ENV==="production",

        sameSite:"strict",

        maxAge:
            7*24*60*60*1000

    }

);

res.json({

    success:true,

    accessToken:
        result.accessToken,

    user:
        result.user

});

});

export const refreshToken = asyncHandler(async (req, res) => {

    const token = req.cookies.refreshToken;

    const result = await authService.refreshToken(

        token,

        req.ip,

        req.get("user-agent")

    );

    res.cookie(

        "refreshToken",

        result.refreshToken,

        {

            httpOnly: true,

            secure: process.env.NODE_ENV === "production",

            sameSite: "strict",

            maxAge: 7 * 24 * 60 * 60 * 1000

        }

    );

    res.status(200).json({

        success: true,

        accessToken: result.accessToken

    });

});

export const profile = asyncHandler(async (req, res) => {

    const user = await authService.getProfile(req.user._id);

    res.status(200).json({
        success: true,
        user
    });

});

export const forgotPassword = asyncHandler(async (req, res) => {

    await authService.forgotPassword(req.body.email);

    res.status(200).json({
        success: true,
        message: "If the email exists, a reset link has been sent."
    });

});

export const resetPassword = asyncHandler(async (req, res) => {

    await authService.resetPassword(
        req.params.token,
        req.body.password
    );

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });

});

export const changePassword = asyncHandler(async (req, res) => {

    await authService.changePassword(
        req.user._id,
        req.body.currentPassword,
        req.body.newPassword
    );

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });

});

export const logout = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    await authService.logout(refreshToken);

    res.clearCookie("refreshToken", {

        httpOnly: true,

        secure: process.env.NODE_ENV === "production",

        sameSite: "strict"

    });

    res.status(200).json({

        success: true,

        message: "Logged out successfully"

    });

});

export const getSessions =
asyncHandler(async(req,res)=>{

    const sessions =
    await sessionRepository.findByUser(
        req.user._id
    );

    res.json({

        success:true,

        sessions

    });

});