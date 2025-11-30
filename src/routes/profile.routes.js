import express from 'express';
import { GetProfileHandler, updateProfileHandler } from '../handlers/profile.handlers.js';
import upload from '../pkg/libs/upload.js';
import { updateProfileValidator } from '../pkg/utils/validators/profileValidators.js';
import { validate } from '../pkg/libs/validate.js';

const router = express.Router();

router.patch('/', upload.single("photos"), updateProfileValidator, validate, updateProfileHandler)
router.get('/', GetProfileHandler)


export default router