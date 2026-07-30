import { body, param, query } from "express-validator";

const roles = ["Admin", "Manager", "Employee"];

const statuses = [
    "Active",
    "Inactive",
    "Suspended",
    "On Leave"
];

export const idValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid user id")

];

export const createUserValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Name must be between 3 and 100 characters"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("phone")
        .optional()
        .isMobilePhone("ar-EG")
        .withMessage("Invalid phone number"),

    body("role")
        .optional()
        .isIn(roles)
        .withMessage("Invalid role"),

    body("jobTitle")
        .optional()
        .trim()
        .isLength({ max: 100 }),

    body("department")
        .optional()
        .isMongoId()
        .withMessage("Invalid department id")

];

export const updateUserValidation = [

    body("name")
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }),

    body("phone")
        .optional()
        .isMobilePhone("ar-EG"),

    body("role")
        .optional()
        .isIn(roles),

    body("status")
        .optional()
        .isIn(statuses),

    body("department")
        .optional()
        .isMongoId(),

    body("jobTitle")
        .optional()
        .trim()
        .isLength({ max: 100 })

];

export const updateProfileValidation = [

    body("name")
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }),

    body("phone")
        .optional()
        .isMobilePhone("ar-EG"),

    body("avatar")
        .optional()
        .isString()

];

export const changeRoleValidation = [

    body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(roles)
        .withMessage("Invalid role")

];

export const changeStatusValidation = [

    body("isActive")
        .isBoolean()
        .withMessage("isActive must be boolean")

];

export const resetPasswordValidation = [

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")

];

export const getUsersValidation = [

    query("page")
        .optional()
        .isInt({ min: 1 }),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 }),

    query("role")
        .optional()
        .isIn(roles),

    query("status")
        .optional()
        .isIn(statuses),

    query("isActive")
        .optional()
        .isBoolean(),

    query("isVerified")
        .optional()
        .isBoolean()

];






// import { body,param,query } from "express-validator";

// export const idValidation=[

// param("id")
// .isMongoId()
// .withMessage("Invalid Department Id")

// ];

// export const createDepartmentValidation=[

// body("name")
// .trim()
// .notEmpty()
// .withMessage("Department name is required"),

// body("code")
// .trim()
// .notEmpty()
// .withMessage("Department code is required"),

// body("manager")
// .optional()
// .isMongoId(),

// body("description")
// .optional()
// .isString()

// ];

// export const updateDepartmentValidation=[

// body("name")
// .optional()
// .trim(),

// body("code")
// .optional()
// .trim(),

// body("manager")
// .optional()
// .isMongoId(),

// body("description")
// .optional()
// .isString(),

// body("isActive")
// .optional()
// .isBoolean()

// ];

// export const getDepartmentsValidation=[

// query("page")
// .optional()
// .isInt({min:1}),

// query("limit")
// .optional()
// .isInt({min:1,max:100})

// ];