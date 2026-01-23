// ✅ Validaciones para seguridad de inputs
export const validateUsername = (username: string): string | null => {
  if (!username || username.trim().length === 0) {
    return 'El usuario es requerido';
  }
  if (username.length < 3) {
    return 'El usuario debe tener al menos 3 caracteres';
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return 'El usuario solo puede contener letras, números, guiones y guiones bajos';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password || password.length === 0) {
    return 'La contraseña es requerida';
  }
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  return null;
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Prevenir XSS básico
    .substring(0, 100); // Limitar longitud
};
