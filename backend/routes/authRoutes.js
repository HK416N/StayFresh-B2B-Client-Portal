import { Router } from 'express';
import * as controller from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../validators/authValidator.js';

const router = Router();

router.post('/signup', validateSignup, controller.signup);
router.post('/login', validateLogin, controller.login);

export default router;