import mongoose, { Schema, Document, Types } from "mongoose";

// interface IComment {
//     text: string;
//     likes: Types.ObjectId[];
// }

export interface IArticle extends Document {
    title: string;
    content: string;
    author: Types.ObjectId;
    likedBy: Types.ObjectId[];
    comments: Types.ObjectId[];
    // comments: IComment[];
}

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
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
    }],
    comments: [{
        type: Types.ObjectId,
        ref: 'Comment',
        // text: {
        //     type: String,
        //     required: true
        // },
        // likes: [{
        //     type: Types.ObjectId,
        //     ref: 'User'
        // }]
    }]
}, {
    timestamps: true
});

export const Article = mongoose.model<IArticle>('Article', articleSchema);