import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.post('/generate-key', authController.generateApiKey);

export const authRoutes = router;