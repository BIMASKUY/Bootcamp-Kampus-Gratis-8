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

export const getBookmarkByArticleId = async (articleId: Types.ObjectId, userId: Types.ObjectId): Promise<IBookmark | null> => {
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

export const deleteBookmarkByArticleId = async (articleId: Types.ObjectId, userId: Types.ObjectId): Promise<IBookmark | null> => {
    const bookmark: IBookmark | null = await Bookmark.findOneAndDelete({
        article: articleId,
        user: userId
    });

    return bookmark;
}

export const deleteBookmarksByArticleId = async (articleId: Types.ObjectId): Promise<boolean> => {
    await Bookmark.deleteMany({
        article: articleId
    });

    return true
}

export const getBookmarks = async (userId: Types.ObjectId): Promise<IBookmark[]> => {
    const bookmarks: IBookmark[] = await Bookmark.find({
        user: userId
    });

    return bookmarks;
}

export const getBookmarksById = async (bookmarkId: Types.ObjectId): Promise<IBookmark | null> => {
    const bookmark: IBookmark | null = await Bookmark.findById(bookmarkId);
    return bookmark;
}

export const getPopulatedBookmarkById = async (bookmarkId: Types.ObjectId): Promise<IPopulatedBookmark | null> => {
    const bookmark: IBookmark | null = await getBookmarksById(bookmarkId);
    if (!bookmark) return null;

    const populatedBookmark: IPopulatedBookmark | null = await bookmark.populate('article');
    return populatedBookmark;
}

export const getPopulatedBookmarks = async (userId: Types.ObjectId): Promise<IPopulatedBookmark[]> => {
    const bookmarks: IBookmark[] = await getBookmarks(userId);

    const populatedBookmarks: IPopulatedBookmark[] = await Promise.all(bookmarks.map(
        async (bookmark: IBookmark) => {
            const populatedBookmark: IPopulatedBookmark | null = await bookmark.populate('article');
        return populatedBookmark;
    }));
    
    return populatedBookmarks;
}