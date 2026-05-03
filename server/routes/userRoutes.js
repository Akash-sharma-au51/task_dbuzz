import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/userController.js';
import { validateBody, registerSchema, loginSchema } from '../utils/validation.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerUser);
router.post('/login', validateBody(loginSchema), loginUser);
router.post('/logout', logoutUser);

export default router;