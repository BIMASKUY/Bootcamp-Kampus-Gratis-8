import { Request, Response, NextFunction } from 'express';
import { IArticle } from '../models/article.model';
import { ResponseError } from '../error/response.error';
import { IUserRequest } from '../interface/user.interface';
import { IFormattedArticle } from '../interface/article.interface';
import { Types } from 'mongoose'
import { formattedArticle, formattedArticles } from '../utils/article.util';

import { 
	CreateArticleType,
	validateInputCreateArticleSchema,
} from '../schema/article.schema';

import { 
	createArticle,
	getArticles,
    getPopulatedArticles,
	getPopulatedArticleById
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
        // console.log(populatedArticles); // print untuk debug
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