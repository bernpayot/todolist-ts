import type { Request, Response, NextFunction } from 'express';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export function errorHandler (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof NotFoundError) {
        return res.status(404).json({
            error: "NotFoundError",
            message: err.message
        });
    }

    if (err instanceof ValidationError) {
        return res.status(400).json({
            error: "ValidationError",
            message: err.message
        });
    }

    console.error("Unexpected error: " , {
        message: err.message,
        stack: err.stack,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
        url: req.originalUrl,
        timestamp: new Date().toISOString()

    });

    return res.status(500).json({
        error: "InternalServerError",
        message: "An unexpected error occurred."
    });
}


