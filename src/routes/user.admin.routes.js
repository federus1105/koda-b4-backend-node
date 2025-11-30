import express from 'express';
import { ListUserHandler } from '../handlers/user.admin.handlers.js';

const router = express.Router();

router.get('/', ListUserHandler)


export default router