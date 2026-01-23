// ⚡ App.tsx con lazy loading y React Query
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy loading para mejor rendimiento
const Login = lazy(() => import('./components/auth/Login'));
const DNIVerification = lazy(() => import('./components/auth/DNIVerification'));
const FacialVerification = lazy(() => import('./components/auth/FacialVerification'));
const VerificationSuccess = lazy(() => import('./components/auth/VerificationSuccess'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));

// Cliente de React Query con configuración optimizada
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Cargando...</p>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dni-verification"
              element={
                <ProtectedRoute>
                  <DNIVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/facial-verification"
              element={
                <ProtectedRoute>
                  <FacialVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verification-success"
              element={
                <ProtectedRoute>
                  <VerificationSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

