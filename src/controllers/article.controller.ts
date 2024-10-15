import { Request, Response, NextFunction } from 'express';
import { IArticle } from '../models/article.model';
import { ResponseError } from '../error/response.error';
import { IUserRequest } from '../interface/user.interface';
import { IFormattedArticle, IPopulatedArticle } from '../interface/article.interface';
import { Types } from 'mongoose'
import { formattedArticle, formattedArticles } from '../utils/article.util';

import { 
	CreateArticleType,
	validateInputCreateArticleSchema,
} from '../schema/article.schema';

import { 
	createArticle,
    getPopulatedArticles,
	getPopulatedArticleById,
    likeArticle,
    unlikeArticle,
    getArticleById
} from '../services/article.service';

export const create = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const userReq: IUserRequest = req as IUserRequest;
        const data: CreateArticleType = validateInputCreateArticleSchema(req.body);
        const article: IArticle = await createArticle(data, userReq.userId);
        const populatedArticle = await getPopulatedArticleById(article.id);
        if (!populatedArticle) throw new ResponseError(404, 'Artikel tidak ditemukan');
        const formatArticle: IFormattedArticle = formattedArticle(populatedArticle);

        res.status(201).json({
            success: true,
            data: formatArticle,
            message: 'Artikel berhasil dibuat'
        });
    } catch (e) {
      next(e);
    }
}

export const get = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const populatedArticles = await getPopulatedArticles();
        console.log(populatedArticles); // print untuk debug
        const formatArticles: IFormattedArticle[] = formattedArticles(populatedArticles);
        res.status(200).json({
            success: true,
            data: formatArticles,
            message: 'Berhasil mendapatkan artikel'
        });
    } catch (e) {
        next(e);
    }
}

export const likes = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const userReq: IUserRequest = req as IUserRequest;
        const articleId: Types.ObjectId = new Types.ObjectId(req.params.articleId);
        const article: IArticle | null = await getArticleById(articleId);
        if (!article) throw new ResponseError(404, 'Artikel tidak ditemukan');

        const isLiked: boolean = article.likedBy.some(userId => userId.equals(userReq.userId));
        if (isLiked) await unlikeArticle(articleId, userReq.userId);
        else await likeArticle(articleId, userReq.userId);

        const populatedArticle: IPopulatedArticle | null = await getPopulatedArticleById(articleId);
        if (!populatedArticle) throw new ResponseError(404, 'Artikel tidak ditemukan');

        const formatArticle: IFormattedArticle = formattedArticle(populatedArticle);
        const message: string = isLiked ? 'Artikel berhasil diunlike' : 'Artikel berhasil disukai';

        res.status(200).json({
            success: true,
            data: formatArticle,
            message
        });
    } catch (e) {
        next(e);
    }
}