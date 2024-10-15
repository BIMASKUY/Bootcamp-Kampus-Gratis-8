import { IPopulatedBookmark } from "../interface/bookmark.interface";

export const formattedBookmark = (bookmark: IPopulatedBookmark): string => {
    return bookmark.article.title;
}

export const formattedBookmarks = (bookmarks: IPopulatedBookmark[]): string[] => {
    return bookmarks.map((bookmark: IPopulatedBookmark) => formattedBookmark(bookmark));
}