import { IBookmark, Bookmark } from '../models/bookmark.model';
import { Types } from 'mongoose';
import { IPopulatedBookmark } from '../interface/bookmark.interface';

export const createBookmark = async (articleId: Types.ObjectId, userId: Types.ObjectId): Promise<IBookmark> => {
    const bookmark: IBookmark = await Bookmark.create({
        article: articleId,
        user: userId
    });

    return bookmark;
}

export const getBoorkmarkByArticleId = async (articleId: Types.ObjectId, userId: Types.ObjectId): Promise<IBookmark | null> => {
    const bookmark: IBookmark | null = await Bookmark.findOne({
        article: articleId,
        user: userId
    });

    return bookmark;
}

export const deleteBookmarkById = async (bookmarkId: Types.ObjectId): Promise<IBookmark | null> => {
    const bookmark: IBookmark | null = await Bookmark.findByIdAndDelete(bookmarkId);

    return bookmark;
}

export const getBoorkmarks = async (userId: Types.ObjectId): Promise<IBookmark[]> => {
    const bookmarks: IBookmark[] = await Bookmark.find({
        user: userId
    });

    return bookmarks;
}

export const getBoorkmarksById = async (bookmarkId: Types.ObjectId): Promise<IBookmark | null> => {
    const bookmark: IBookmark | null = await Bookmark.findById(bookmarkId);
    return bookmark;
}

export const getPopulatedBookmarkById = async (bookmarkId: Types.ObjectId): Promise<IPopulatedBookmark | null> => {
    const bookmark: IBookmark | null = await getBoorkmarksById(bookmarkId);
    if (!bookmark) return null;

    const populatedBookmark: IPopulatedBookmark | null = await bookmark.populate('article');
    return populatedBookmark;
}

export const getPopulatedBookmarks = async (userId: Types.ObjectId): Promise<IPopulatedBookmark[]> => {
    const bookmarks: IBookmark[] = await getBoorkmarks(userId);

    const populatedBookmarks: IPopulatedBookmark[] = await Promise.all(bookmarks.map(
        async (bookmark: IBookmark) => {
            const populatedBookmark: IPopulatedBookmark | null = await bookmark.populate('article');
        return populatedBookmark;
    }));
    
    return populatedBookmarks;
}