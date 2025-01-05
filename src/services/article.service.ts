import { IArticle, Article } from '../models/article.model';
import mongoose, { Types } from 'mongoose';
import { CreateArticleType, UpdateArticleType } from '../schema/article.schema';
import { IPopulatedArticle, ISearchArticle } from '../interface/article.interface'
import { deleteCommentById } from './comment.service';
import { deleteBookmarksByArticleId } from './bookmark.service';

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

    const populatedArticle: IPopulatedArticle = await article.populate([
        'author', 
        'likedBy', 
        {
            path: 'comments',
            populate: {
                path: 'author likedBy'
            },
        },
    ]);

    return populatedArticle;
}

export const getArticles = async (): Promise<IArticle[]> => {
    const articles: IArticle[] = await Article.find();
    return articles;
}

export const getPopulatedArticles = async (search: ISearchArticle): Promise<IPopulatedArticle[]> => {
    const articles: IArticle[] = await getArticles();
    let populatedArticles: IPopulatedArticle[] = await Promise.all(
        articles.map(
            async article => await article.populate([
                'author', 
                'likedBy', 
                { 
                    path: 'comments',
                    populate: { 
                        path: 'author likedBy',
                    } 
                },
            ])
        )
    );

    // filter articles (if any)
    const { title, content, author } = search;
    if (title) populatedArticles = populatedArticles.filter(populatedArticle => populatedArticle.title.includes(title));
    if (content) populatedArticles = populatedArticles.filter(populatedArticle => populatedArticle.content.includes(content));
    if (author) populatedArticles = populatedArticles.filter(populatedArticle => populatedArticle.author.name.includes(author));
    
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

export const deleteCommentFromArticle = async(commentId: Types.ObjectId, articleId: Types.ObjectId): Promise<IArticle | null> => {
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

export const likeArticle = async(articleId: Types.ObjectId, userId: Types.ObjectId): Promise<IArticle | null> => {
    const updatedArticle = await Article.findOneAndUpdate(
        {
            _id: articleId
        },
        {
            $addToSet: {
                likedBy: userId
            }
        },
        {
            runValidators: true,
            new: true
        }
    )

    return updatedArticle;
}

export const unlikeArticle = async(articleId: Types.ObjectId, userId: Types.ObjectId): Promise<IArticle | null> => {
    const updatedArticle = await Article.findOneAndUpdate(
        {
            _id: articleId
        },
        {
            $pull: {
                likedBy: userId
            }
        },
        {
            runValidators: true,
            new: true
        }
    )

    return updatedArticle;
}

export const updateArticle = async(articleId: Types.ObjectId, data: UpdateArticleType): Promise<IArticle | null> => {
    const updatedArticle = await Article.findOneAndUpdate(
        {
            _id: articleId
        },
        {
            title: data.title,
            content: data.content
        },
        {
            runValidators: true,
            new: true
        }
    )

    return updatedArticle;
}

export const deleteArticleById = async(articleId: Types.ObjectId): Promise<IArticle | null> => {
    const deletedArticle = await Article.findOneAndDelete(articleId);
    return deletedArticle;
}

export const transactionDeleteArticleWithCommentAndBookmark = async(articleId: Types.ObjectId): Promise<boolean> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const article: IArticle | null = await getArticleById(articleId);
    if (!article) {
        await session.abortTransaction();
        await session.endSession();
        return false;
    }
    
    const commentIds = article.comments;
    const deletePromises = commentIds.map(commentId => deleteCommentById(commentId));
    const deleteResults = await Promise.all(deletePromises);

    const isFailedDeleteComment = deleteResults.some(result => !result); //fail disini
    if (isFailedDeleteComment) {
        await session.abortTransaction();
        await session.endSession();
        return false;
    }

    console.log('halo dek')

    const deleteBookmarks = await deleteBookmarksByArticleId(articleId);
    if (!deleteBookmarks) {
        await session.abortTransaction();
        await session.endSession();
        return false;
    }

    const deletedArticle = await deleteArticleById(articleId);
    if (!deletedArticle) {
        await session.abortTransaction();
        await session.endSession();
        return false;
    }

    await session.commitTransaction();
    await session.endSession();
    return true;
}