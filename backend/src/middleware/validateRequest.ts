import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            // Validate only the request body
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.errors,
                });
            }
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    };
};
