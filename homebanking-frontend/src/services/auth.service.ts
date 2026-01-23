// 🔐 Servicio de autenticación con validación
import { apiClient } from './api';
import type { LoginCredentials, AuthResponse, User } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('authToken', response.data.token);
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    await apiClient.post('/auth/logout');
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },
};
