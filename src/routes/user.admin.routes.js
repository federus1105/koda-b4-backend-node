import express from 'express';
import { CreateUserHandler, ListUserHandler } from '../handlers/user.admin.handlers.js';
import upload from '../pkg/libs/upload.js';
import { CreateUserValidator } from '../pkg/utils/validators/user.admin.validators.js';
import { validate } from '../pkg/libs/validate.js';

const router = express.Router();

router.get('/', ListUserHandler)
router.post('/', upload.single("photos"), CreateUserValidator, validate , CreateUserHandler)


export default router