import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';

export default function DNIVerification() {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Reducir a máximo 800px para envío más rápido
          const maxSize = 800;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          // Calidad 0.6 (60%) para balance entre calidad y velocidad
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedImage = await compressImage(file);
      if (side === 'front') {
        setFrontImage(compressedImage);
      } else {
        setBackImage(compressedImage);
      }
    }
  };

  const handleSubmit = async () => {
    if (!frontImage || !backImage) {
      alert('Por favor cargá ambas fotos del DNI');
      return;
    }

    setUploading(true);
    try {
      // Intentar enviar al backend
      const response = await apiClient.post('/verification/dni', {
        frontImage,
        backImage,
      });
      console.log('✅ DNI enviado:', response.data);
    } catch (error: any) {
      // Si falla la API, continuar de todos modos
      console.log('⚠️ Error en API pero continuamos:', error.message);
    }
    
    // SIEMPRE avanzar al siguiente paso
    setUploading(false);
    navigate('/facial-verification');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-gray-50 via-white to-gray-100 py-6 sm:py-8 px-4">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className={`relative z-10 max-w-2xl mx-auto transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Header */}
        <div 
          className="text-white p-6 sm:p-8 rounded-t-2xl shadow-xl"
          style={{ background: 'linear-gradient(135deg, #1e8a5e 0%, #22a06b 50%, #2eb8a0 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Verificación de Identidad</h1>
              <p className="text-emerald-100 text-sm sm:text-base">Paso 1 de 2: Documento Nacional de Identidad</p>
            </div>
            <div className="hidden sm:flex bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="text-center">
                <div className="text-3xl font-bold">1</div>
                <div className="text-xs opacity-90">de 2</div>
              </div>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="mt-4">
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-white rounded-full transition-all duration-500"></div>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-b-2xl shadow-xl border border-gray-100">
          {/* Info card */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-4 sm:p-5 rounded-r-xl mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Verificación de seguridad</h3>
                <p className="text-sm text-blue-700">
                  Por tu seguridad, necesitamos verificar tu identidad. Cargá fotos claras de tu DNI (frente y dorso).
                </p>
              </div>
            </div>
          </div>

          {/* DNI Frente */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center gap-2">
              <span className="w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              DNI - Frente
            </h3>
            <div className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 ${
              frontImage ? 'border-emerald-400 bg-emerald-50/50' : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30'
            }`}>
              {frontImage ? (
                <div className="relative">
                  <img src={frontImage} alt="DNI Frente" className="max-w-full h-48 sm:h-64 object-contain mx-auto rounded-xl shadow-lg" />
                  <button
                    onClick={() => setFrontImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="mt-3 inline-flex items-center gap-2 text-emerald-600 font-medium">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Imagen cargada
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="space-y-3">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-semibold">Tocar para cargar foto del frente</p>
                    <p className="text-xs text-gray-500">JPG, PNG - Máx 10MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => handleFileChange(e, 'front')}
                  />
                </label>
              )}
            </div>
          </div>

          {/* DNI Dorso */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center gap-2">
              <span className="w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              DNI - Dorso
            </h3>
            <div className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 ${
              backImage ? 'border-emerald-400 bg-emerald-50/50' : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30'
            }`}>
              {backImage ? (
                <div className="relative">
                  <img src={backImage} alt="DNI Dorso" className="max-w-full h-48 sm:h-64 object-contain mx-auto rounded-xl shadow-lg" />
                  <button
                    onClick={() => setBackImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="mt-3 inline-flex items-center gap-2 text-emerald-600 font-medium">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Imagen cargada
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="space-y-3">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-semibold">Tocar para cargar foto del dorso</p>
                    <p className="text-xs text-gray-500">JPG, PNG - Máx 10MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => handleFileChange(e, 'back')}
                  />
                </label>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!frontImage || !backImage || uploading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </>
            ) : (
              <>
                Continuar con Verificación Facial
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
