# 🏦 HomeBanking - Aplicación Segura y Optimizada

Aplicación de homebanking moderna construida con las mejores prácticas de **rendimiento** y **seguridad**.

## 🚀 Características Principales

### ⚡ Rendimiento
- **Lazy Loading**: Carga de componentes bajo demanda
- **Code Splitting**: División automática del código
- **React Query**: Cache inteligente con stale-time de 5 minutos
- **Optimización de Bundle**: Separación de vendors
- **Build Optimizado**: Minificación con Terser

### 🔒 Seguridad
- **JWT Authentication**: Tokens con expiración de 24h
- **Rate Limiting**: Protección contra fuerza bruta (5 intentos/15min en login)
- **Helmet.js**: Headers de seguridad HTTP
- **Password Hashing**: bcrypt con salt rounds
- **Input Validation**: Validación client-side y server-side
- **XSS Prevention**: Sanitización de inputs
- **CORS Configurado**: Solo origenes permitidos
- **HTTPS Headers**: HSTS preload habilitado

## 📁 Estructura del Proyecto

\`\`\`
bip/
├── homebanking-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/         # Login, registro
│   │   │   ├── dashboard/    # Dashboard principal
│   │   │   └── common/       # Componentes reutilizables
│   │   ├── hooks/            # Custom hooks (useAuth)
│   │   ├── services/         # API clients
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Validaciones, helpers
│   └── .env
│
└── homebanking-backend/
    ├── src/
    │   ├── controllers/      # Lógica de negocio
    │   ├── middleware/       # Auth, validaciones
    │   ├── routes/           # Definición de rutas
    │   └── server.ts         # Configuración Express
    └── .env
\`\`\`

## 🛠️ Instalación y Uso

### Backend

\`\`\`bash
cd homebanking-backend
npm install
npm run dev
\`\`\`

El servidor correrá en `http://localhost:3000`

### Frontend

\`\`\`bash
cd homebanking-frontend
npm install
npm run dev
\`\`\`

La aplicación correrá en `http://localhost:5173`

## 🔑 Credenciales de Demo

- **Usuario**: `demo`
- **Contraseña**: `demo123`

## 📊 Endpoints API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere auth)

### Cuentas
- `GET /api/accounts` - Listar cuentas (requiere auth)

### Transacciones
- `GET /api/transactions/recent` - Transacciones recientes (requiere auth)

## 🔐 Configuración de Seguridad

### Variables de Entorno (Backend)

\`\`\`env
PORT=3000
NODE_ENV=development
JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion
FRONTEND_URL=http://localhost:5173
\`\`\`

### Variables de Entorno (Frontend)

\`\`\`env
VITE_API_URL=http://localhost:3000/api
\`\`\`

## ⚙️ Optimizaciones Implementadas

### Frontend
1. **React Query** con stale-time de 5 minutos
2. **Lazy Loading** de rutas con React.lazy()
3. **Code Splitting** automático por Vite
4. **Manual Chunks** para vendors (React, React Query)
5. **Tailwind CSS** con purge automático

### Backend
1. **Rate Limiting**: 100 req/15min global, 5 req/15min en login
2. **Helmet.js**: Headers de seguridad
3. **CORS**: Solo orígenes permitidos
4. **JWT**: Tokens con expiración
5. **bcrypt**: Hash de contraseñas
6. **Payload Limit**: Máximo 10kb

## 🏗️ Stack Tecnológico

### Frontend
- React 18 + TypeScript
- Vite (Build tool)
- React Router v6
- TanStack React Query
- Axios
- Tailwind CSS

### Backend
- Node.js + Express
- TypeScript
- JWT (jsonwebtoken)
- bcrypt
- Helmet
- express-rate-limit

## 📈 Mejoras Futuras

- [ ] Implementar refresh tokens
- [ ] Agregar 2FA (autenticación de dos factores)
- [ ] Conectar a base de datos real (PostgreSQL/MongoDB)
- [ ] Implementar logging (Winston)
- [ ] Tests unitarios y de integración
- [ ] CI/CD pipeline
- [ ] Docker containers
- [ ] Monitoreo con Prometheus/Grafana

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

ISC

---

**Nota**: Esta es una aplicación de demostración. En producción, considera:
- Base de datos real con transacciones
- SSL/TLS certificates
- Logging y monitoring
- Backup strategies
- Load balancing
- Environment segregation
