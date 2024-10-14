import { ZodError } from 'zod';

export class ResponseError extends Error {
    status: number;
    success: boolean;
    data: {};

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.success = false;
        this.data = {};
    }
}

export class CustomZodError extends ZodError {
    status: number;
    success: boolean;
    data: {};

    constructor(errors: ZodError, status: number) {
        super(errors.errors);
        this.status = status;
        this.data = {};
        this.success = false;
    }
}