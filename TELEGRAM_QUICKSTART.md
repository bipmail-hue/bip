# 🚀 INSTRUCCIONES RÁPIDAS - Telegram Notificaciones

## ✅ APLICACIÓN FUNCIONANDO

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:3000  
**Credenciales:** demo / demo123

## 📱 PARA RECIBIR NOTIFICACIONES EN TELEGRAM

### Opción A: Configurar Tu Propio Bot (5 minutos)

1. **Abre Telegram** → Busca **@BotFather**
2. Envía: `/newbot`
3. Dale un nombre y username (debe terminar en 'bot')
4. **Copia el TOKEN** que te da

5. **Busca @userinfobot** en Telegram
6. Envíale cualquier mensaje
7. **Copia tu CHAT_ID** (número que te muestra)

8. **Edita el archivo:** \`homebanking-backend/.env\`
   \`\`\`
   TELEGRAM_BOT_TOKEN=TU_TOKEN_AQUI
   TELEGRAM_CHAT_ID=TU_CHAT_ID_AQUI
   \`\`\`

9. **Reinicia el backend** (Ctrl+C y vuelve a ejecutar \`npm run dev\`)

10. **¡Haz login en la app!** → Recibirás la notificación 🎉

### Opción B: Usar Sin Telegram (funciona igual)

Si no configuras Telegram, la app funciona perfectamente.
Solo verás en la consola: "⚠️ Telegram no configurado"

## 🎯 QUÉ RECIBIRÁS EN TELEGRAM

Cuando alguien haga login:

\`\`\`
🔐 NUEVO LOGIN EN BIP

👤 Usuario: demo
📧 Email: demo@homebanking.com  
👨‍💼 Nombre: Usuario Demo
🕐 Fecha: martes, 21 de enero de 2026, 18:30:45
🌐 IP: 127.0.0.1

✅ Login exitoso en Banco Provincia
\`\`\`

## 📖 Documentación Completa

Ver: [TELEGRAM_SETUP.md](TELEGRAM_SETUP.md)

---

**¡La app está lista!** Inicia sesión para probar 🚀
