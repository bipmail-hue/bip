// 📊 Controlador de cuentas
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

// Datos de ejemplo
const accounts = [
  {
    id: '1',
    userId: '1',
    accountNumber: '0110-0123-4567-8901',
    balance: 125000.50,
    currency: 'ARS',
    type: 'checking' as const,
  },
  {
    id: '2',
    userId: '1',
    accountNumber: '0110-0987-6543-2109',
    balance: 50000.00,
    currency: 'ARS',
    type: 'savings' as const,
  },
];

export const getAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userAccounts = accounts.filter((acc) => acc.userId === req.userId);
    res.json(userAccounts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cuentas' });
  }
};
