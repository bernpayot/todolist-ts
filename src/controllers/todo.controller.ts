import type { Request, Response } from 'express';
import { todoService } from '../services/todo.services.js'
import type { CreateTodoRequest, UpdateTodoRequest } from '../types/todo.types.js'
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getAllTodos = asyncHandler(async (req: Request, res: Response) => {
    const todo = await todoService.getAllTodos();
    res.status(200).json(todo);
});

export const getTodoById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const todo = await todoService.getTodoById(id as string);
    res.status(200).json(todo);
});

export const createTodo = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as CreateTodoRequest;
    const todo = await todoService.createTodo(data);
    res.status(201).json(todo);
});

export const updateTodo = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body as UpdateTodoRequest;
    const todo = await todoService.updateTodo(id as string, data);
    res.status(200).json(todo);
});

export const deleteTodo = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await todoService.deleteTodo(id as string);
    res.status(204).send();
});