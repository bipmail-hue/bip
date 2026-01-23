# 🔒 Guía de Seguridad - HomeBanking

## Medidas de Seguridad Implementadas

### 1. Autenticación y Autorización

#### JWT (JSON Web Tokens)
- **Expiración**: Tokens con validez de 24 horas
- **Almacenamiento**: LocalStorage (en producción considerar cookies HttpOnly)
- **Header**: Authorization: Bearer {token}
- **Secret**: Variable de entorno JWT_SECRET

#### Password Hashing
- **Algoritmo**: bcrypt
- **Salt Rounds**: 10
- **Nunca** se almacenan contraseñas en texto plano

### 2. Protección de Rutas

#### Frontend
- \`ProtectedRoute\` component verifica autenticación
- Redirección automática a /login si no autenticado
- Verificación en cada cambio de ruta

#### Backend
- Middleware \`authenticateToken\` en todas las rutas protegidas
- Verificación de token en cada request
- Response 401 si token inválido/expirado

### 3. Rate Limiting

#### Global
- **Límite**: 100 requests / 15 minutos por IP
- **Objetivo**: Prevenir abuso de API

#### Login Endpoint
- **Límite**: 5 intentos / 15 minutos por IP
- **Objetivo**: Prevenir ataques de fuerza bruta
- **Mensaje**: Claro para el usuario

### 4. Headers de Seguridad (Helmet.js)

\`\`\`javascript
{
  contentSecurityPolicy: true,    // Previene XSS
  hsts: {                         // HTTP Strict Transport Security
    maxAge: 31536000,             // 1 año
    includeSubDomains: true,
    preload: true
  },
  xssFilter: true,                // Filtro XSS
  noSniff: true,                  // X-Content-Type-Options
  frameguard: true                // Previene clickjacking
}
\`\`\`

### 5. CORS (Cross-Origin Resource Sharing)

\`\`\`javascript
{
  origin: 'http://localhost:5173',  // Solo frontend permitido
  credentials: true,                // Cookies permitidas
}
\`\`\`

### 6. Validación de Inputs

#### Client-Side (Frontend)
- Validación de username: min 3 caracteres, solo alfanuméricos
- Validación de password: min 6 caracteres
- Sanitización: Remover caracteres peligrosos (<, >)
- Límite de longitud: Máximo 100 caracteres

#### Server-Side (Backend)
- Validación duplicada en backend
- Payload limit: 10kb máximo
- Type checking con TypeScript

### 7. Protección XSS

- Sanitización de inputs antes de almacenar
- Escapado de outputs en componentes React
- Content Security Policy headers
- No uso de dangerouslySetInnerHTML

### 8. HTTPS (Producción)

Para producción, configurar:

\`\`\`javascript
// Backend con SSL
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, app).listen(443);
\`\`\`

## Mejores Prácticas Adicionales

### Variables de Entorno

**NUNCA** commitear archivos .env al repositorio

\`\`\`bash
# .gitignore
.env
.env.local
.env.production
\`\`\`

### Logs de Seguridad

Implementar logging de eventos críticos:

\`\`\`javascript
// Ejemplos de eventos a logear
- Intentos de login fallidos
- Acceso a endpoints protegidos sin token
- Rate limit exceeded
- Errores de servidor
\`\`\`

### Monitoreo

Herramientas recomendadas:
- **Sentry**: Tracking de errores
- **DataDog**: Monitoreo de performance
- **New Relic**: APM
- **CloudWatch**: Logs y métricas (AWS)

### Auditoría de Dependencias

\`\`\`bash
# Verificar vulnerabilidades
npm audit

# Actualizar automáticamente
npm audit fix

# Ver reporte detallado
npm audit --json
\`\`\`

### Base de Datos (Producción)

Si usas PostgreSQL/MongoDB:

\`\`\`javascript
// Prepared statements (previene SQL injection)
const result = await db.query(
  'SELECT * FROM users WHERE username = $1',
  [username]
);

// Validación de ObjectId en MongoDB
const isValidId = mongoose.Types.ObjectId.isValid(id);
\`\`\`

## Checklist de Seguridad para Producción

- [ ] Cambiar JWT_SECRET a valor aleatorio seguro
- [ ] Habilitar HTTPS/SSL
- [ ] Configurar CORS con dominio real
- [ ] Configurar rate limiting apropiado
- [ ] Implementar refresh tokens
- [ ] Agregar logging completo
- [ ] Configurar cookies HttpOnly para tokens
- [ ] Implementar 2FA (Two-Factor Authentication)
- [ ] Agregar CAPTCHA en login
- [ ] Configurar WAF (Web Application Firewall)
- [ ] Implementar session timeout
- [ ] Agregar IP whitelisting (si aplica)
- [ ] Configurar backup automático
- [ ] Implementar disaster recovery plan
- [ ] Auditar dependencias regularmente
- [ ] Configurar monitoring y alertas

## Vulnerabilidades Comunes Prevenidas

### ✅ Prevención de Ataques

| Ataque | Prevención Implementada |
|--------|------------------------|
| Fuerza Bruta | Rate limiting (5 intentos/15min) |
| SQL Injection | N/A (no usamos SQL directamente) |
| XSS | Sanitización + CSP headers |
| CSRF | CORS + Token verification |
| Session Hijacking | JWT con expiración |
| Man-in-the-Middle | HTTPS (producción) |
| DoS | Rate limiting global |
| Clickjacking | X-Frame-Options header |

## Contacto de Seguridad

Si encuentras una vulnerabilidad:
- **NO** la publiques públicamente
- Envía un email a: security@example.com
- Incluye pasos para reproducir
- Tiempo de respuesta: 48 horas

## Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Security](https://react.dev/learn/keeping-components-pure)

---

**Última actualización**: Enero 2026
