@echo off
echo ========================================
echo     INICIANDO BIP HOMEBANKING
echo     Para acceso desde celular
echo ========================================
echo.
echo Tu IP es: 10.205.106.132
echo.
echo Iniciando Backend en puerto 3000...
cd homebanking-backend
start cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo Iniciando Frontend en puerto 5173...
cd ..\homebanking-frontend
start cmd /k "npm run dev -- --host"

echo.
echo ========================================
echo.
echo ACCEDE DESDE TU CELULAR A:
echo.
echo   http://10.205.106.132:5173
echo.
echo Asegurate de estar en la misma red WiFi
echo ========================================
pause
