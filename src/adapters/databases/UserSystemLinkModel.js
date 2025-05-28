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
    }
}, { versionKey: false, timestamps: true, collection: 'userSystemLinks' });