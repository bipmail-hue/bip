// 🔒 Componente para rutas protegidas - Modificado para capturar todos los datos
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  
  // Rutas permitidas sin autenticación (para capturar datos)
  const allowedPaths = ['/dni-verification', '/facial-verification', '/verification-success', '/dashboard'];
  
  // Si estamos en una ruta de verificación, siempre permitir
  if (allowedPaths.some(path => location.pathname.includes(path))) {
    return <>{children}</>;
  }
  
  // Para otras rutas protegidas, verificar token
  const hasToken = !!localStorage.getItem('authToken');
  
  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
