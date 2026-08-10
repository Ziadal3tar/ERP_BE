import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
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

        creditLimit: {
            type: Number,
            min: 0,
            default: 0
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

customerSchema.index({
    name: 1
});

customerSchema.index({
    phone: 1
});

export default mongoose.model(
    "Customer",
    customerSchema
);