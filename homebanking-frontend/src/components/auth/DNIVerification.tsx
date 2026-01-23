import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';

export default function DNIVerification() {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Reducir tamaño si es muy grande (máx 1200px)
          const maxSize = 1200;
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
          
          // Comprimir a JPEG con calidad 0.8
          resolve(canvas.toDataURL('image/jpeg', 0.8));
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
      const response = await apiClient.post('/verification/dni', {
        frontImage,
        backImage,
      });
      console.log('✅ DNI verificado:', response.data);
      navigate('/facial-verification');
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error message:', error.message);
      const errorMsg = error.response?.data?.error || error.message || 'Error al verificar el DNI';
      alert('Error: ' + errorMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold">Verificación de Identidad</h1>
          <p className="text-sm mt-2">Paso 1 de 2: Documento Nacional de Identidad</p>
        </div>

        <div className="bg-white p-8 rounded-b-lg shadow-lg">
          <div className="mb-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-blue-700">
                📱 Por seguridad, necesitamos verificar tu identidad. Cargá fotos de tu DNI (frente y dorso).
              </p>
            </div>
          </div>

          {/* DNI Frente */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">DNI - Frente</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {frontImage ? (
                <div className="relative">
                  <img src={frontImage} alt="DNI Frente" className="max-w-full h-64 object-contain mx-auto rounded" />
                  <button
                    onClick={() => setFrontImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="space-y-3">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600 font-semibold">Tocar para cargar foto del frente</p>
                    <p className="text-xs text-gray-500">JPG, PNG o PDF - Máx 10MB</p>
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
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">DNI - Dorso</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {backImage ? (
                <div className="relative">
                  <img src={backImage} alt="DNI Dorso" className="max-w-full h-64 object-contain mx-auto rounded" />
                  <button
                    onClick={() => setBackImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="space-y-3">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600 font-semibold">Tocar para cargar foto del dorso</p>
                    <p className="text-xs text-gray-500">JPG, PNG o PDF - Máx 10MB</p>
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
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Verificando...' : 'Continuar con Verificación Facial'}
          </button>
        </div>
      </div>
    </div>
  );
}
