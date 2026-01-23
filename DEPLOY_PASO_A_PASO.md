# 🚀 GUÍA PASO A PASO - Deploy en la Nube

## ✅ Paso 1: Crear cuenta en GitHub (Si no tienes)

1. Ve a: https://github.com/signup
2. Crea tu cuenta gratuita
3. Verifica tu email

---

## 📦 Paso 2: Subir tu proyecto a GitHub

### Opción A: Por interfaz web (MÁS FÁCIL)

1. **Ve a GitHub** y haz login
2. **Click en "+" arriba a la derecha** → "New repository"
3. **Nombre:** `bip-homebanking`
4. **Descripción:** "Sistema de homebanking con verificación biométrica"
5. **Público** o Privado (tú decides)
6. **NO marques** "Initialize with README" (ya lo tienes)
7. **Click "Create repository"**

8. **Copia los comandos que GitHub te muestra:**
   ```bash
   git remote add origin https://github.com/TU_USUARIO/bip-homebanking.git
   git branch -M main
   git push -u origin main
   ```

9. **Ejecuta en PowerShell** (en la carpeta bip):
   ```powershell
   cd C:\Users\CHRISTIAN\Desktop\bip
   git remote add origin https://github.com/TU_USUARIO/bip-homebanking.git
   git branch -M main
   git push -u origin main
   ```

10. **Ingresa tu usuario y contraseña** cuando te lo pida
    (Si pide token: Ve a GitHub → Settings → Developer settings → Personal access tokens)

---

## 🚂 Paso 3: Deploy Backend en Railway

### 3.1 Crear cuenta
1. Ve a: https://railway.app
2. Click en "Login" → "Login with GitHub"
3. Autoriza Railway a acceder a tu GitHub

### 3.2 Crear proyecto
1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Busca y selecciona: `bip-homebanking`
4. Railway detectará automáticamente que hay múltiples apps

### 3.3 Configurar el Backend
1. **Root Directory:** Escribe `homebanking-backend`
2. **Start Command:** `npm run build && npm start`
3. Click en "Deploy"

### 3.4 Agregar Variables de Entorno
1. En el dashboard del proyecto, click en tu servicio
2. Ve a la pestaña "Variables"
3. Click en "Raw Editor"
4. Pega esto:
   ```
   PORT=3000
   NODE_ENV=production
   JWT_SECRET=tu_clave_super_segura_cambiar_123456_production
   TELEGRAM_BOT_TOKEN=7964363913:AAEfVemjF9dX-WJ6JXRVTyT5PqhBJRACYMI
   TELEGRAM_CHAT_ID=6968749488
   CORS_ORIGIN=*
   ```
5. Click en "Update Variables"

### 3.5 Obtener URL del Backend
1. Ve a la pestaña "Settings"
2. Click en "Generate Domain"
3. **COPIA LA URL** (algo como: `https://bip-homebanking-production.up.railway.app`)

---

## ⚡ Paso 4: Deploy Frontend en Vercel

### 4.1 Crear cuenta
1. Ve a: https://vercel.com
2. Click en "Sign Up" → "Continue with GitHub"
3. Autoriza Vercel

### 4.2 Importar proyecto
1. Click en "Add New..." → "Project"
2. Busca y selecciona: `bip-homebanking`
3. Click en "Import"

### 4.3 Configurar el Frontend
**Framework Preset:** Vite
**Root Directory:** Click en "Edit" y escribe `homebanking-frontend`
**Build Command:** `npm run build`
**Output Directory:** `dist`

### 4.4 Variables de Entorno
1. Expande "Environment Variables"
2. Agrega:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://TU-URL-DE-RAILWAY.up.railway.app/api`
     (Reemplaza con la URL que copiaste de Railway)

3. Click en "Deploy"

### 4.5 Esperar el deploy (1-2 minutos)
1. Vercel construirá tu proyecto
2. Al terminar te dará una URL como: `https://bip-homebanking.vercel.app`

---

## 🎉 Paso 5: ¡Listo! Probar tu App

Tu app ya está en línea:

**Frontend:** `https://tu-proyecto.vercel.app`
**Backend:** `https://tu-proyecto.railway.app`

### Credenciales:
- Usuario: `admin` / Contraseña: `admin123`
- Usuario: `demo` / Contraseña: `demo123`

---

## 🔧 Paso 6: Configurar Dominio Personalizado (Opcional)

### En Vercel (Frontend):
1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Agrega tu dominio gratuito de:
   - `.vercel.app` (gratis, automático)
   - Freenom.com (dominios .tk, .ml, .ga gratis)
   - InfinityFree.net (incluye dominio)

### Dominios Gratis Recomendados:
- **Freenom:** https://www.freenom.com (Gratis: .tk, .ml, .ga, .cf, .gq)
- **000webhost:** https://www.000webhost.com (hosting + dominio)
- **InfinityFree:** https://infinityfree.net

---

## 📱 Actualizar Backend con URL del Frontend

1. Ve a Railway → Tu proyecto → Variables
2. Cambia `CORS_ORIGIN` por la URL de Vercel:
   ```
   CORS_ORIGIN=https://tu-proyecto.vercel.app
   ```

---

## ⚠️ IMPORTANTE

### Para que la cámara funcione:
- ✅ HTTPS (Vercel y Railway ya lo tienen)
- ✅ Permisos de cámara habilitados en el navegador
- ✅ Probar en Chrome o Safari

### Seguridad:
- ❌ NO subas el archivo `.env` con tus datos reales
- ✅ Cambia `JWT_SECRET` en producción
- ✅ Mantén seguro tu token de Telegram

---

## 🆘 Solución de Problemas

### Railway no detecta el proyecto:
- Asegúrate de que `homebanking-backend/package.json` existe
- Verifica el Root Directory en Railway

### Vercel falla al construir:
- Verifica que `homebanking-frontend/package.json` existe
- Asegúrate de haber configurado VITE_API_URL

### Error CORS:
- Verifica que CORS_ORIGIN en Railway apunte a tu URL de Vercel
- O déjalo en `*` para permitir todos los orígenes (menos seguro)

---

## 🎯 Resumen de URLs

Después del deploy tendrás:

| Servicio | URL |
|----------|-----|
| Frontend | https://bip-homebanking.vercel.app |
| Backend | https://bip-homebanking-production.up.railway.app |
| Dominio Custom | https://tu-dominio.tk (si lo configuras) |

---

## ✅ CHECKLIST

- [ ] Código subido a GitHub
- [ ] Backend desplegado en Railway
- [ ] Variables de entorno configuradas en Railway
- [ ] Frontend desplegado en Vercel
- [ ] VITE_API_URL configurada en Vercel
- [ ] CORS_ORIGIN actualizada en Railway
- [ ] Probado desde el móvil
- [ ] Telegram funcionando

---

## 🚀 ¡A DEPLOYEAR!

Sigue los pasos en orden y tendrás tu app en línea en menos de 15 minutos.

**¿Necesitas ayuda?** Pregúntame en cualquier paso.
