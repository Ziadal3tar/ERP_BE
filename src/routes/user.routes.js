import express from "express";
import * as userController from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.js";
import { createUserValidation, updateUserValidation,updateProfileValidation,getUsersValidation,idValidation,changeRoleValidation, changeStatusValidation,resetPasswordValidation } from "../validations/user.validation.js";
import validate from "../middleware/validate.js";

const router = express.Router();
router.get(
    "/me",
    auth,
    userController.getCurrentUser
);

router.put(
    "/me",
    auth,
    updateProfileValidation,
    validate,
    userController.updateProfile
);

router.get(
    "/",
    auth,
    authorize("Admin"),
    getUsersValidation,
    validate,
    userController.getUsers
);

router.post(
    "/",
    auth,
    authorize("Admin"),
    createUserValidation,
    validate,
    userController.createUser
);

router.get(
    "/:id",
    auth,
    authorize("Admin"),
    idValidation,
    validate,
    userController.getUserById
);

router.put(
    "/:id",
    auth,
    authorize("Admin"),
    idValidation,
    updateUserValidation,
    validate,
    userController.updateUser
);

router.patch(
    "/:id/role",
    auth,
    authorize("Admin"),
    idValidation,
    changeRoleValidation,
    validate,
    userController.changeRole
);

router.patch(
    "/:id/status",
    auth,
    authorize("Admin"),
    idValidation,
    changeStatusValidation,
    validate,
    userController.changeStatus
);

router.patch(
    "/:id/reset-password",
    auth,
    authorize("Admin"),
    idValidation,
    resetPasswordValidation,
    validate,
    userController.resetPassword
);

router.patch(
    "/:id/restore",
    auth,
    authorize("Admin"),
    idValidation,
    validate,
    userController.restoreUser
);

router.delete(
    "/:id",
    auth,
    authorize("Admin"),
    idValidation,
    validate,
    userController.deleteUser
);
export default router;