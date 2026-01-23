// 💳 Controlador de transacciones
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

// Datos de ejemplo
const transactions = [
  {
    id: '1',
    userId: '1',
    accountId: '1',
    date: '2026-01-20T10:30:00Z',
    description: 'Transferencia recibida',
    amount: 15000,
    type: 'credit' as const,
    balance: 125000.50,
  },
  {
    id: '2',
    userId: '1',
    accountId: '1',
    date: '2026-01-19T15:45:00Z',
    description: 'Pago de servicios',
    amount: -3500,
    type: 'debit' as const,
    balance: 110000.50,
  },
  {
    id: '3',
    userId: '1',
    accountId: '1',
    date: '2026-01-18T09:20:00Z',
    description: 'Compra en supermercado',
    amount: -12500,
    type: 'debit' as const,
    balance: 113500.50,
  },
  {
    id: '4',
    userId: '1',
    accountId: '1',
    date: '2026-01-17T14:10:00Z',
    description: 'Depósito cajero automático',
    amount: 20000,
    type: 'credit' as const,
    balance: 126000.50,
  },
  {
    id: '5',
    userId: '1',
    accountId: '1',
    date: '2026-01-16T11:05:00Z',
    description: 'Transferencia enviada',
    amount: -8000,
    type: 'debit' as const,
    balance: 106000.50,
  },
];

export const getRecentTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userTransactions = transactions
      .filter((tx) => tx.userId === req.userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
    
    res.json(userTransactions);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener transacciones' });
  }
};
