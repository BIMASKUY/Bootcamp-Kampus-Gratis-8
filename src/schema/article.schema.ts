import { z } from 'zod';

const articleSchema = z.object({
    title: z.string().min(3).max(100),
    content: z.string().min(3)
}).strict();

const createArticleSchema = articleSchema.pick({ title: true, content: true }); // take title and content only

export type CreateArticleType = z.infer<typeof createArticleSchema>;

export const validateInputCreateArticleSchema = (input: CreateArticleType) : CreateArticleType => {
    return articleSchema.parse(input);
}