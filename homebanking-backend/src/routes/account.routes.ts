// 🛣️ Rutas de cuentas
import { Router } from 'express';
import { getAccounts } from '../controllers/account.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getAccounts);

export default router;
