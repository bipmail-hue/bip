# 📱 Configuración de Notificaciones por Telegram

## 🤖 Paso 1: Crear tu Bot de Telegram

1. **Abre Telegram** en tu celular o computadora

2. **Busca a @BotFather** (es el bot oficial de Telegram para crear bots)

3. **Envía el comando:** `/newbot`

4. **Sigue las instrucciones:**
   - Te pedirá un nombre para tu bot (ej: "BIP Notificaciones")
   - Luego un username (debe terminar en 'bot', ej: "bip_notif_bot")

5. **Guarda el TOKEN** que te da BotFather
   - Se ve así: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`
   - ⚠️ **NO lo compartas con nadie!**

## 🆔 Paso 2: Obtener tu CHAT_ID

1. **Busca a @userinfobot** en Telegram

2. **Envía cualquier mensaje** (o presiona /start)

3. **Te responderá con tu información**, incluyendo tu **Chat ID**
   - Se ve así: `123456789`
   - Este es tu identificador único

## ⚙️ Paso 3: Configurar en el Backend

1. **Abre el archivo:** `homebanking-backend/.env`

2. **Agrega tus credenciales:**
   \`\`\`env
   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   TELEGRAM_CHAT_ID=123456789
   \`\`\`

3. **Guarda el archivo** y **reinicia el servidor backend**

## ✅ Paso 4: Probar las Notificaciones

1. **Inicia sesión en la aplicación BIP** con:
   - Usuario: `demo`
   - Contraseña: `demo123`

2. **¡Deberías recibir un mensaje en Telegram!** con:
   - 👤 Usuario que se logueó
   - 📧 Email
   - 👨‍💼 Nombre completo
   - 🕐 Fecha y hora exacta
   - 🌐 Dirección IP

## 📱 Ejemplo de Notificación

Cuando alguien se loguee, recibirás:

\`\`\`
🔐 NUEVO LOGIN EN BIP

👤 Usuario: demo
📧 Email: demo@homebanking.com
👨‍💼 Nombre: Usuario Demo
🕐 Fecha: martes, 21 de enero de 2026, 18:30:45
🌐 IP: 127.0.0.1

✅ Login exitoso en Banco Provincia Internet Banking
\`\`\`

## 🛠️ Comandos Útiles

### Reiniciar el Bot
Si cambias la configuración:
\`\`\`bash
cd homebanking-backend
npm run dev
\`\`\`

### Ver Logs en Consola
El backend mostrará:
- ✅ "Notificación enviada a Telegram" (cuando funciona)
- ⚠️ "Telegram no configurado" (si falta configuración)
- ❌ "Error enviando notificación" (si hay problemas)

## 🔧 Troubleshooting

### ❌ No recibo notificaciones

1. **Verifica que el TOKEN y CHAT_ID estén correctos**
   - No debe haber espacios extra
   - Copia y pega directamente desde los bots

2. **Asegúrate de haber iniciado conversación con tu bot**
   - Busca tu bot en Telegram (el username que creaste)
   - Presiona "Start" o envía `/start`

3. **Verifica que el backend esté corriendo**
   - Debe mostrar: "🚀 Servidor corriendo en http://localhost:3000"

4. **Revisa los logs en la consola del backend**
   - Busca mensajes de error

### ⚠️ Error: "Forbidden: bot was blocked by the user"

**Solución:** 
- Busca tu bot en Telegram
- Si lo bloqueaste, desbloquealo
- Presiona "Start" nuevamente

### ⚠️ Error: "Chat not found"

**Solución:**
- Verifica que el CHAT_ID sea correcto
- Debe ser solo números (puede empezar con -)
- Inicia conversación con tu bot enviando /start

## 🎯 Funcionalidades Implementadas

### ✅ Notificaciones de Login
Cada vez que alguien inicia sesión exitosamente, recibes:
- Datos del usuario
- Fecha y hora
- Dirección IP

### 🚀 Próximamente (puedes agregar):
- Alertas de transacciones importantes
- Notificaciones de cambios de contraseña
- Alertas de intentos de login fallidos
- Notificaciones de transferencias
- Resumen diario de actividad

## 🔒 Seguridad

### ⚠️ Importante:
- **NUNCA** compartas tu TELEGRAM_BOT_TOKEN
- **NUNCA** subas el archivo .env a GitHub
- El .env ya está en .gitignore (no se subirá)
- Usa variables de entorno en producción

### 🛡️ Para Producción:
1. Usa variables de entorno del servidor
2. No hardcodees tokens en el código
3. Considera usar Telegram Bot API con webhooks
4. Implementa rate limiting en las notificaciones

## 📚 Recursos Adicionales

- [Telegram Bot API Docs](https://core.telegram.org/bots/api)
- [BotFather Commands](https://core.telegram.org/bots#6-botfather)
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)

## 💡 Tips

1. **Guarda el token en un lugar seguro** (no lo pierdas)
2. **Puedes crear múltiples bots** para diferentes propósitos
3. **El bot puede enviar fotos, videos, documentos**, etc.
4. **Puedes configurar comandos personalizados** en BotFather
5. **Los mensajes soportan Markdown** para formateo

---

**¡Listo!** Ahora recibirás notificaciones en tiempo real de todos los logins en tu aplicación BIP 🎉
