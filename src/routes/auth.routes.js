import express from 'express';
import { Register, Login, ForgotPassword, ResetPassword } from '../handlers/auth.handlers.js';
import { validate } from '../pkg/libs/validate.js';
import { ForgotPasswordValidator, loginValidation, registerValidation, ResetPasswordValidator } from '../pkg/utils/validators/authValidators.js';

const router = express.Router();

router.post('/register', registerValidation, validate, Register)
router.post('/login', loginValidation, validate, Login )
router.post('/forgot-password', ForgotPasswordValidator, validate, ForgotPassword )
router.post('/reset-password', ResetPasswordValidator, validate, ResetPassword )


export default router