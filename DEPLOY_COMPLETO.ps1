# 🚀 Deploy Automático - BIP Homebanking
# Script de PowerShell para deployment automático

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "       🚀 DEPLOY AUTOMÁTICO A LA NUBE" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# Verificar que estamos en el directorio correcto
if (!(Test-Path "homebanking-backend") -or !(Test-Path "homebanking-frontend")) {
    Write-Host "❌ Error: No se encontraron las carpetas del proyecto" -ForegroundColor Red
    Write-Host "Ejecuta este script desde la carpeta raíz del proyecto" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "✅ Código ya subido a GitHub" -ForegroundColor Green
Write-Host ""

# ========================================
# RAILWAY (Backend)
# ========================================
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "🚂 PASO 1: Deploy Backend en Railway" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "Abriendo Railway..." -ForegroundColor Yellow
Start-Process "https://railway.app/new"

Write-Host ""
Write-Host "📋 Instrucciones para Railway:" -ForegroundColor Cyan
Write-Host "1. Login con GitHub"
Write-Host "2. Click 'Deploy from GitHub repo'"
Write-Host "3. Selecciona: bipmail-hue/bip"
Write-Host "4. Ve a Variables y agrega:"
Write-Host "   PORT=3000"
Write-Host "   NODE_ENV=production"
Write-Host "   JWT_SECRET=mi_super_secreto_BIP_2026_seguro"
Write-Host "   TELEGRAM_BOT_TOKEN=7964363913:AAEfVemjF9dX-WJ6JXRVTyT5PqhBJRACYMI"
Write-Host "   TELEGRAM_CHAT_ID=6968749488"
Write-Host "5. Settings → Networking → Generate Domain"
Write-Host ""

$railwayUrl = Read-Host "📝 Pega aquí la URL de Railway (ej: bip-production.up.railway.app)"
if ($railwayUrl -notlike "http*") {
    $railwayUrl = "https://$railwayUrl"
}
Write-Host "✅ Backend URL: $railwayUrl" -ForegroundColor Green
Write-Host ""

# ========================================
# VERCEL (Frontend)
# ========================================
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "⚡ PASO 2: Deploy Frontend en Vercel" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "Abriendo Vercel..." -ForegroundColor Yellow
Start-Process "https://vercel.com/new"

Write-Host ""
Write-Host "📋 Instrucciones para Vercel:" -ForegroundColor Cyan
Write-Host "1. Login con GitHub"
Write-Host "2. Import: bipmail-hue/bip"
Write-Host "3. Framework: Vite"
Write-Host "4. Root Directory: homebanking-frontend"
Write-Host "5. Build Command: npm run build"
Write-Host "6. Output Directory: dist"
Write-Host "7. Environment Variable:"
Write-Host "   Name: VITE_API_URL"
Write-Host "   Value: $railwayUrl/api" -ForegroundColor Yellow
Write-Host "8. Click Deploy"
Write-Host ""

$vercelUrl = Read-Host "📝 Pega aquí la URL de Vercel (ej: bip.vercel.app)"
if ($vercelUrl -notlike "http*") {
    $vercelUrl = "https://$vercelUrl"
}
Write-Host "✅ Frontend URL: $vercelUrl" -ForegroundColor Green
Write-Host ""

# ========================================
# RESUMEN FINAL
# ========================================
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "       🎉 ¡DEPLOY COMPLETADO!" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Tu aplicación está ONLINE y accesible desde cualquier móvil" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLS:" -ForegroundColor Cyan
Write-Host "   Backend:  $railwayUrl" -ForegroundColor Yellow
Write-Host "   Frontend: $vercelUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "📱 DESDE TU MÓVIL:" -ForegroundColor Cyan
Write-Host "   1. Abre el navegador"
Write-Host "   2. Ve a: $vercelUrl" -ForegroundColor Yellow
Write-Host "   3. Usa: admin/admin123 o demo/demo123"
Write-Host ""
Write-Host "🔐 HTTPS activado - La cámara funcionará perfectamente!" -ForegroundColor Green
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# Guardar URLs
$urlsContent = "# URLs de Deploy`n`nBackend: $railwayUrl`nFrontend: $vercelUrl`n`nUsuarios: admin/admin123 y demo/demo123`n`nFecha: $(Get-Date)"

$urlsContent | Out-File -FilePath "URLS_DEPLOY.txt" -Encoding UTF8
Write-Host "📝 URLs guardadas en: URLS_DEPLOY.txt" -ForegroundColor Green
Write-Host ""

# Abrir en navegador
$openBrowser = Read-Host "¿Quieres abrir la aplicación en el navegador? (S/N)"
if ($openBrowser -eq "S" -or $openBrowser -eq "s") {
    Start-Process $vercelUrl
    Write-Host "🌐 Abriendo $vercelUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
