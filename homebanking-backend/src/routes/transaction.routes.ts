// 🛣️ Rutas de transacciones
import { Router } from 'express';
import { getRecentTransactions } from '../controllers/transaction.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/recent', authenticateToken, getRecentTransactions);

export default router;
