# 📱 ACCESO DESDE MÓVIL - CONFIGURADO

## ✅ Tu proyecto ya está configurado para acceso móvil

### 🌐 Tu IP Local: `10.205.106.132`

---

## 🚀 PASOS PARA USAR DESDE TU CELULAR:

### 1️⃣ Ejecuta el archivo de inicio
```bash
# Haz doble click en:
INICIAR_PARA_MOVIL.bat
```

Esto iniciará:
- Backend en puerto 3000
- Frontend en puerto 5173 (accesible desde la red)

### 2️⃣ Desde tu celular
1. **Conéctate a la misma red WiFi** que tu computadora
2. **Abre el navegador** en tu celular
3. **Ingresa la URL:**
   ```
   http://10.205.106.132:5173
   ```

### 3️⃣ Prueba el sistema
- Usuario: `admin` o `demo`
- Contraseña: `admin123` o `demo123`

---

## ⚠️ IMPORTANTE PARA CÁMARA

Para que funcione la verificación facial en el móvil:

### Opción A: Usar HTTPS (Recomendado para producción)
Necesitas un certificado SSL. Te recomiendo subir a Vercel/Railway.

### Opción B: Chrome permite cámara en HTTP local
Chrome y algunos navegadores permiten acceso a cámara en redes locales.
Si no funciona, prueba con:
- Chrome en Android
- Safari en iOS

### Opción C: Deploy en la nube
Para acceso completo desde cualquier lugar con HTTPS:
1. Backend → Railway (gratis)
2. Frontend → Vercel (gratis)

Ver archivo: `DEPLOY_GUIA.md` para instrucciones completas.

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### No puedo acceder desde el celular:
1. Verifica que estés en la misma WiFi
2. Desactiva el firewall temporalmente en Windows
3. Prueba con: `http://10.205.106.132:5173`

### La cámara no funciona:
1. Usa Chrome en Android
2. Permite permisos de cámara cuando te lo pida
3. Si persiste, necesitas HTTPS (deploy en la nube)

### Backend no responde:
1. Verifica que ambos servidores estén corriendo
2. Prueba: `http://10.205.106.132:3000/api/accounts` en el navegador

---

## 📱 CONFIGURACIÓN DE FIREWALL (Si es necesario)

Si no puedes acceder, ejecuta en PowerShell como Administrador:

```powershell
# Permitir puerto 3000 (Backend)
New-NetFirewallRule -DisplayName "BIP Backend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Permitir puerto 5173 (Frontend)
New-NetFirewallRule -DisplayName "BIP Frontend" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
```

---

## 🎯 ALTERNATIVA RÁPIDA: Ngrok

Si quieres una URL pública temporal:

1. Descarga Ngrok: https://ngrok.com
2. Ejecuta:
   ```bash
   ngrok http 5173
   ```
3. Te dará una URL como: `https://abc123.ngrok.io`
4. Úsala desde cualquier dispositivo

---

## ✅ TODO LISTO!

Tu sistema BIP está configurado para acceso desde móvil.
Haz doble click en `INICIAR_PARA_MOVIL.bat` y pruébalo.
