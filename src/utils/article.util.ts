import { IFormattedArticle, IPopulatedArticle } from "../interface/article.interface";
import { Types } from 'mongoose';

export const formattedArticle = (article: IPopulatedArticle): IFormattedArticle => {
    return {
        title: article.title,
        content: article.content,
        author: article.author.name,
        likedBy: article.likedBy.map(user => user.name),
        comments: article.comments.map(comment => comment.text)
    }
}

export const formattedArticles = (articles: IPopulatedArticle[]): IFormattedArticle[] => {
    return articles.map(article => formattedArticle(article));
}

export const stringToObjectId = (id: string): Types.ObjectId => {
    return new Types.ObjectId(id);
}