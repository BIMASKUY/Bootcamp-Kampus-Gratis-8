import { Request, Response, NextFunction } from 'express';
import { IArticle } from '../models/article.model';
import { IBookmark } from '../models/bookmark.model';
import { ResponseError } from '../error/response.error';
import { IUserRequest } from '../interface/user.interface';
import { IPopulatedBookmark } from '../interface/bookmark.interface';
import { Types } from 'mongoose';
import { formattedBookmark, formattedBookmarks } from '../utils/bookmark.util';
import { getArticleById } from '../services/article.service';

import {
    createBookmark,
    getBoorkmarkByArticleId,
    deleteBookmarkById,
    getPopulatedBookmarks,
    getPopulatedBookmarkById
} from '../services/bookmark.service';

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userReq: IUserRequest = req as IUserRequest;
        const articleId: Types.ObjectId = new Types.ObjectId(req.params.articleId);
        const article: IArticle | null = await getArticleById(articleId);
        if (!article) throw new ResponseError(404, 'Artikel tidak ditemukan');

        const isBookmarked: IBookmark | null = await getBoorkmarkByArticleId(articleId, userReq.userId);
        if (isBookmarked) throw new ResponseError(400, 'Artikel sudah ada dalam daftar bookmark');

        const bookmark: IBookmark = await createBookmark(articleId, userReq.userId);
        if (!bookmark) throw new ResponseError(500, 'Gagal membuat bookmark');

        const bookmarkId: Types.ObjectId = bookmark._id as Types.ObjectId;
        const populatedBookmark: IPopulatedBookmark | null = await getPopulatedBookmarkById(bookmarkId);
        if (!populatedBookmark) throw new ResponseError(500, 'Gagal mendapatkan bookmark');

        const formatBookmark: string = formattedBookmark(populatedBookmark);

        res.status(201).json({
            success: true,
            data: {
                bookmark: formatBookmark
            },
            message: 'Bookmark berhasil dibuat'
        });
    }
    catch (e) {
        next(e);
    }
};

export const deletes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userReq: IUserRequest = req as IUserRequest;
        const articleId: Types.ObjectId = new Types.ObjectId(req.params.articleId);
        const article: IArticle | null = await getArticleById(articleId);
        if (!article) throw new ResponseError(404, 'Artikel tidak ditemukan');

        const isBookmarked: IBookmark | null = await getBoorkmarkByArticleId(articleId, userReq.userId);
        if (!isBookmarked) throw new ResponseError(400, 'Artikel tidak ada dalam daftar bookmark');

        const bookmarkId: Types.ObjectId = isBookmarked._id as Types.ObjectId;
        const bookmark: IBookmark | null = await deleteBookmarkById(bookmarkId);
        if (!bookmark) throw new ResponseError(500, 'Gagal menghapus bookmark');

        res.status(200).json({
            success: true,
            data: {},
            message: 'Bookmark berhasil dihapus'
        });
    }
    catch (e) {
        next(e);
    }
}

export const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userReq: IUserRequest = req as IUserRequest;
        const populatedBookmarks: IPopulatedBookmark[] = await getPopulatedBookmarks(userReq.userId);
        const formatBookmarks: string[] = formattedBookmarks(populatedBookmarks);

        res.status(200).json({
            success: true,
            data: {
                bookmarks: formatBookmarks
            },
            message: 'Berhasil mendapatkan bookmark'
        });
    }
    catch (e) {
        next(e);
    }
}