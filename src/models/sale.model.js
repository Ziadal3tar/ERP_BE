import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
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

const saleSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        warehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Warehouse",
            required: true
        },

        items: {
            type: [saleItemSchema],
            required: true,

            validate: {
                validator: value =>
                    value.length > 0,

                message:
                    "Sale must contain at least one item"
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

        paymentMethod: {
            type: String,

            enum: [
                "Cash",
                "Card",
                "Bank",
                "Credit"
            ],

            default: "Cash"
        },

        status: {
            type: String,

            enum: [
                "Draft",
                "Confirmed",
                "Cancelled"
            ],

            default: "Draft"
        },

        notes: {
            type: String,
            trim: true,
            maxlength: 500,
            default: null
        },

        confirmedAt: {
            type: Date,
            default: null
        },

        confirmedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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

saleSchema.index({
    customer: 1
});

saleSchema.index({
    warehouse: 1
});

saleSchema.index({
    status: 1
});

saleSchema.index({
    createdAt: -1
});

export default mongoose.model(
    "Sale",
    saleSchema
);