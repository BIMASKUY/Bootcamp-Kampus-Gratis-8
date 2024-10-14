import { IUser } from '../models/user.model'
import { IArticle } from '../models/article.model'

interface IComment {
    text: string,
    likedBy: IUser
}

export interface IPopulatedArticle extends Pick <IArticle, 'title' | 'content'> {
    author: IUser
    likedBy: IUser[]
    comments: IComment[]
}

export interface IFormattedArticle extends Pick <IArticle, 'title' | 'content'> {
    author: string
    likedBy: string[]
    comments: string[]
}