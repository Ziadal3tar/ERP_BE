import express from "express";
import auth from "../middleware/auth.middleware.js";

import {
    register,
    login,
    logout,
    // logoutAll,
    profile,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshToken,
    verifyEmail,
    // resendVerification,
    getSessions,
    // revokeSession
} from "../controllers/auth.controller.js";

import {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    changePasswordValidation
} from "../validations/auth.validation.js";

const router = express.Router();

// Authentication
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", logout);
// router.post("/logout-all", auth, logoutAll);
router.post("/refresh-token", refreshToken);

// Email Verification
router.get("/verify-email/:token", verifyEmail);
// router.post("/resend-verification", resendVerification);

// Password
router.post(
    "/forgot-password",
    forgotPasswordValidation,
    forgotPassword
);

router.post(
    "/reset-password/:token",
    resetPasswordValidation,
    resetPassword
);

router.put(
    "/change-password",
    auth,
    changePasswordValidation,
    changePassword
);

// Profile
router.get("/profile", auth, profile);

// Sessions
router.get("/sessions", auth, getSessions);
// router.delete("/sessions/:id", auth, revokeSession);

export default router;