import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBookmark extends Document {
    article: Types.ObjectId;
    user: Types.ObjectId;
}

const bookmarkSchema = new Schema({
    article: {
        type: Types.ObjectId,
        ref: 'Article',
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export const Bookmark = mongoose.model<IBookmark>('Bookmark', bookmarkSchema);