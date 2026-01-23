@echo off
chcp 65001 >nul
color 0A
title 🚀 Deploy Automático - BIP Homebanking

echo.
echo ═══════════════════════════════════════════════════════════════
echo       🚀 DEPLOY AUTOMÁTICO A LA NUBE
echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ Código ya subido a GitHub
echo 🚂 Configurando Railway (Backend)
echo ⚡ Configurando Vercel (Frontend)
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

echo 🔑 Paso 1: Login en Railway
echo.
echo Se abrirá tu navegador para autenticarte...
timeout /t 3 >nul
call railway login

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al autenticarse en Railway
    pause
    exit /b 1
)

echo.
echo ✅ Autenticado en Railway
echo.

echo 🚂 Paso 2: Creando proyecto en Railway
echo.
cd homebanking-backend
call railway init --name bip-backend

echo.
echo 📝 Configurando variables de entorno...
call railway variables --set PORT=3000
call railway variables --set NODE_ENV=production
call railway variables --set JWT_SECRET=mi_super_secreto_BIP_2026_seguro
call railway variables --set TELEGRAM_BOT_TOKEN=7964363913:AAEfVemjF9dX-WJ6JXRVTyT5PqhBJRACYMI
call railway variables --set TELEGRAM_CHAT_ID=6968749488

echo.
echo 🚀 Haciendo deploy del backend...
call railway up

echo.
echo 🌐 Obteniendo URL del backend...
for /f "delims=" %%i in ('railway domain') do set BACKEND_URL=%%i
echo Backend URL: %BACKEND_URL%

cd ..

echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 🔑 Paso 3: Login en Vercel
echo.
echo Se abrirá tu navegador para autenticarte...
timeout /t 3 >nul
call vercel login

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al autenticarse en Vercel
    pause
    exit /b 1
)

echo.
echo ✅ Autenticado en Vercel
echo.

echo ⚡ Paso 4: Desplegando frontend en Vercel
echo.
cd homebanking-frontend

echo.
echo 📝 Configurando variables de entorno...
call vercel env add VITE_API_URL production

echo Valor: https://%BACKEND_URL%/api

echo.
echo 🚀 Haciendo deploy del frontend...
call vercel --prod

echo.
echo 🌐 Obteniendo URL del frontend...
for /f "delims=" %%i in ('vercel ls --json ^| findstr url') do set FRONTEND_URL=%%i

cd ..

echo.
echo ═══════════════════════════════════════════════════════════════
echo        🎉 ¡DEPLOY COMPLETADO!
echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ Tu aplicación está ONLINE
echo.
echo 🌐 URLS:
echo    Backend:  https://%BACKEND_URL%
echo    Frontend: https://%FRONTEND_URL%
echo.
echo 📱 DESDE TU MÓVIL:
echo    Abre el navegador y ve a:
echo    https://%FRONTEND_URL%
echo.
echo    Usuario: admin / admin123
echo    Usuario: demo / demo123
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

REM Guardar URLs
echo # 🌐 URLs de Deploy > URLS_DEPLOY.txt
echo. >> URLS_DEPLOY.txt
echo Backend: https://%BACKEND_URL% >> URLS_DEPLOY.txt
echo Frontend: https://%FRONTEND_URL% >> URLS_DEPLOY.txt
echo. >> URLS_DEPLOY.txt
echo Fecha: %date% %time% >> URLS_DEPLOY.txt

echo 📝 URLs guardadas en: URLS_DEPLOY.txt
echo.

echo ¿Quieres abrir la aplicación en el navegador? (S/N)
set /p OPEN=
if /i "%OPEN%"=="S" (
    start https://%FRONTEND_URL%
)

echo.
echo Presiona cualquier tecla para salir...
pause >nul
