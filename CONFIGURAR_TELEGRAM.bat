@echo off
echo ============================================
echo   CONFIGURACION BOT DE TELEGRAM
echo ============================================
echo.
echo PASO 1: Crea tu bot
echo -------------------
echo 1. Abre Telegram y busca: @BotFather
echo 2. Envia el comando: /newbot
echo 3. Dale un nombre (ejemplo: BIP Homebanking Bot)
echo 4. Dale un username (ejemplo: BIPHomebankingBot)
echo 5. COPIA EL TOKEN que te da (es algo como: 1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ)
echo.
pause
echo.
echo PASO 2: Obtén tu Chat ID
echo ------------------------
echo 1. Busca en Telegram: @userinfobot
echo 2. Envia /start
echo 3. COPIA tu ID (es un número como: 123456789)
echo.
pause
echo.
echo PASO 3: Configuracion
echo ---------------------
set /p BOT_TOKEN="Pega aqui el TOKEN del bot: "
set /p CHAT_ID="Pega aqui tu CHAT ID: "
echo.
echo.
echo Actualizando archivo .env...
cd homebanking-backend
(
echo # 🔐 Variables de entorno - Backend
echo PORT=3000
echo NODE_ENV=development
echo JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion-123456  
echo FRONTEND_URL=http://localhost:5173
echo CORS_ORIGIN=*
echo.
echo # 📱 Telegram Bot - CONFIGURADO
echo TELEGRAM_BOT_TOKEN=%BOT_TOKEN%
echo TELEGRAM_CHAT_ID=%CHAT_ID%
) > .env
cd ..
echo.
echo ✅ Archivo .env actualizado!
echo.
echo PASO 4: Prueba el bot
echo ---------------------
echo Ahora vamos a enviar un mensaje de prueba...
pause
cd homebanking-backend
node -e "const TelegramBot=require('node-telegram-bot-api');const bot=new TelegramBot('%BOT_TOKEN%',{polling:false});bot.sendMessage('%CHAT_ID%','✅ *BOT CONFIGURADO CORRECTAMENTE*\n\nTu bot de BIP Homebanking está listo para recibir notificaciones!',{parse_mode:'Markdown'}).then(()=>console.log('\n✅ ¡MENSAJE ENVIADO! Revisa tu Telegram\n')).catch(e=>console.error('\n❌ ERROR:',e.message,'\n'));"
cd ..
echo.
pause
echo.
echo ============================================
echo   CONFIGURACION COMPLETA!
echo ============================================
echo.
echo Ahora necesitas actualizar estas variables en Railway:
echo.
echo TELEGRAM_BOT_TOKEN=%BOT_TOKEN%
echo TELEGRAM_CHAT_ID=%CHAT_ID%
echo.
echo Ve a: https://railway.app
echo 1. Selecciona tu proyecto
echo 2. Ve a Variables
echo 3. Agrega o actualiza estas dos variables
echo 4. Redeploy el proyecto
echo.
pause
