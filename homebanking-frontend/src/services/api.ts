// ⚡ Cliente API optimizado con interceptores
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('🔗 API URL:', API_URL);

// Cliente con configuración de seguridad
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 120 segundos para videos grandes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('📤 Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Interceptor para manejar errores - NO redirigir, solo loguear
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('⚠️ Error en request:', error.message, error.config?.url);
    // NO redirigir, dejar que cada componente maneje el error
    return Promise.reject(error);
  }
);
