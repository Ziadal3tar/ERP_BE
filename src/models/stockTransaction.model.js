import mongoose from "mongoose";

const stockTransactionSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        warehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Warehouse",
            required: true
        },

        type: {
            type: String,
            enum: [
                "IN",
                "OUT",
                "ADJUSTMENT",
                "TRANSFER_IN",
                "TRANSFER_OUT"
            ],
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 0
        },

        reference: {
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

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

stockTransactionSchema.index({
    product: 1,
    warehouse: 1,
    createdAt: -1
});

export default mongoose.model(
    "StockTransaction",
    stockTransactionSchema
);