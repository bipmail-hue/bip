# 🚀 Guía de Despliegue - BIP Homebanking

## 📱 Para probar desde el móvil hay 3 opciones:

---

## ⚡ OPCIÓN 1: Deploy en la Nube (RECOMENDADO)

### Backend: Railway (Gratis)
### Frontend: Vercel (Gratis)

---

## 🔧 PREPARACIÓN DEL PROYECTO

### 1️⃣ Instalar Git (si no lo tienes)
```bash
# Descarga desde: https://git-scm.com/download/win
```

### 2️⃣ Inicializar Git en el proyecto
```bash
cd C:\Users\CHRISTIAN\Desktop\bip
git init
git add .
git commit -m "Initial commit - BIP Homebanking"
```

---

## 🚂 DEPLOY BACKEND EN RAILWAY

### Paso 1: Crear cuenta en Railway
1. Ve a https://railway.app
2. Regístrate con GitHub (es gratis)

### Paso 2: Crear nuevo proyecto
1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Autoriza Railway a acceder a tu GitHub
4. Crea un nuevo repositorio o sube tu código

### Paso 3: Configurar Variables de Entorno
En Railway, ve a Variables y agrega:
```
PORT=3000
NODE_ENV=production
JWT_SECRET=tu_clave_secreta_muy_segura_cambiar_aqui
TELEGRAM_BOT_TOKEN=7964363913:AAEfVemjF9dX-WJ6JXRVTyT5PqhBJRACYMI
TELEGRAM_CHAT_ID=6968749488
CORS_ORIGIN=*
```

### Paso 4: Railway detectará automáticamente el proyecto Node.js
- Espera a que se complete el deploy (3-5 minutos)
- Copia la URL que te da Railway (ejemplo: `https://tu-app.railway.app`)

---

## 🔷 DEPLOY FRONTEND EN VERCEL

### Paso 1: Crear cuenta en Vercel
1. Ve a https://vercel.com
2. Regístrate con GitHub (es gratis)

### Paso 2: Importar proyecto
1. Click en "Add New Project"
2. Importa tu repositorio de GitHub
3. Selecciona la carpeta `homebanking-frontend`

### Paso 3: Configurar el build
Vercel detectará automáticamente Vite, pero asegúrate:
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Root Directory: homebanking-frontend
```

### Paso 4: Variables de Entorno
Agrega en Vercel:
```
VITE_API_URL=https://tu-app.railway.app/api
```
(Reemplaza con la URL de Railway del paso anterior)

### Paso 5: Deploy
- Click en "Deploy"
- Espera 1-2 minutos
- Copia tu URL de Vercel (ejemplo: `https://tu-app.vercel.app`)

---

## 🌐 OPCIÓN 2: Usar tu red local (MÁS RÁPIDO)

Para probar desde el móvil en la misma red WiFi:

### 1️⃣ Obtener tu IP local
```bash
# En PowerShell:
ipconfig | Select-String "IPv4"
```
Busca algo como: `192.168.1.100`

### 2️⃣ Modificar el backend para aceptar conexiones externas
En `homebanking-backend/src/server.ts`:
```typescript
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});
```

### 3️⃣ Modificar CORS en backend `.env`
```env
CORS_ORIGIN=*
```

### 4️⃣ Iniciar backend
```bash
cd homebanking-backend
npm run dev
```

### 5️⃣ Iniciar frontend con host expuesto
```bash
cd homebanking-frontend
npm run dev -- --host
```

### 6️⃣ Desde el móvil
1. Conéctate a la misma WiFi
2. Abre el navegador en: `http://TU_IP:5173`
3. Ejemplo: `http://192.168.1.100:5173`

---

## 📦 OPCIÓN 3: Usar Ngrok (Temporal)

### 1️⃣ Descargar Ngrok
```bash
# Descarga desde: https://ngrok.com/download
```

### 2️⃣ Exponer el backend
```bash
ngrok http 3000
```
Te dará una URL pública temporal: `https://abc123.ngrok.io`

### 3️⃣ Exponer el frontend
```bash
ngrok http 5173
```
Te dará otra URL: `https://xyz789.ngrok.io`

### 4️⃣ Actualizar variables
- En el frontend: Cambia VITE_API_URL a la URL del backend de ngrok
- En el backend: Cambia CORS_ORIGIN a la URL del frontend de ngrok

---

## 🎯 RECOMENDACIÓN

**Para producción real:** Usa Railway + Vercel (Opción 1)
**Para pruebas rápidas:** Usa tu red local (Opción 2)
**Para demos temporales:** Usa Ngrok (Opción 3)

---

## 🔐 IMPORTANTE

- ⚠️ Nunca expongas tu `.env` en repositorios públicos
- ✅ Usa variables de entorno en los servicios de deploy
- 🔒 Cambia JWT_SECRET en producción por algo más seguro
- 📱 Asegúrate de permitir acceso a cámara en móvil (HTTPS requerido)

---

## 📞 NECESITAS AYUDA?

Dime qué opción prefieres y te ayudo paso a paso a configurarla.
