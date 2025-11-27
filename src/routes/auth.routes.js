import express from 'express';
import { Register,Login } from '../handlers/auth.handlers.js';
import { validate } from '../pkg/libs/validate.js';
import { loginValidation, registerValidation } from '../pkg/utils/validators/authValidators.js';

const router = express.Router();

router.post('/register', registerValidation, validate, Register)
router.post('/login', loginValidation, validate, Login )


export default router