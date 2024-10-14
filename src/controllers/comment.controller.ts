import { Request, Response, NextFunction } from 'express';
import { IArticle } from '../models/article.model';
import { IComment } from '../models/comment.model';
import { ResponseError } from '../error/response.error';
import { IUserRequest } from '../interface/user.interface';
import { IFormattedArticle } from '../interface/article.interface';
import { Types } from 'mongoose';
import { formattedArticle } from '../utils/article.util';
import { IPopulatedComment, IFormattedComment } from '../interface/comment.interface';
import { formattedComment } from '../utils/comment.util';

import {
    getArticleById,
    getPopulatedArticleById,
} from '../services/article.service';

import {
    transactionCreateCommentToArticle,
    getCommentById,
    transactionEraseCommentToArticle,
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
        const success: boolean = await transactionCreateCommentToArticle(data.text, userReq.userId, articleId);
        if (!success) throw new ResponseError(500, 'Gagal menambahkan komentar ke artikel');
        
        const populatedArticle = await getPopulatedArticleById(articleId);
        if (!populatedArticle) throw new ResponseError(404, 'Artikel tidak ditemukan');
        
        const formatArticle: IFormattedArticle = formattedArticle(populatedArticle);

        res.status(201).json({
            success: true,
            data: formatArticle,
            message: 'Komentar berhasil dibuat'
        });
    } catch (e) {
        next(e);
    }
}

export const erase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userReq: IUserRequest = req as IUserRequest;
        const articleId: Types.ObjectId = new Types.ObjectId(req.params.articleId);
        const commentId: Types.ObjectId = new Types.ObjectId(req.params.commentId);
        const article: IArticle | null = await getArticleById(articleId);
        if (!article) throw new ResponseError(404, 'Artikel tidak ditemukan');
        
        const comment: IComment | null = await getCommentById(commentId);
        if (!comment) throw new ResponseError(404, 'Komentar tidak ditemukan');
        if (!comment.author.equals(userReq.userId)) throw new ResponseError(403, 'Tidak memiliki hak akses untuk menghapus komentar ini');

        const success: boolean = await transactionEraseCommentToArticle(commentId, articleId);        
        if (!success) throw new ResponseError(500, 'Gagal menghapus komentar dari artikel');
        
        const populatedArticle = await getPopulatedArticleById(articleId);
        if (!populatedArticle) throw new ResponseError(404, 'Artikel tidak ditemukan');
        
        const formatArticle: IFormattedArticle = formattedArticle(populatedArticle);

        res.status(200).json({
            success: true,
            data: formatArticle,
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
        if (isLiked) await unlikeComment(commentId, userReq.userId);
        else await likeComment(commentId, userReq.userId);
    
        const populatedComment: IPopulatedComment | null = await getPopulatedCommentById(commentId);
        if (!populatedComment) throw new ResponseError(404, 'Komentar tidak ditemukan');

        const formatComment: IFormattedComment = formattedComment(populatedComment);
        const message: string = isLiked ? 'Komentar berhasil diunlike' : 'Komentar berhasil disukai';

        res.status(200).json({
            success: true,
            data: formatComment,
            message
        });
    } catch (e) {
        next(e);
    }
}