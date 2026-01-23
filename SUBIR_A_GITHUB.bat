@echo off
title Subir a GitHub - BIP Homebanking
color 0A

echo ================================================
echo   SCRIPT PARA SUBIR A GITHUB
echo ================================================
echo.
echo Este script te ayudara a subir tu codigo a GitHub
echo.
echo ANTES DE CONTINUAR:
echo 1. Crea un repositorio en GitHub llamado: bip-homebanking
echo 2. Ve a: https://github.com/new
echo 3. Una vez creado, COPIA la URL del repositorio
echo.
pause

echo.
set /p GITHUB_URL="Pega la URL de tu repositorio (ejemplo: https://github.com/usuario/bip-homebanking.git): "

echo.
echo ================================================
echo   Configurando Git...
echo ================================================

cd /d "C:\Users\CHRISTIAN\Desktop\bip"

git remote add origin %GITHUB_URL%
if errorlevel 1 (
    echo Ya existe un remote, actualizando...
    git remote set-url origin %GITHUB_URL%
)

echo.
echo ================================================
echo   Subiendo codigo a GitHub...
echo ================================================

git branch -M main
git push -u origin main

echo.
echo ================================================
echo   CODIGO SUBIDO EXITOSAMENTE!
echo ================================================
echo.
echo Ahora continua con Railway y Vercel:
echo.
echo 1. Railway (Backend):  https://railway.app
echo 2. Vercel (Frontend):  https://vercel.com
echo.
echo Ver guia completa en: DEPLOY_PASO_A_PASO.md
echo.
pause
