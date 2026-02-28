import { randomUUID } from 'crypto';
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo.types.js';

class TodoRepository {
    private todos: Todo[] = [];

    findAll(): Todo[] {
        return this.todos;
    }

    findById(id: string): Todo | null {
        const todo = this.todos.find(t => t.id === id);
        return todo ?? null;
    }

    create(data: CreateTodoRequest): Todo {
        const todo = {
            id: randomUUID(),
            title: data.title,
            description: data.description || "",
            isCompleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        this.todos.push(todo);
        return todo;
    }

    update(id: string, data: UpdateTodoRequest): Todo | null {
        const existingTodo = this.findById(id);
        if (!existingTodo) {
            return null;
        }

        const updatedTodo = {
            ...existingTodo,
            ...data,
            updatedAt: new Date().toISOString()
        };

        const index = this.todos.findIndex(t => t.id === id);
        if (index !== -1) {
            return this.todos[index] = updatedTodo;
        }

        return null;
    }

    delete(id: string): boolean {
        const originalLength = this.todos.length;
        this.todos = this.todos.filter(t => t.id !== id);
        const newLength = this.todos.length;

        if (originalLength === newLength) {
            return false
        }
        return true;
    }
}

export const todoRepository = new TodoRepository();
