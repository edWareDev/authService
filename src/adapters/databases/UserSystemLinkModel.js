import { Schema, Types } from "mongoose";

export const UserSystemLinkSchema = new Schema({
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
    linkIsActive: {
        type: Boolean,
        required: true,
        default: true
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
}, { versionKey: false, timestamps: true, collection: 'userSystemLinks' });