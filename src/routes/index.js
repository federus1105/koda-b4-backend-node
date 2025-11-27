import express from 'express';
import { Register } from '../handler/auth.handler.js';

const router = express.Router();

router.post('/', Register)