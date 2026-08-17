import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        invoice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
            required: true
        },

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01
        },

        method: {
            type: String,

            enum: [
                "Cash",
                "Card",
                "Bank"
            ],

            required: true
        },

        reference: {
            type: String,
            trim: true,
            maxlength: 100,
            default: null
        },

        notes: {
            type: String,
            trim: true,
            maxlength: 500,
            default: null
        },

        paymentDate: {
            type: Date,
            default: Date.now
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

paymentSchema.index({
    invoice: 1
});

paymentSchema.index({
    customer: 1
});

paymentSchema.index({
    paymentDate: -1
});

export default mongoose.model(
    "Payment",
    paymentSchema
);