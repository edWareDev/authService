import { Schema, Types } from "mongoose";

const ENUM_CODE_TYPES = ["PASSWORD_RECOVERY", "EMAIL_VERIFICATION", "LOGIN"];

export const UserCodeSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'users',
        required: true
    },
    codeValue: {
        type: String,
        required: true,
        trim: true,
        length: 6,
    },
    codeType: {
        type: String,
        required: true,
        trim: true,
        enum: ENUM_CODE_TYPES
    },
    codeTimesSent: {
        type: Number,
        required: true,
        default: 1
    },
    codeHasBeenUsed: {
        type: Boolean,
        required: true,
        default: false
    },
    ipAddress: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    userAgent: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    expiredAt: {
        type: Date,
        required: true
    }
}, { versionKey: false, timestamps: true, collection: 'userCodes' });