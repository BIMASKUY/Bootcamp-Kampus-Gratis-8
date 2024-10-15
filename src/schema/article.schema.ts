import { z } from 'zod';

const articleSchema = z.object({
    title: z.string().min(3).max(100),
    content: z.string().min(3)
}).strict();

const createArticleSchema = articleSchema.pick({ title: true, content: true }); // take title and content only
const updateArticleSchema = articleSchema.partial({ title: true, content: true }); // take title and content but not required

export type CreateArticleType = z.infer<typeof createArticleSchema>;
export type UpdateArticleType = z.infer<typeof updateArticleSchema>;

export const validateInputCreateArticleSchema = (input: CreateArticleType) : CreateArticleType => {
    return articleSchema.parse(input);
}

export const validateUpdateArticleSchema = (input: UpdateArticleType) : UpdateArticleType => {
    return updateArticleSchema.parse(input);
}