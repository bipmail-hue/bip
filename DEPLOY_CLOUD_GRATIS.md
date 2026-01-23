# 🌐 Deploy GRATUITO con Dominio - BIP Homebanking

## 🎯 Resultado Final
- **Frontend**: `https://tu-app.vercel.app` (accesible desde móvil)
- **Backend**: `https://tu-backend.up.railway.app`
- **100% GRATIS** con HTTPS incluido

---

## 📋 REQUISITOS PREVIOS

1. ✅ Cuenta GitHub (gratis): https://github.com
2. ✅ Cuenta Railway (gratis): https://railway.app
3. ✅ Cuenta Vercel (gratis): https://vercel.com

---

## 🚀 PASO 1: PREPARAR EL PROYECTO

### 1.1 Crear archivos de configuración

#### Para Railway (Backend)
Crea `railway.json` en la raíz del proyecto:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd homebanking-backend && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd homebanking-backend && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Para Vercel (Frontend)
Crea `vercel.json` en la raíz del proyecto:
```json
{
  "buildCommand": "cd homebanking-frontend && npm install && npm run build",
  "outputDirectory": "homebanking-frontend/dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🚂 PASO 2: SUBIR A GITHUB

```bash
# 1. Abrir PowerShell en la carpeta del proyecto
cd C:\Users\CHRISTIAN\Desktop\bip

# 2. Inicializar Git (si no está)
git init

# 3. Agregar todos los archivos
git add .

# 4. Hacer commit
git commit -m "Deploy: BIP Homebanking"

# 5. Crear repositorio en GitHub y conectar
# Ve a: https://github.com/new
# Nombre: bip-homebanking
# Visibilidad: Privado o Público

# 6. Conectar y subir
git remote add origin https://github.com/TU_USUARIO/bip-homebanking.git
git branch -M main
git push -u origin main
```

---

## 🚂 PASO 3: DEPLOY BACKEND EN RAILWAY

### 3.1 Configurar Railway
1. Ve a: https://railway.app
2. Click en **"Login"** → Usa GitHub
3. Click en **"New Project"**
4. Selecciona **"Deploy from GitHub repo"**
5. Busca y selecciona: `bip-homebanking`

### 3.2 Configurar Variables de Entorno
En Railway, ve a tu proyecto → **Variables** → Agrega:

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=mi_super_secreto_BIP_2026_seguro_cambiar_esto
TELEGRAM_BOT_TOKEN=7964363913:AAEfVemjF9dX-WJ6JXRVTyT5PqhBJRACYMI
TELEGRAM_CHAT_ID=6968749488
FRONTEND_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

### 3.3 Generar Dominio Público
1. En Railway, ve a **Settings** → **Networking**
2. Click en **"Generate Domain"**
3. Se creará algo como: `tu-backend.up.railway.app`
4. ✅ **Copia esta URL** (la necesitarás para el frontend)

---

## ⚡ PASO 4: DEPLOY FRONTEND EN VERCEL

### 4.1 Configurar Vercel
1. Ve a: https://vercel.com
2. Click en **"Sign Up"** → Usa GitHub
3. Click en **"Add New Project"**
4. Selecciona: `bip-homebanking`

### 4.2 Configurar el Build
En la configuración de Vercel:
- **Framework Preset**: Vite
- **Root Directory**: `homebanking-frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4.3 Variables de Entorno
En Vercel, agrega la variable:

```env
VITE_API_URL=https://tu-backend.up.railway.app/api
```

⚠️ **IMPORTANTE**: Reemplaza `tu-backend.up.railway.app` con la URL que Railway te dio en el paso 3.3

### 4.4 Deploy
1. Click en **"Deploy"**
2. Espera 1-2 minutos
3. ✅ Se creará: `https://tu-app.vercel.app`

---

## 📱 PASO 5: PROBAR DESDE EL MÓVIL

### ✅ Ya puedes acceder desde tu celular:

```
https://tu-app.vercel.app
```

**Usuarios de prueba:**
- Usuario: `admin` | Contraseña: `admin123`
- Usuario: `demo` | Contraseña: `demo123`

---

## 🔐 CONFIGURAR CORS (Backend)

Si tienes problemas de CORS, actualiza el backend:

**Archivo**: `homebanking-backend/src/server.ts`

```typescript
app.use(cors({
  origin: [
    'https://tu-app.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

Luego haz push de nuevo:
```bash
git add .
git commit -m "Fix CORS"
git push
```

Railway se actualizará automáticamente.

---

## 🎨 PERSONALIZAR DOMINIOS (Opcional)

### Vercel - Dominio Custom
1. En Vercel → Tu proyecto → **Settings** → **Domains**
2. Puedes agregar dominios gratis de:
   - `.vercel.app` (ya lo tienes)
   - Tu propio dominio si tienes uno

### Railway - Dominio Custom
1. En Railway → Settings → Networking
2. Puedes cambiar el subdominio o agregar tu propio dominio

---

## 📊 MONITOREO

### Ver logs del Backend (Railway)
1. Ve a Railway → Tu proyecto
2. Click en la pestaña **"Deployments"**
3. Click en el deployment activo
4. Ver **"View Logs"**

### Ver logs del Frontend (Vercel)
1. Ve a Vercel → Tu proyecto
2. Click en **"Deployments"**
3. Click en el deployment
4. Ver **"Function Logs"** o **"Build Logs"**

---

## ⚡ ACTUALIZACIONES AUTOMÁTICAS

Cada vez que hagas `git push`, ambos servicios se actualizan automáticamente:

```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción de cambios"
git push

# ✅ Railway y Vercel se actualizan solos
```

---

## 🆓 LÍMITES DEL PLAN GRATUITO

### Railway
- ✅ 500 horas/mes (suficiente)
- ✅ $5 USD de crédito gratis al mes
- ✅ HTTPS automático
- ⚠️ Se duerme después de inactividad (despierta en 30s)

### Vercel
- ✅ 100 GB ancho de banda/mes
- ✅ HTTPS automático
- ✅ Deploy ilimitados
- ✅ Siempre activo (no se duerme)

---

## 🔧 TROUBLESHOOTING

### ❌ Error: "Cannot connect to backend"
- Verifica que `VITE_API_URL` en Vercel tenga la URL correcta de Railway
- Asegúrate de que Railway esté corriendo (no en build failed)

### ❌ Error: "CORS policy"
- Actualiza el CORS en `server.ts` con la URL de Vercel
- Haz push de los cambios

### ❌ Error: "Build failed" en Railway
- Revisa los logs en Railway
- Verifica que `package.json` tenga el script `build`

### ❌ Error: "Build failed" en Vercel
- Verifica que la variable `VITE_API_URL` esté configurada
- Revisa los logs de build

---

## 🎯 RESULTADO FINAL

Después de seguir estos pasos tendrás:

✅ **Frontend**: `https://tu-app.vercel.app`
✅ **Backend**: `https://tu-backend.up.railway.app`
✅ **Accesible desde cualquier móvil con internet**
✅ **HTTPS automático** (funciona cámara)
✅ **Actualizaciones automáticas** con git push
✅ **100% GRATIS**

---

## 📝 SIGUIENTES PASOS RECOMENDADOS

1. ✅ Cambiar el `JWT_SECRET` por algo más seguro
2. ✅ Agregar base de datos real (Railway ofrece PostgreSQL gratis)
3. ✅ Configurar dominios personalizados
4. ✅ Agregar más usuarios de prueba
5. ✅ Configurar alertas en Telegram

---

¿Necesitas ayuda? Revisa los logs o contacta al soporte de:
- Railway: https://help.railway.app
- Vercel: https://vercel.com/support
