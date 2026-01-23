// 🔐 Controlador de autenticación
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendLoginNotification } from '../utils/telegram.service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Base de datos simulada (en producción usar una DB real)
const users = [
  {
    id: '1',
    username: 'demo',
    password: bcrypt.hashSync('demo123', 10), // Contraseña hasheada
    name: 'Usuario Demo',
    email: 'demo@homebanking.com',
  },
  {
    id: '2',
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10), // Contraseña hasheada
    name: 'Administrador',
    email: 'admin@homebanking.com',
  },
];

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validación
    if (!username || !password) {
      res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
      return;
    }

    // Buscar usuario
    const user = users.find((u) => u.username === username);
    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 📱 Enviar notificación a Telegram con información completa
    const clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Desconocido';
    
    await sendLoginNotification({
      username: user.username,
      name: user.name,
      email: user.email,
      timestamp: new Date().toLocaleString('es-AR', {
        dateStyle: 'full',
        timeStyle: 'medium',
      }),
      ip: Array.isArray(clientIp) ? clientIp[0] : clientIp,
      userAgent: userAgent,
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Sesión cerrada exitosamente' });
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = users.find((u) => u.id === req.userId);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
