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
    userSystemLinkIsActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, { versionKey: false, timestamps: true, collection: 'userSystemLinks' });

UserSystemLinkSchema.index({ userId: 1, systemId: 1 }, { unique: true });