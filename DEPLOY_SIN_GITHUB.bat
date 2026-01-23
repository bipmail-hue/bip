@echo off
title Deploy SIN GitHub - Opción Fácil
color 0B

echo ================================================
echo   DEPLOY SIN GITHUB - MAS FACIL
echo ================================================
echo.
echo Vamos a usar RENDER - Es mas simple
echo.
echo PASOS:
echo.
echo 1. Crear ZIP del backend
echo 2. Subir a Render
echo 3. Configurar variables
echo.
pause

echo.
echo ================================================
echo   Creando ZIP del Backend...
echo ================================================
cd "C:\Users\CHRISTIAN\Desktop\bip"

echo Comprimiendo homebanking-backend...
powershell Compress-Archive -Path "homebanking-backend\*" -DestinationPath "bip-backend.zip" -Force

echo.
echo ================================================
echo   ZIP CREADO: bip-backend.zip
echo ================================================
echo.
echo AHORA:
echo 1. Ve a: https://render.com
echo 2. Sign Up (gratis, con email)
echo 3. New Web Service
echo 4. Deploy from ZIP
echo 5. Sube: bip-backend.zip
echo.
echo Variables a configurar en Render:
echo   PORT = 3000
echo   JWT_SECRET = tu_clave_secreta_123
echo   TELEGRAM_BOT_TOKEN = 7964363913:AAEfVemjF9dX-WJ6JXRVTyT5PqhBJRACYMI
echo   TELEGRAM_CHAT_ID = 6968749488
echo   CORS_ORIGIN = *
echo.
pause

echo.
echo Creando ZIP del Frontend...
echo.
powershell Compress-Archive -Path "homebanking-frontend\*" -DestinationPath "bip-frontend.zip" -Force

echo.
echo ================================================
echo   ZIP CREADO: bip-frontend.zip
echo ================================================
echo.
echo Para el Frontend:
echo 1. Ve a: https://vercel.com (acepta email sin GitHub)
echo 2. Arrastra: bip-frontend.zip
echo 3. Configurar: VITE_API_URL con la URL de Render
echo.
echo ================================================
echo   ZIPs listos para subir!
echo ================================================
echo.
pause
