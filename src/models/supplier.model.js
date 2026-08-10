import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            maxlength: 30
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: null
        },

        phone: {
            type: String,
            trim: true,
            default: null
        },

        address: {
            type: String,
            trim: true,
            maxlength: 300,
            default: null
        },

        taxNumber: {
            type: String,
            trim: true,
            default: null
        },

        notes: {
            type: String,
            trim: true,
            maxlength: 500,
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

supplierSchema.index({
    name: 1
});

export default mongoose.model(
    "Supplier",
    supplierSchema
);