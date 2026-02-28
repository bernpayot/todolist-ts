import { todoRepository } from "../repositories/todo.repository.js";
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from "../types/todo.types.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";

export class TodoService {
    getAllTodos(): Todo[] {
        return todoRepository.findAll();
    }

    getTodoById(id: string): Todo {
        const todo = todoRepository.findById(id);
        if (todo === null) {
            throw new NotFoundError(`Todo with id ${id} was not found.`);
        }
        return todo;
    }

    createTodo(data: CreateTodoRequest): Todo {
        if (data.title.trim().length === 0) {
            throw new ValidationError("Title must not be empty.");
        }
        return todoRepository.create(data);
    }

    updateTodo(id: string, data: UpdateTodoRequest): Todo {
        if (data.title !== undefined && data.title.trim().length === 0) {
            throw new ValidationError("Title must not be empty.");
        }
        const updatedTodo = todoRepository.update(id, data);
        if (updatedTodo === null) {
            throw new NotFoundError("Todo not found.");
        }
        return updatedTodo;
    }

    deleteTodo(id: string): void {
        const todo = todoRepository.delete(id);
        if (!todo) {
            throw new NotFoundError("Todo not found.");
        }
        return;
    }
}

export const todoService = new TodoService();