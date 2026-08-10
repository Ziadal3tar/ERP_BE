import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        checkIn: {
            type: Date,
            default: null
        },

        checkOut: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: [
                "Present",
                "Absent",
                "Late",
                "Leave"
            ],
            default: "Present"
        },

        notes: {
            type: String,
            trim: true,
            default: null
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

attendanceSchema.index(
    {
        employee: 1,
        date: 1
    },
    {
        unique: true
    }
);

export default mongoose.model(
    "Attendance",
    attendanceSchema
);