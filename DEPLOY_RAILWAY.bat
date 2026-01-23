@echo off
chcp 65001 > nul
title ACTUALIZAR RAILWAY
color 0B

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║         ACTUALIZAR BACKEND EN RAILWAY                ║
echo ╚══════════════════════════════════════════════════════╝
echo.

echo [1/3] Verificando Railway CLI...
where railway > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo     ❌ Railway CLI no instalado
    echo     📦 Instalando Railway CLI...
    npm install -g @railway/cli
    echo     ✅ Railway CLI instalado
) else (
    echo     ✅ Railway CLI encontrado
)
echo.

echo [2/3] Conectando a Railway...
cd homebanking-backend
railway link
echo.

echo [3/3] Deployando...
railway up
echo.

echo ╔══════════════════════════════════════════════════════╗
echo ║              ✅ DEPLOY COMPLETADO                     ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo 🌐 Backend: https://bip-production.up.railway.app
echo 📱 Frontend: https://homebanking-frontend.vercel.app
echo.
echo Ahora puedes probar desde tu celular!
echo.
pause
