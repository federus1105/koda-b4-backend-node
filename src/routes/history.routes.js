import express from 'express';
import { HistoryHandler } from '../handlers/history.handlers.js';

const router = express.Router();

router.get('/', HistoryHandler)


export default router