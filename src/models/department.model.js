import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },

    code:{
        type:String,
        required:true,
        unique:true,
        uppercase:true,
        trim:true
    },

    description:{
        type:String,
        default:null
    },

    manager:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },

    isActive:{
        type:Boolean,
        default:true
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},
{
    timestamps:true
});

export default mongoose.model(
    "Department",
    departmentSchema
);