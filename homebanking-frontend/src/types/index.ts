// 🔐 Tipos seguros para la aplicación
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  currency: string;
  type: 'checking' | 'savings';
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  balance: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
