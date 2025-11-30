import express from 'express';
import { DetailHistoryHandler, HistoryHandler } from '../handlers/history.handlers.js';

const router = express.Router();

router.get('/', HistoryHandler)
router.get('/:id', DetailHistoryHandler)


export default router