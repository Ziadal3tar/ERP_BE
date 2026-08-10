import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            maxlength: 30
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: null
        },

        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null
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

categorySchema.index({
    name: 1
});

categorySchema.index({
    parent: 1
});

export default mongoose.model(
    "Category",
    categorySchema
);