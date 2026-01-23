@echo off
chcp 65001 >nul
color 0A
title 🚀 Deploy a la Nube - BIP Homebanking

echo.
echo ═══════════════════════════════════════════════════════════════
echo       🌐 DEPLOY GRATUITO CON DOMINIO - BIP HOMEBANKING
echo ═══════════════════════════════════════════════════════════════
echo.
echo Este script te ayudará a subir tu proyecto a la nube
echo.
echo 📱 Resultado: App accesible desde móvil con dominio gratis
echo 🔐 HTTPS automático para usar la cámara
echo 💰 100%% GRATIS
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

REM Verificar si Git está instalado
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git no está instalado
    echo.
    echo 📥 Descarga Git desde: https://git-scm.com/download/win
    echo Después de instalarlo, ejecuta este script de nuevo
    pause
    exit /b 1
)

echo ✅ Git detectado
echo.

REM Verificar si ya hay un repositorio
if exist .git (
    echo ✅ Repositorio Git ya existe
) else (
    echo 🔧 Inicializando Git...
    git init
    echo ✅ Git inicializado
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo        PASO 1: CREAR REPOSITORIO EN GITHUB
echo ═══════════════════════════════════════════════════════════════
echo.
echo 1. Ve a: https://github.com/new
echo 2. Nombre del repo: bip-homebanking (o el que quieras)
echo 3. Visibilidad: Público o Privado (tu elección)
echo 4. NO inicialices con README
echo 5. Click en "Create repository"
echo.
echo Presiona ENTER cuando hayas creado el repositorio...
pause >nul

echo.
set /p GITHUB_USER="📝 Tu usuario de GitHub: "
set /p REPO_NAME="📝 Nombre del repositorio (default: bip-homebanking): "
if "%REPO_NAME%"=="" set REPO_NAME=bip-homebanking

echo.
echo 🔧 Configurando repositorio remoto...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git
echo ✅ Repositorio configurado

echo.
echo 📦 Agregando archivos al commit...
git add .
git commit -m "Deploy: BIP Homebanking to Cloud" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ℹ️ No hay cambios nuevos para commitear
)

echo.
echo 🚀 Subiendo código a GitHub...
git branch -M main
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Error al subir a GitHub
    echo.
    echo Posibles soluciones:
    echo 1. Verifica tu usuario y contraseña de GitHub
    echo 2. Si tienes 2FA, necesitas un Personal Access Token:
    echo    - Ve a: https://github.com/settings/tokens
    echo    - Genera un nuevo token (classic)
    echo    - Usa el token como contraseña al hacer push
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Código subido exitosamente a GitHub!
echo.
echo ═══════════════════════════════════════════════════════════════
echo        PASO 2: DEPLOY BACKEND EN RAILWAY
echo ═══════════════════════════════════════════════════════════════
echo.
echo 🚂 Railway - Backend (Node.js)
echo.
echo 1. Ve a: https://railway.app
echo 2. Click en "Login" y usa tu cuenta de GitHub
echo 3. Click en "New Project"
echo 4. Selecciona "Deploy from GitHub repo"
echo 5. Busca y selecciona: %REPO_NAME%
echo 6. Railway detectará automáticamente el proyecto
echo.
echo ⚙️ CONFIGURAR VARIABLES DE ENTORNO:
echo.
echo En Railway, ve a tu proyecto → Variables → Agrega estas:
echo.
echo PORT=3000
echo NODE_ENV=production
echo JWT_SECRET=mi_super_secreto_BIP_2026_seguro_cambiar_esto
echo TELEGRAM_BOT_TOKEN=7964363913:AAEfVemjF9dX-WJ6JXRVTyT5PqhBJRACYMI
echo TELEGRAM_CHAT_ID=6968749488
echo.
echo 🌐 GENERAR DOMINIO PÚBLICO:
echo.
echo 1. En Railway → Settings → Networking
echo 2. Click en "Generate Domain"
echo 3. Se creará: tu-backend.up.railway.app
echo.
echo Presiona ENTER cuando hayas completado Railway...
pause >nul

echo.
set /p RAILWAY_URL="📝 Pega aquí tu URL de Railway (ej: https://tu-backend.up.railway.app): "

echo.
echo ✅ Backend configurado en Railway!
echo.
echo ═══════════════════════════════════════════════════════════════
echo        PASO 3: DEPLOY FRONTEND EN VERCEL
echo ═══════════════════════════════════════════════════════════════
echo.
echo ⚡ Vercel - Frontend (React + Vite)
echo.
echo 1. Ve a: https://vercel.com
echo 2. Click en "Sign Up" y usa tu cuenta de GitHub
echo 3. Click en "Add New Project"
echo 4. Selecciona: %REPO_NAME%
echo 5. Configura:
echo    - Framework Preset: Vite
echo    - Root Directory: homebanking-frontend
echo    - Build Command: npm run build
echo    - Output Directory: dist
echo.
echo 🔧 VARIABLE DE ENTORNO:
echo.
echo En Vercel, ve a Settings → Environment Variables → Agrega:
echo.
echo Variable: VITE_API_URL
echo Value: %RAILWAY_URL%/api
echo.
echo 6. Click en "Deploy"
echo 7. Espera 1-2 minutos
echo.
echo Presiona ENTER cuando hayas completado Vercel...
pause >nul

echo.
set /p VERCEL_URL="📝 Pega aquí tu URL de Vercel (ej: https://tu-app.vercel.app): "

echo.
echo ═══════════════════════════════════════════════════════════════
echo        🎉 ¡DEPLOY COMPLETADO!
echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ Tu aplicación está ONLINE y accesible desde cualquier móvil!
echo.
echo 🌐 URLS:
echo    Frontend: %VERCEL_URL%
echo    Backend:  %RAILWAY_URL%
echo.
echo 📱 DESDE TU MÓVIL:
echo    1. Abre el navegador
echo    2. Ve a: %VERCEL_URL%
echo    3. Usa: admin / admin123  o  demo / demo123
echo.
echo 🔐 HTTPS activado - La cámara funcionará perfectamente!
echo.
echo 💡 ACTUALIZACIONES:
echo    Cada vez que hagas cambios:
echo    1. git add .
echo    2. git commit -m "descripción"
echo    3. git push
echo    → Railway y Vercel se actualizan automáticamente!
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

REM Guardar URLs en archivo
echo # 🌐 URLs de Deploy > DEPLOY_URLS.txt
echo. >> DEPLOY_URLS.txt
echo Frontend: %VERCEL_URL% >> DEPLOY_URLS.txt
echo Backend: %RAILWAY_URL% >> DEPLOY_URLS.txt
echo. >> DEPLOY_URLS.txt
echo Fecha: %date% %time% >> DEPLOY_URLS.txt

echo 📝 URLs guardadas en: DEPLOY_URLS.txt
echo.

REM Abrir URLs en el navegador
echo ¿Quieres abrir las URLs en el navegador? (S/N)
set /p OPEN_BROWSER=
if /i "%OPEN_BROWSER%"=="S" (
    start %VERCEL_URL%
    start https://railway.app
    start https://vercel.com
)

echo.
echo Presiona cualquier tecla para salir...
pause >nul
