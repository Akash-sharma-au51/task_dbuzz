import express from 'express';
import { createTask, deleteTask, getTasks, getTaskById, updateTask } from '../controllers/taskController.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
import { validateBody, taskCreateSchema, taskUpdateSchema } from '../utils/validation.js';

const router = express.Router();

router.post('/', authMiddleware, validateBody(taskCreateSchema), createTask);
router.get('/', authMiddleware, getTasks);
router.get('/:id', authMiddleware, getTaskById);
router.put('/:id', authMiddleware, validateBody(taskUpdateSchema), updateTask);
router.delete('/:id', authMiddleware, isAdmin, deleteTask);

export default router;