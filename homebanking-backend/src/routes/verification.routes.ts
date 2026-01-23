// 🛣️ Rutas de verificación
import { Router } from 'express';
import { verifyDNI, verifyFacial } from '../controllers/verification.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/dni', authenticateToken, verifyDNI);
router.post('/facial', authenticateToken, verifyFacial);

export default router;
