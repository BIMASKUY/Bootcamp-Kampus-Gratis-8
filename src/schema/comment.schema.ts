import { z } from 'zod';

const commentSchema = z.object({
    text: z.string().min(3).max(512)
}).strict();

const createCommentSchema = commentSchema.pick({ text: true }); // take text

export type CreateCommentType = z.infer<typeof createCommentSchema>;

export const validateInputCreateArticleSchema = (input: CreateCommentType) : CreateCommentType => {
    return createCommentSchema.parse(input);
}