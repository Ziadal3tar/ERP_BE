import mongoose from "mongoose";

const purchaseItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 0.01
        },

        unitPrice: {
            type: Number,
            required: true,
            min: 0
        },

        total: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        _id: false
    }
);

const purchaseSchema = new mongoose.Schema(
    {
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true
        },

        warehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Warehouse",
            required: true
        },

        items: {
            type: [purchaseItemSchema],
            required: true,

            validate: {

                validator: value =>
                    value.length > 0,

                message:
                    "Purchase must contain at least one item"

            }
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        discount: {
            type: Number,
            default: 0,
            min: 0
        },

        tax: {
            type: Number,
            default: 0,
            min: 0
        },

        total: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,

            enum: [
                "Draft",
                "Confirmed",
                "Received",
                "Cancelled"
            ],

            default: "Draft"
        },

        receivedAt: {
            type: Date,
            default: null
        },

        receivedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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

purchaseSchema.index({
    supplier: 1
});

purchaseSchema.index({
    warehouse: 1
});

purchaseSchema.index({
    status: 1
});

purchaseSchema.index({
    createdAt: -1
});

export default mongoose.model(
    "Purchase",
    purchaseSchema
);