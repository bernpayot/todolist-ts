import { Router } from "express";
import * as todoController from '../controllers/todo.controller.js';
import { validateCreateTodo, validateUpdateTodo } from "../middleware/validation.middleware.js";

const router = Router();

router.post('/', validateCreateTodo, todoController.createTodo);
router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodoById);
router.patch('/:id', validateUpdateTodo, todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

export default router;