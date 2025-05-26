import { Schema, Types } from "mongoose";

const ENUM_USER_ROLE = ["administrator", "contentManager", "monitor"];

export const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    userEmail: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        unique: true,
        index: true
    },
    userPassword: {
        type: String,
        required: true,
    },
    userToken: {
        type: String,
        required: true,
    },
    userRole: {
        type: String,
        required: true,
        trim: true,
        enum: ENUM_USER_ROLE
    },
    userIsActive: {
        type: Boolean,
        required: true,
        default: true,
        index: true
    },
    userLoginAttempts: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    deletedAt: {
        type: Date,
        default: null
    },
    deletedBy: {
        type: Types.ObjectId,
        ref: 'users',
        default: null,
        select: false
    }
}, { versionKey: false, timestamps: true, collection: 'users' });