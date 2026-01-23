# 🚀 Guía de Despliegue - HomeBanking

## Preparación para Producción

### 1. Variables de Entorno

#### Frontend (.env.production)
\`\`\`env
VITE_API_URL=https://api.tudominio.com/api
\`\`\`

#### Backend (.env.production)
\`\`\`env
PORT=3000
NODE_ENV=production
JWT_SECRET=tu-secreto-super-seguro-de-64-caracteres-minimo-con-numeros-y-simbolos
FRONTEND_URL=https://tudominio.com
DATABASE_URL=postgresql://user:password@host:5432/dbname
REDIS_URL=redis://user:password@host:6379
\`\`\`

### 2. Build de Producción

#### Frontend
\`\`\`bash
cd homebanking-frontend
npm run build

# Resultado en /dist
# - index.html
# - assets/
#   - main-[hash].js
#   - react-vendor-[hash].js
#   - query-vendor-[hash].js
#   - index-[hash].css
\`\`\`

#### Backend
\`\`\`bash
cd homebanking-backend
npm run build

# Resultado en /dist
# - server.js
# - routes/
# - controllers/
# - middleware/
\`\`\`

## Opciones de Despliegue

### Opción 1: Vercel + Render (Recomendado)

#### Frontend en Vercel

1. **Crear cuenta en Vercel**
   - https://vercel.com

2. **Importar proyecto**
   \`\`\`bash
   npm install -g vercel
   cd homebanking-frontend
   vercel
   \`\`\`

3. **Configurar**
   - Framework: Vite
   - Build Command: \`npm run build\`
   - Output Directory: \`dist\`
   - Environment Variables: \`VITE_API_URL\`

#### Backend en Render

1. **Crear cuenta en Render**
   - https://render.com

2. **Nuevo Web Service**
   - Connect Repository
   - Environment: Node
   - Build Command: \`npm install && npm run build\`
   - Start Command: \`npm start\`

3. **Variables de entorno**
   - Agregar todas las variables .env.production

### Opción 2: AWS (EC2 + S3 + CloudFront)

#### Frontend en S3 + CloudFront

\`\`\`bash
# 1. Build
npm run build

# 2. Crear bucket S3
aws s3 mb s3://homebanking-frontend

# 3. Copiar archivos
aws s3 sync dist/ s3://homebanking-frontend --acl public-read

# 4. Configurar CloudFront
# - Origin: S3 bucket
# - Viewer Protocol: Redirect HTTP to HTTPS
# - SSL Certificate: ACM certificate
\`\`\`

#### Backend en EC2

\`\`\`bash
# 1. SSH a EC2
ssh -i key.pem ubuntu@ec2-ip

# 2. Instalar Node.js
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar PM2
sudo npm install -g pm2

# 4. Clonar repositorio
git clone https://github.com/tu-repo/homebanking-backend
cd homebanking-backend

# 5. Instalar dependencias
npm install
npm run build

# 6. Configurar PM2
pm2 start dist/server.js --name homebanking-api
pm2 save
pm2 startup

# 7. Configurar Nginx
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
\`\`\`

**Nginx Configuration**:
\`\`\`nginx
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

### Opción 3: Docker + Railway/Fly.io

#### Dockerfile Frontend
\`\`\`dockerfile
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

#### Dockerfile Backend
\`\`\`dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
\`\`\`

#### docker-compose.yml
\`\`\`yaml
version: '3.8'

services:
  backend:
    build: ./homebanking-backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=\${JWT_SECRET}
      - DATABASE_URL=\${DATABASE_URL}
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./homebanking-frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=homebanking
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=\${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
\`\`\`

#### Despliegue en Railway
\`\`\`bash
npm install -g @railway/cli
railway login
railway init
railway up
\`\`\`

### Opción 4: Netlify + Heroku

#### Frontend en Netlify

1. **netlify.toml**
\`\`\`toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
\`\`\`

2. **Desplegar**
\`\`\`bash
npm install -g netlify-cli
netlify deploy --prod
\`\`\`

#### Backend en Heroku

1. **Procfile**
\`\`\`
web: node dist/server.js
\`\`\`

2. **Desplegar**
\`\`\`bash
heroku create homebanking-api
git push heroku main
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
\`\`\`

## SSL/TLS Certificates

### Let's Encrypt (Gratuito)

\`\`\`bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tudominio.com -d www.tudominio.com

# Auto-renewal
sudo certbot renew --dry-run
\`\`\`

## Base de Datos

### PostgreSQL en producción

\`\`\`javascript
// Backend: Usar pool de conexiones
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
\`\`\`

### MongoDB Atlas

1. Crear cluster en https://cloud.mongodb.com
2. Whitelist IP
3. Crear usuario
4. Obtener connection string

## Monitoreo y Logs

### Sentry (Error Tracking)

\`\`\`bash
npm install @sentry/react @sentry/node
\`\`\`

**Frontend**:
\`\`\`javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  environment: "production",
  tracesSampleRate: 0.1,
});
\`\`\`

**Backend**:
\`\`\`javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
});
\`\`\`

### LogRocket (Session Replay)

\`\`\`javascript
import LogRocket from 'logrocket';
LogRocket.init('app-id');
\`\`\`

## CI/CD Pipeline

### GitHub Actions

**.github/workflows/deploy.yml**
\`\`\`yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd homebanking-frontend && npm ci
      - run: cd homebanking-frontend && npm run build
      - uses: jakejarvis/s3-sync-action@master
        with:
          args: --acl public-read
        env:
          AWS_S3_BUCKET: \${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd homebanking-backend && npm ci
      - run: cd homebanking-backend && npm run build
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: \${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "homebanking-api"
          heroku_email: "your-email@example.com"
\`\`\`

## Checklist de Producción

### Seguridad
- [ ] HTTPS habilitado
- [ ] JWT_SECRET generado con openssl rand
- [ ] Variables de entorno configuradas
- [ ] Rate limiting ajustado
- [ ] CORS con dominio correcto
- [ ] Helmet configurado
- [ ] Auditoría de dependencias

### Performance
- [ ] Build optimizado
- [ ] Compresión gzip/brotli
- [ ] CDN configurado
- [ ] Cache headers correctos
- [ ] Database indexes creados
- [ ] Redis cache implementado

### Monitoring
- [ ] Sentry para errores
- [ ] Google Analytics
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Log aggregation (Loggly/Papertrail)
- [ ] Performance monitoring

### Backup
- [ ] Database backups automáticos
- [ ] Backup retention policy
- [ ] Disaster recovery plan

## Testing en Staging

\`\`\`bash
# Crear ambiente de staging
# - staging.tudominio.com
# - api-staging.tudominio.com

# Smoke tests
curl https://api-staging.tudominio.com/health
curl https://staging.tudominio.com
\`\`\`

## Rollback Strategy

\`\`\`bash
# Vercel
vercel rollback

# Heroku
heroku releases
heroku rollback v123

# Docker
docker-compose down
docker-compose up -d --force-recreate
\`\`\`

## Costos Estimados

| Servicio | Plan | Costo/mes |
|----------|------|-----------|
| Vercel (Frontend) | Pro | $20 |
| Render (Backend) | Starter | $7 |
| PostgreSQL | Hobby | $5 |
| Redis | Hobby | $3 |
| Sentry | Team | $26 |
| **Total** | | **~$61/mes** |

## Soporte y Mantenimiento

- **Updates semanales**: Dependencias
- **Backups diarios**: Base de datos
- **Monitoreo 24/7**: Uptime
- **Security patches**: Inmediatos

---

**¿Preguntas?** Abre un issue en GitHub.
