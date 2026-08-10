import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
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

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        sale: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sale",
            required: true,
            unique: true
        },

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        items: {
            type: [invoiceItemSchema],
            required: true
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

        paidAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        remainingAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,

            enum: [
                "Unpaid",
                "PartiallyPaid",
                "Paid",
                "Cancelled"
            ],

            default: "Unpaid"
        },

        issueDate: {
            type: Date,
            default: Date.now
        },

        dueDate: {
            type: Date,
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

invoiceSchema.index({
    customer: 1
});

invoiceSchema.index({
    status: 1
});

invoiceSchema.index({
    issueDate: -1
});

export default mongoose.model(
    "Invoice",
    invoiceSchema
);