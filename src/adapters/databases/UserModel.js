import { Schema, Types } from "mongoose";

const ENUM_USER_ROLE = ["administrator", "user"];

export const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    userDni: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        maxlength: 8,
        unique: true,
        index: true
    },
    userEmail: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        unique: true,
        index: true
    },
    userPassword: {
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
        default: true
    },
    userLoginAttempts: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    userLastLogin: {
        type: Date,
        default: null
    },
    userLastLoginAttempt: {
        type: Date,
        default: null
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