import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },

        type: {
            type: String,

            enum: [
                "INFO",
                "SUCCESS",
                "WARNING",
                "ERROR"
            ],

            default: "INFO"
        },

        module: {
            type: String,
            default: null
        },

        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

        isRead: {
            type: Boolean,
            default: false
        },

        readAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

notificationSchema.index({
    recipient: 1,
    isRead: 1
});

notificationSchema.index({
    recipient: 1,
    createdAt: -1
});

export default mongoose.model(
    "Notification",
    notificationSchema
);