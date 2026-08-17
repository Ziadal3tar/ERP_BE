import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        action: {
            type: String,
            required: true,

            enum: [
                "LOGIN",

                "CREATE",
                "UPDATE",
                "DELETE",
                "RESTORE",

                "CONFIRM",
                "CANCEL",
                "RECEIVE",

                "PAYMENT"
            ]
        },

        module: {
            type: String,
            required: true,

            enum: [
                "Auth",
                "User",
                "Department",
                "Employee",
                "Attendance",
                "Leave",
                "Category",
                "Product",
                "Warehouse",
                "Stock",
                "Supplier",
                "Purchase",
                "Customer",
                "Sale",
                "Invoice",
                "Payment"
            ]
        },

        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500
        },

        ipAddress: {
            type: String,
            default: null
        },

        userAgent: {
            type: String,
            default: null
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        }
    },
    {
        timestamps: true
    }
);

auditLogSchema.index({
    user: 1
});

auditLogSchema.index({
    module: 1
});

auditLogSchema.index({
    action: 1
});

auditLogSchema.index({
    createdAt: -1
});

export default mongoose.model(
    "AuditLog",
    auditLogSchema
);