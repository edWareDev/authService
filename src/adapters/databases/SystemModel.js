import { Schema, Types } from "mongoose";

export const SystemSchema = new Schema({
    systemName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3
    },
    systemSecret: {
        type: String,
        required: true,
        index: true
    },
    systemIsActive: {
        type: Boolean,
        required: true,
        default: true
    },
    systemLastAccess: {
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
}, { versionKey: false, timestamps: true, collection: 'systems' });