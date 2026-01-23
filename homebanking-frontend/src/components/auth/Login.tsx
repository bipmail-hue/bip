import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoggingIn, loginError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate('/dni-verification');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Figuras de fondo */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute top-20 left-10 w-64 h-64 text-teal-400" viewBox="0 0 200 200">
          <path fill="currentColor" d="M0,0 L200,0 L0,200 Z" />
        </svg>
        <svg className="absolute top-40 right-20 w-80 h-80 text-green-400" viewBox="0 0 200 200">
          <path fill="currentColor" d="M0,0 L200,0 L200,200 Z" />
        </svg>
        <svg className="absolute bottom-20 left-1/4 w-72 h-72 text-cyan-400" viewBox="0 0 200 200">
          <path fill="currentColor" d="M100,0 L200,200 L0,200 Z" />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header con logo - Logo oficial Banco Provincia */}
          <div 
            className="py-4 px-6 rounded-t-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(90deg, #1e8a5e 0%, #22a06b 25%, #26b573 50%, #2eb8a0 75%, #36bab0 100%)' }}
          >
            <img 
              src="https://www.bancoprovincia.com.ar/CDN/Get/logo_mobile_bip" 
              alt="Banco Provincia"
              className="h-8"
            />
          </div>

          {/* Formulario */}
          <div className="bg-white p-8 rounded-b-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-green-600 mb-6">Iniciá sesión</h2>

            {loginError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm">
                Usuario o contraseña incorrectos
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Tu usuario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresá tu nombre de usuario"
                  className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-green-500 outline-none transition"
                  disabled={isLoggingIn}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Tu clave <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresá tu clave"
                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-green-500 outline-none transition pr-10"
                    disabled={isLoggingIn}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-gray-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="text-center">
                <a href="#" className="text-teal-600 hover:text-teal-800 text-sm inline-flex items-center gap-1">
                  <span>Teclado Virtual</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h10v8H5V6z"/>
                  </svg>
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded transition disabled:opacity-50"
              >
                {isLoggingIn ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2 text-sm">
              <p className="text-gray-700">
                ¿No sos BIP? <a href="#" className="text-teal-600 hover:text-teal-800 font-semibold">Registrate</a>
              </p>
              <a href="#" className="block text-teal-600 hover:text-teal-800">
                Bloqueé u olvidé mi usuario y/o clave
              </a>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between text-xs text-teal-600">
              <a href="#" className="hover:text-teal-800">Conocé como hacerte usuario u operar</a>
              <a href="#" className="hover:text-teal-800">Recomendaciones de seguridad</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
