# 📱 GUÍA RÁPIDA: Ver en Móvil con Dominio Gratis

## ⚡ OPCIÓN MÁS RÁPIDA (5 minutos)

### Pasos:

1. **Ejecuta el script automático**
   ```
   Doble click en: DEPLOY_AUTOMATICO.bat
   ```

2. **Crea cuenta en Railway** (30 segundos)
   - Ve a https://railway.app
   - Login con GitHub

3. **Crea cuenta en Vercel** (30 segundos)
   - Ve a https://vercel.com  
   - Login con GitHub

4. **Sigue las instrucciones del script**
   - Te guiará paso a paso
   - Pegará comandos automáticamente

5. **¡Listo!** 🎉
   - Tendrás: `https://tu-app.vercel.app`
   - Accesible desde tu móvil
   - Con HTTPS (cámara funciona)

---

## 🎯 Servicios GRATUITOS con Dominio:

| Servicio | URL Gratis | HTTPS | Límites |
|----------|-----------|--------|----------|
| **Vercel** (Frontend) | `tu-app.vercel.app` | ✅ | 100GB/mes |
| **Railway** (Backend) | `tu-backend.up.railway.app` | ✅ | $5 crédito/mes |
| **Netlify** (Frontend) | `tu-app.netlify.app` | ✅ | 100GB/mes |
| **Render** (Backend) | `tu-app.onrender.com` | ✅ | 750hrs/mes |
| **Fly.io** (Ambos) | `tu-app.fly.dev` | ✅ | 3 apps gratis |

---

## 📱 RESULTADO FINAL:

```
https://tu-bip-homebanking.vercel.app
```

- ✅ Accesible desde **cualquier móvil**
- ✅ Funciona **iPhone, Android, tablet**
- ✅ **HTTPS automático** (cámara funciona)
- ✅ **100% GRATIS** para siempre
- ✅ Dominio profesional `.vercel.app`

---

## 🚀 ALTERNATIVA: Deploy Manual

Si prefieres hacerlo manual (sin script):

### 1️⃣ Sube a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/bip.git
git push -u origin main
```

### 2️⃣ Railway (Backend)
1. https://railway.app → New Project
2. Deploy from GitHub → Selecciona tu repo
3. Variables: PORT=3000, JWT_SECRET=...
4. Generate Domain

### 3️⃣ Vercel (Frontend)
1. https://vercel.com → New Project
2. Selecciona tu repo
3. Root: `homebanking-frontend`
4. Variable: `VITE_API_URL=https://tu-railway.up.railway.app/api`
5. Deploy

---

## 💡 CONSEJOS:

- ✅ Usa **Vercel + Railway** (recomendado)
- ✅ Railway da dominio `.up.railway.app`
- ✅ Vercel da dominio `.vercel.app`
- ✅ Ambos con HTTPS automático
- ✅ Puedes cambiar subdominios gratis
- ⚠️ Railway se duerme si no hay uso (despierta en 30s)

---

## 🔗 ENLACES ÚTILES:

- **Railway**: https://railway.app
- **Vercel**: https://vercel.com
- **GitHub**: https://github.com
- **Documentación completa**: [DEPLOY_CLOUD_GRATIS.md](DEPLOY_CLOUD_GRATIS.md)

---

## ⚡ ACTUALIZACIONES:

Después del deploy inicial:

```bash
# Hacer cambios en el código
git add .
git commit -m "Nuevas mejoras"
git push
```

**¡Railway y Vercel se actualizan solos!** 🚀
