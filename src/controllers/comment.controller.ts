import { Request, Response, NextFunction } from 'express';
import { IArticle } from '../models/article.model';
import { IComment } from '../models/comment.model';
import { ResponseError } from '../error/response.error';
import { IUserRequest } from '../interface/user.interface';
import { Types } from 'mongoose';
import { IPopulatedComment, IFormattedComment } from '../interface/comment.interface';
import { formattedComment } from '../utils/comment.util';
import { getArticleById } from '../services/article.service';

import {
    transactionCreateCommentToArticle,
    getCommentById,
    transactionDeleteCommentFromArticle,
    likeComment,
    unlikeComment,
    getPopulatedCommentById
} from '../services/comment.service';

import { 
    CreateCommentType,
    validateInputCreateArticleSchema
} from '../schema/comment.schema';

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data: CreateCommentType = validateInputCreateArticleSchema(req.body);
        const userReq: IUserRequest = req as IUserRequest;
        const articleId: Types.ObjectId = new Types.ObjectId(req.params.articleId);

        const article: IArticle | null = await getArticleById(articleId);
        if (!article) throw new ResponseError(404, 'Artikel tidak ditemukan');

        const commentId: Types.ObjectId | null = await transactionCreateCommentToArticle(data.text, userReq.userId, articleId);
        if (!commentId) throw new ResponseError(500, 'Gagal menambahkan komentar ke artikel');

        const populatedComment: IPopulatedComment | null = await getPopulatedCommentById(commentId);
        if (!populatedComment) throw new ResponseError(404, 'Komentar tidak ditemukan');

        const formatComment: IFormattedComment = formattedComment(populatedComment);

        res.status(201).json({
            success: true,
            data: formatComment,
            message: 'Komentar berhasil dibuat'
        });
    } catch (e) {
        next(e);
    }
}

export const deletes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userReq: IUserRequest = req as IUserRequest;
        const articleId: Types.ObjectId = new Types.ObjectId(req.params.articleId);
        const commentId: Types.ObjectId = new Types.ObjectId(req.params.commentId);
        const article: IArticle | null = await getArticleById(articleId);
        if (!article) throw new ResponseError(404, 'Artikel tidak ditemukan');
        
        const comment: IComment | null = await getCommentById(commentId);
        if (!comment) throw new ResponseError(404, 'Komentar tidak ditemukan');
        if (!comment.author.equals(userReq.userId)) throw new ResponseError(403, 'Tidak memiliki hak akses untuk menghapus komentar ini');

        const success: boolean = await transactionDeleteCommentFromArticle(commentId, articleId);        
        if (!success) throw new ResponseError(500, 'Gagal menghapus komentar dari artikel');

        res.status(200).json({
            success: true,
            data: {},
            message: 'Komentar berhasil dihapus'
        });
    } catch (e) {
        next(e);
    }
}

export const likes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userReq: IUserRequest = req as IUserRequest;
        const commentId: Types.ObjectId = new Types.ObjectId(req.params.commentId);
        
        const comment: IComment | null = await getCommentById(commentId);
        if (!comment) throw new ResponseError(404, 'Komentar tidak ditemukan');

        const isLiked: boolean = comment.likedBy.includes(userReq.userId);
        if (isLiked) throw new ResponseError(400, 'Komentar sudah disukai');

        const success: boolean = await likeComment(commentId, userReq.userId);
        if (!success) throw new ResponseError(500, 'Gagal menyukai komentar');
    
        const populatedComment: IPopulatedComment | null = await getPopulatedCommentById(commentId);
        if (!populatedComment) throw new ResponseError(404, 'Komentar tidak ditemukan');

        const formatComment: IFormattedComment = formattedComment(populatedComment);

        res.status(200).json({
            success: true,
            data: formatComment,
            message: 'Komentar berhasil disukai'
        });
    } catch (e) {
        next(e);
    }
}

export const unlikes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userReq: IUserRequest = req as IUserRequest;
        const commentId: Types.ObjectId = new Types.ObjectId(req.params.commentId);
        
        const comment: IComment | null = await getCommentById(commentId);
        if (!comment) throw new ResponseError(404, 'Komentar tidak ditemukan');

        const isLiked: boolean = comment.likedBy.includes(userReq.userId);
        if (!isLiked) throw new ResponseError(400, 'Komentar belum disukai');

        const success: boolean = await unlikeComment(commentId, userReq.userId);
        if (!success) throw new ResponseError(500, 'Gagal membatalkan suka komentar');
    
        const populatedComment: IPopulatedComment | null = await getPopulatedCommentById(commentId);
        if (!populatedComment) throw new ResponseError(404, 'Komentar tidak ditemukan');

        const formatComment: IFormattedComment = formattedComment(populatedComment);

        res.status(200).json({
            success: true,
            data: formatComment,
            message: 'Komentar batal disukai'
        });
    } catch (e) {
        next(e);
    }
}