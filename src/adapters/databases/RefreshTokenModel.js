import { Schema, Types } from "mongoose";

export const RefreshTokenSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'users',
        required: true,
        index: true
    },
    systemId: {
        type: Types.ObjectId,
        ref: 'systems',
        required: true,
        index: true
    },
    tokenValue: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        unique: true,
        index: true
    },
    tokenIsActive: {
        type: Boolean,
        required: true,
        default: true
    },
    expiredAt: {
        type: Date,
        required: true
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
}, { versionKey: false, timestamps: true, collection: 'refreshTokens' });