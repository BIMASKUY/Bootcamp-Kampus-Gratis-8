import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
    text: string;
    likedBy: Types.ObjectId[];
    author: Types.ObjectId;
}

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    likedBy: [{
        type: Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

export const Comment = mongoose.model<IComment>('Comment', commentSchema);