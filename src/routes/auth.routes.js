import express from 'express';
import { Register } from '../handlers/auth.handlers.js';
import { validate } from '../pkg/libs/validate.js';
import { authValidation } from '../pkg/utils/validator.js';

const router = express.Router();

router.post('/register', authValidation, validate, Register)


export default router