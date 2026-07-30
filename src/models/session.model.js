import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        refreshTokenHash: {
            type: String,
            required: true,
        },

        ip: {
            type: String,
            default: null,
        },

        userAgent: {
            type: String,
            default: null,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Session", sessionSchema);