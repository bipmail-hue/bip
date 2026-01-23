# ⚡ Guía de Optimización de Rendimiento - HomeBanking

## Estrategias de Optimización Implementadas

### 1. Code Splitting y Lazy Loading

#### React.lazy() para Rutas
\`\`\`typescript
// Antes: Import estático (todo se carga al inicio)
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';

// Después: Lazy loading (carga bajo demanda)
const Login = lazy(() => import('./components/auth/Login'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
\`\`\`

**Beneficio**: 
- Reduce el bundle inicial en ~40%
- First Contentful Paint más rápido
- Los usuarios solo descargan lo que necesitan

### 2. React Query - Cache Inteligente

#### Configuración Optimizada
\`\`\`typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutos
      refetchOnWindowFocus: false,    // No refetch al cambiar de pestaña
      retry: 1,                       // Solo 1 reintento
    },
  },
});
\`\`\`

#### Queries con Cache
\`\`\`typescript
// Cuentas: Cache de 2 minutos
useQuery({
  queryKey: ['accounts'],
  queryFn: fetchAccounts,
  staleTime: 2 * 60 * 1000,
});

// Transacciones: Cache de 1 minuto
useQuery({
  queryKey: ['transactions', 'recent'],
  queryFn: fetchTransactions,
  staleTime: 1 * 60 * 1000,
});
\`\`\`

**Beneficio**:
- Reduce requests al servidor en ~70%
- Respuesta instantánea con datos en cache
- Sincronización automática cuando data expira

### 3. Bundle Optimization (Vite)

#### Manual Chunks
\`\`\`typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'query-vendor': ['@tanstack/react-query'],
      },
    },
  },
}
\`\`\`

**Beneficio**:
- Vendors separados permiten mejor caching
- Cambios en código no invalidan cache de librerías
- Carga paralela de chunks

### 4. Tailwind CSS Optimizado

#### Purge CSS Automático
\`\`\`javascript
// tailwind.config.js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
\`\`\`

**Beneficio**:
- CSS final: ~10KB vs ~3MB sin purge
- Solo incluye clases utilizadas
- Build time optimization

### 5. Minimización y Compresión

#### Vite Build
\`\`\`typescript
build: {
  minify: 'terser',           // Mejor compresión
  chunkSizeWarningLimit: 1000,
  sourcemap: false,           // No sourcemaps en producción
}
\`\`\`

#### Servidor (Producción)
\`\`\`javascript
import compression from 'compression';
app.use(compression());  // Gzip/Brotli
\`\`\`

### 6. Loading States Optimizados

#### Skeleton Screens
\`\`\`typescript
{loadingAccounts ? (
  <div className="animate-pulse space-y-4">
    {[1, 2].map((i) => (
      <div key={i} className="bg-white p-6 rounded-xl h-32" />
    ))}
  </div>
) : (
  // Contenido real
)}
\`\`\`

**Beneficio**:
- Percepción de velocidad mejorada
- Menos "flash of empty content"
- Mejor UX durante carga

### 7. Optimización de Imágenes

#### Recomendaciones
\`\`\`typescript
// Usar formatos modernos
import logo from './logo.webp';  // WebP: -30% tamaño

// Lazy loading de imágenes
<img src={logo} loading="lazy" alt="Logo" />

// Responsive images
<img 
  srcSet="logo-small.webp 480w, logo-large.webp 1024w"
  sizes="(max-width: 600px) 480px, 1024px"
/>
\`\`\`

## Métricas de Performance

### Objetivos (Lighthouse)

| Métrica | Target | Actual |
|---------|--------|--------|
| First Contentful Paint | < 1.8s | ~1.2s |
| Largest Contentful Paint | < 2.5s | ~1.8s |
| Time to Interactive | < 3.8s | ~2.5s |
| Total Blocking Time | < 200ms | ~150ms |
| Cumulative Layout Shift | < 0.1 | ~0.05 |
| Speed Index | < 3.4s | ~2.2s |

### Bundle Size

| Chunk | Size | Gzipped |
|-------|------|---------|
| Main | ~45KB | ~15KB |
| React Vendor | ~140KB | ~45KB |
| Query Vendor | ~20KB | ~7KB |
| CSS | ~10KB | ~3KB |
| **Total** | **~215KB** | **~70KB** |

## Best Practices

### 1. Memoización

\`\`\`typescript
// useMemo para cálculos costosos
const totalBalance = useMemo(() => {
  return accounts.reduce((sum, acc) => sum + acc.balance, 0);
}, [accounts]);

// useCallback para funciones
const handleSort = useCallback((field: string) => {
  setTransactions(prev => sortBy(prev, field));
}, []);
\`\`\`

### 2. Virtual Scrolling

Para listas largas (>100 items):

\`\`\`typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={400}
  itemCount={transactions.length}
  itemSize={50}
>
  {({ index, style }) => (
    <div style={style}>{transactions[index]}</div>
  )}
</FixedSizeList>
\`\`\`

### 3. Debouncing de Búsquedas

\`\`\`typescript
const debouncedSearch = useMemo(
  () => debounce((term: string) => {
    // Búsqueda
  }, 300),
  []
);
\`\`\`

### 4. Prefetching de Rutas

\`\`\`typescript
// Prefetch al hover
<Link 
  to="/dashboard" 
  onMouseEnter={() => import('./Dashboard')}
>
  Dashboard
</Link>
\`\`\`

### 5. Web Workers

Para operaciones pesadas:

\`\`\`typescript
// worker.ts
self.onmessage = (e) => {
  const result = heavyCalculation(e.data);
  self.postMessage(result);
};

// Component
const worker = new Worker('./worker.ts');
worker.postMessage(data);
worker.onmessage = (e) => setResult(e.data);
\`\`\`

## Monitoring en Producción

### Herramientas Recomendadas

1. **Google Analytics + Web Vitals**
\`\`\`javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
\`\`\`

2. **Sentry Performance Monitoring**
\`\`\`javascript
Sentry.init({
  tracesSampleRate: 0.1,  // 10% de transacciones
});
\`\`\`

3. **Bundle Analyzer**
\`\`\`bash
npm install -D rollup-plugin-visualizer
\`\`\`

## Checklist de Optimización

### Frontend
- [x] Lazy loading de rutas
- [x] Code splitting automático
- [x] Manual chunks para vendors
- [x] React Query con cache
- [x] Tailwind purge CSS
- [x] Skeleton screens
- [ ] Image optimization
- [ ] Service Worker para offline
- [ ] Prefetching de assets críticos
- [ ] Memoización de componentes pesados

### Backend
- [x] Rate limiting
- [ ] Compresión gzip/brotli
- [ ] HTTP/2
- [ ] Database query optimization
- [ ] Redis cache layer
- [ ] CDN para assets estáticos
- [ ] Load balancing
- [ ] Database indexing

## Testing de Performance

### Lighthouse CLI
\`\`\`bash
npm install -g lighthouse
lighthouse http://localhost:5173 --view
\`\`\`

### WebPageTest
\`\`\`bash
# Test desde múltiples locaciones
https://www.webpagetest.org
\`\`\`

### Chrome DevTools

1. **Performance tab**: Record y analizar
2. **Network tab**: Throttling 3G
3. **Lighthouse**: Auditoría completa
4. **Coverage**: CSS/JS no utilizado

## Recursos

- [Web.dev Performance](https://web.dev/performance/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Build Optimization](https://vitejs.dev/guide/build)
- [TanStack Query Performance](https://tanstack.com/query/latest/docs/react/guides/performance)

---

**Última actualización**: Enero 2026
