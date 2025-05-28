import { Schema, Types } from "mongoose";

export const recoveryCodeSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'users',
        required: true,
        index: true
    },
    codeValue: {
        type: String,
        required: true,
        trim: true,
        length: 6,
        unique: true,
        index: true
    },
    codeHasBeenUsed: {
        type: Boolean,
        required: true,
        default: false
    },
    expiredAt: {
        type: Date,
        required: true
    }
}, { versionKey: false, timestamps: true, collection: 'recoveryCodes' });