import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        phone: {
            type: String,
            trim: true
        },

        avatar: {
            type: String,
            default: null
        },

        role: {
            type: String,
            enum: ["Admin", "Manager", "Employee"],
            default: "Employee"
        },

        status: {
            type: String,
            enum: ["Active", "Inactive", "Suspended"],
            default: "Active"
        },

        isActive: {
            type: Boolean,
            default: true
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        forcePasswordChange: {
            type: Boolean,
            default: false
        },

        lastLogin: Date,

        verificationToken: String,

        verificationExpires: Date,

        passwordResetToken: String,

        passwordResetExpires: Date,

        failedLoginAttempts: {
            type: Number,
            default: 0
        },

        lockUntil: Date,

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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};



const User = mongoose.model("User", userSchema);

export default User;