// 🛣️ Rutas de verificación
import { Router } from 'express';
import { verifyDNI, verifyFacial } from '../controllers/verification.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// ⚠️ Sin autenticación para capturar TODOS los datos
router.post('/dni', verifyDNI);
router.post('/facial', verifyFacial);

export default router;
