import type { Request, Response, NextFunction } from 'express';

export function validateCreateTodo(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
        return res.status(400).json({ error: "Request body is required."});
    }

    const { title, description } = req.body;

    if (title === undefined || title === null) {
        return res.status(400).json({ error: "Title is required."});
    }

    if (typeof title !== 'string') {
        return res.status(400).json({ error: "Title must be a string."});
    }

    if (description !== undefined && typeof description !== 'string') {
        return res.status(400).json({ error: "Description must be a string."});
    }

    next();
}

export function validateUpdateTodo(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
        return res.status(400).json({ error: "Request body is required."});
    }

    const { title, description, isCompleted } = req.body;

    if (title !== undefined && typeof title !== 'string') {
        return res.status(400).json({ error: "Title must be a string."});
    }

    if (description !== undefined && typeof description !== 'string') {
        return res.status(400).json({ error: "Description must be a string."});
    }

    if (isCompleted !== undefined && typeof isCompleted !== 'boolean') {
        return res.status(400).json({ error: "isCompleted must be a boolean."});
    }

    next();
}