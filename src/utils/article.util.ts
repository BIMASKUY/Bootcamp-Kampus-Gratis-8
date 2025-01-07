import { IFormattedArticle, IPopulatedArticle } from "../interface/article.interface";

export const formattedArticle = (article: IPopulatedArticle): IFormattedArticle => {
    return {
        title: article.title,
        content: article.content,
        author: article.author?.name || 'Unknown',
        likedBy: article.likedBy?.map(user => user?.name || 'Unknown') || [], 
        comments: article.comments?.map(comment => ({
            text: comment.text,
            author: comment.author?.name || 'Unknown', 
            likedBy: comment.likedBy?.map(user => user?.name || 'Unknown') || []
        })) || [] 
    }
}


export const formattedArticles = (articles: IPopulatedArticle[]): IFormattedArticle[] => {
    return articles.map(article => formattedArticle(article));
}