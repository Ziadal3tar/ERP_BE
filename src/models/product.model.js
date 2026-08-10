import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        sku: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            maxlength: 50
        },

        barcode: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            maxlength: 100
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: null
        },

        purchasePrice: {
            type: Number,
            required: true,
            min: 0
        },

        sellingPrice: {
            type: Number,
            required: true,
            min: 0
        },

        unit: {
            type: String,
            required: true,
            trim: true,
            maxlength: 30
        },

        minStock: {
            type: Number,
            default: 0,
            min: 0
        },

        image: {
            type: String,
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

productSchema.index({
    name: 1
});

productSchema.index({
    category: 1
});

export default mongoose.model(
    "Product",
    productSchema
);