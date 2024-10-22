import { IComment, Comment } from '../models/comment.model';
import { IArticle } from '../models/article.model';
import mongoose, { Types } from 'mongoose';
import { IPopulatedComment } from '../interface/comment.interface';

import { createCommentToArticle, deleteCommentFromArticle } from './article.service';

export const createComment = async (text: string, authorId: Types.ObjectId): Promise<IComment> => {
    const comment: IComment = await Comment.create({
        text,
        likedBy: [],
        author: authorId
    });

    return comment;
}

export const transactionCreateCommentToArticle = async (text: string, authorId: Types.ObjectId, articleId: Types.ObjectId): Promise<Types.ObjectId | null> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const comment: IComment = await createComment(text, authorId);
    const commentId: Types.ObjectId = comment._id as Types.ObjectId;
    const postComment: IArticle | null = await createCommentToArticle(commentId, articleId);
    
    if (!postComment) {
        await session.abortTransaction();
        await session.endSession();
        return null;
    }
    await session.commitTransaction();
    await session.endSession();

    return commentId;
}

export const getCommentById = async (commentId: Types.ObjectId): Promise<IComment | null> => {
    const comment: IComment | null = await Comment.findById(commentId);
    return comment;
}

export const deleteCommentById = async (commentId: Types.ObjectId): Promise<IComment | null> => {
    const comment: IComment | null = await Comment.findByIdAndDelete(commentId)
    console.log(comment)
    return comment;
}

export const transactionDeleteCommentFromArticle = async (commentId: Types.ObjectId, articleId: Types.ObjectId): Promise<boolean> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const deleteComment: IComment | null = await deleteCommentById(commentId);
    if (!deleteComment) { 
        await session.abortTransaction();
        await session.endSession();
        return false;
    }

    const postComment: IArticle | null = await deleteCommentFromArticle(commentId, articleId);
    if (!postComment) {
        await session.abortTransaction();
        await session.endSession();
        return false;
    }

    await session.commitTransaction();
    await session.endSession();
    return true;
}

export const likeComment = async (commentId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> => {
    const comment: IComment | null = await Comment.findById(commentId);
    if (!comment) return false;

    comment.likedBy.push(userId);
    await comment.save();
    return true;
}

export const unlikeComment = async (commentId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> => {
    const comment: IComment | null = await Comment.findById(commentId);
    if (!comment) return false;

    comment.likedBy = comment.likedBy.filter(id => id.toString() !== userId.toString());
    await comment.save();
    return true;
}

export const getPopulatedCommentById = async (commentId: Types.ObjectId): Promise<IPopulatedComment | null> => {
    const comment: IComment | null = await Comment.findById(commentId);
    if (!comment) return null;

    const populatedComment: IPopulatedComment = await comment.populate('author likedBy');
    return populatedComment;
}