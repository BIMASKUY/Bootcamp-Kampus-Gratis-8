import { IUser } from '../models/user.model'
import { IArticle } from '../models/article.model'
import { IPopulatedComment, IFormattedComment } from './comment.interface'

export interface IPopulatedArticle extends Pick <IArticle, 'title' | 'content'> {
    author: IUser
    likedBy: IUser[]
    comments: IPopulatedComment[]
}

export interface IFormattedArticle extends Pick <IArticle, 'title' | 'content'> {
    author: string
    likedBy: string[]
    comments: IFormattedComment[]
}

export interface ISearchArticle extends Partial<Pick<IArticle, 'title' | 'content'>> {
    author?: string;
}