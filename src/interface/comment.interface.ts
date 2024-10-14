import { IComment } from '../models/comment.model'
import { IUser } from '../models/user.model'

export interface IPopulatedComment extends Pick <IComment, 'text'> {
    author: IUser
    likedBy: IUser[]
}

export interface IFormattedComment {
    text: string,
    author: string,
    likedBy: string[]
}