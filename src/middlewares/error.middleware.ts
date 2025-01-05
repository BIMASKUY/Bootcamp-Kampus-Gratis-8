import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ResponseError, CustomZodError } from '../error/response.error';
import { translate } from '@vitalets/google-translate-api';

export const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        // console.error(err);
        if (err.name === 'CastError') { 
            res.status(400).json({
                success: false,
                message: 'Format ID tidak valid',
                data: {}
            });
        }
        else if (err instanceof ZodError) {
            if (err.issues.length === 1) { // 1 Error
                const customZodError = new CustomZodError(err, 400);
                const issue = customZodError.errors[0];
                const errorMessage = `${issue.path} ${issue.message}`;
                const { text } = await translate(errorMessage, { to: 'id' });
                res.status(customZodError.status).json({
                    success: customZodError.success,
                    message: text,
                    data: customZodError.data
                })
            }

            if (err.issues.length > 1) { // More than 1 Error
                const customZodError = new CustomZodError(err, 400);
                const errors = await Promise.all(customZodError.errors.map(
                    async (error) => {
                        const errorMessage = `${error.path[0]} ${error.message}`;
                        const { text } = await translate(errorMessage, { to: 'id' });
                        return {
                            field: error.path[0],
                            message: text
                        };
                    }
                ));
                res.status(customZodError.status).json({
                    success: customZodError.success,
                    message: 'Validasi gagal',
                    data: customZodError.data,
                    errors
                });
            }
        }
        else if (err instanceof ResponseError) {
            res.status(err.status).json({
                success: err.success,
                message: err.message,
                data: err.data
            })
        }
        else {
            res.status(500).json({
                success: false,
                message: err.message,
                data: {}
            })
        }
    }
    next();
}