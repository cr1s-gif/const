import express from 'express';
import { generateQuestions, healthCheck } from '../controllers/questionController.js';

const router = express.Router();

router.post('/generate', generateQuestions);
router.get('/health', healthCheck);

export default router;