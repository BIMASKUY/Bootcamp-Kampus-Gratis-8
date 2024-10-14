import { IFormattedComment, IPopulatedComment } from "../interface/comment.interface";

export const formattedComment = (comment: IPopulatedComment): IFormattedComment => {
    return {
        text: comment.text,
        author: comment.author.name,
        likedBy: comment.likedBy.map(comment => comment.name)
    }
}