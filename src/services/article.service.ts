import { IArticle, Article } from '../models/article.model';
import { Types } from 'mongoose';
import { CreateArticleType } from '../schema/article.schema';
import { IPopulatedArticle } from '../interface/article.interface'

export const createArticle = async (data: CreateArticleType, idAuthor: Types.ObjectId): Promise<IArticle> => {
    const article: IArticle = await Article.create({
        title: data.title, 
        content: data.content,
        author: idAuthor,
        likes: [],
        comments: []
    });
    
    const populatedArticle = await Article.findById(article._id).populate('author', 'name');
    if (!populatedArticle) throw new Error('Article not found');
    return populatedArticle;
}

export const getArticleById = async (id: Types.ObjectId): Promise<IArticle | null> => {
    const article: IArticle | null = await Article.findById(id);
    return article;
}

export const getPopulatedArticleById = async (id: Types.ObjectId): Promise<IPopulatedArticle | null> => {
    const article: IArticle | null = await getArticleById(id);
    if (!article) return null;

    const populatedArticle: IPopulatedArticle = await article.populate('author');
    return populatedArticle;
}

export const getArticles = async (): Promise<IArticle[]> => {
    const articles: IArticle[] = await Article.find();
    return articles;
}

export const getPopulatedArticles = async (): Promise<IPopulatedArticle[]> => {
    const articles: IArticle[] = await getArticles();
    const populatedArticles: IPopulatedArticle[] = await Promise.all(
        articles.map(
            async article => await article.populate([
                'author', 
                'likedBy', 
                { 
                    path: 'comments',
                    populate: { 
                        path: 'authorId' 
                    } 
                },
            ])
        )
    );
    console.log(populatedArticles)
    return populatedArticles;
}

export const createCommentToArticle = async(commentId: Types.ObjectId, articleId: Types.ObjectId): Promise<IArticle | null> => {
    const updatedArticle = await Article.findOneAndUpdate(
        {
            _id: articleId
        },
        {
            $push: {
                comments: commentId
            }
        },
        {
            runValidators: true,
            new: true
        }
    )
    
    return updatedArticle;
}

export const eraseCommentFromArticle = async(commentId: Types.ObjectId, articleId: Types.ObjectId): Promise<IArticle | null> => {
    const updatedArticle = await Article.findOneAndUpdate(
        {
            _id: articleId
        },
        {
            $pull: {
                comments: commentId
            }
        },
        {
            runValidators: true,
            new: true
        }
    )

    return updatedArticle;
}