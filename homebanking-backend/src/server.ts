// 🔐 Servidor Express - SIN LIMITACIONES
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import accountRoutes from './routes/account.routes';
import transactionRoutes from './routes/transaction.routes';
import verificationRoutes from './routes/verification.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Confiar en proxy (Railway, Vercel, etc.)
app.set('trust proxy', 1);

// 🛡️ Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS configurado
app.use(cors({
  origin: '*',
  credentials: false,
}));

app.use(express.json({ limit: '50mb' })); // ⬆️ Aumentado para imágenes base64
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 📍 Rutas - SIN LIMITACIONES
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/verification', verificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message,
  });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
  console.log(`🔒 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 Acceso desde red local habilitado`);
});

export default app;
