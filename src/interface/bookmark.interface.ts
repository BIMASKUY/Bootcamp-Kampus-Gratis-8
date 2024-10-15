import { IBookmark } from '../models/bookmark.model'
import { IArticle } from '../models/article.model'

export interface IPopulatedBookmark extends Pick <IBookmark, 'user'> {
    article: IArticle
}