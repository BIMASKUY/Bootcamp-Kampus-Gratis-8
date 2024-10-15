import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

import { ResponseError, CustomZodError } from '../error/response.error';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        console.error(err);
        if (err.name === 'CastError') res.status(400).send('error: format ID tidak valid');
        else if (err instanceof ZodError) {
            const customZodError = new CustomZodError(err, 400);
            res.status(customZodError.status).json({
                success: customZodError.success,
                message: fromZodError(customZodError).message,
                data: customZodError.data
            })
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