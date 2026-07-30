import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        employeeCode: {
            type: String,
            required: true,
            unique: true
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },

        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            default: null
        },

        jobTitle: {
            type: String,
            required: true,
            trim: true
        },

        employmentType: {
            type: String,
            enum: [
                "Full Time",
                "Part Time",
                "Contract",
                "Intern"
            ],
            default: "Full Time"
        },

        hireDate: {
            type: Date,
            required: true
        },

        salary: {
            type: Number,
            default: 0,
            min: 0
        },

        isActive: {
            type: Boolean,
            default: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }

    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Employee",
    employeeSchema
);