import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
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

        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
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


stockSchema.index(
    {
        product: 1,
        warehouse: 1
    },
    {
        unique: true
    }
);

export default mongoose.model(
    "Stock",
    stockSchema
);