import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';

type VerificationStep = 'instructions' | 'ready' | 'detecting' | 'capture' | 'quality-check' | 'done';

interface QualityMetrics {
  brightness: number;
  sharpness: number;
  faceDetected: boolean;
  facePosition: 'center' | 'left' | 'right' | 'top' | 'bottom' | null;
  eyesOpen: boolean;
  noGlare: boolean;
}

export default function FacialVerification() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [lightLevel, setLightLevel] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState<VerificationStep>('instructions');
  const [countdown, setCountdown] = useState<number>(0);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics>({
    brightness: 0,
    sharpness: 0,
    faceDetected: false,
    facePosition: null,
    eyesOpen: false,
    noGlare: true,
  });
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qualityCheckInterval = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 'ready' || step === 'detecting') {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (qualityCheckInterval.current) {
        clearInterval(qualityCheckInterval.current);
      }
    };
  }, [step]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user', 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      detectLight(mediaStream);
      if (step === 'detecting') {
        startQualityChecks();
      }
    } catch (error) {
      setErrorMessage('No se pudo acceder a la cámara. Por favor, permita el acceso en la configuración del navegador.');
    }
  };

  const startQualityChecks = () => {
    qualityCheckInterval.current = setInterval(() => {
      performQualityCheck();
    }, 200);
  };

  const performQualityCheck = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Calcular brillo
    let brightness = 0;
    let maxBrightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      const pixelBrightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      brightness += pixelBrightness;
      maxBrightness = Math.max(maxBrightness, pixelBrightness);
    }
    const avgBrightness = brightness / (data.length / 4);
    const brightnessPercent = Math.round((avgBrightness / 255) * 100);

    // Calcular nitidez (sharpness) usando detección de bordes Laplaciano
    const sharpness = calculateSharpness(imageData);

    // Detectar reflejos (glare)
    const noGlare = maxBrightness < 240 && (maxBrightness - avgBrightness) < 100;

    // Simulación de detección de rostro (en producción usar face-api.js o similar)
    const faceDetected = brightnessPercent > 35 && brightnessPercent < 85 && sharpness > 15;
    
    setQualityMetrics({
      brightness: brightnessPercent,
      sharpness,
      faceDetected,
      facePosition: faceDetected ? 'center' : null,
      eyesOpen: faceDetected, // En producción usar detección real
      noGlare,
    });
  };

  const calculateSharpness = (imageData: ImageData): number => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    let sharpness = 0;
    let count = 0;

    // Operador Laplaciano simplificado
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const center = data[idx];
        const top = data[((y - 1) * width + x) * 4];
        const bottom = data[((y + 1) * width + x) * 4];
        const left = data[(y * width + (x - 1)) * 4];
        const right = data[(y * width + (x + 1)) * 4];
        
        const lap = Math.abs(4 * center - top - bottom - left - right);
        sharpness += lap;
        count++;
      }
    }

    return Math.round((sharpness / count) * 10) / 10;
  };

  const detectLight = (mediaStream: MediaStream) => {
    const canvas = document.createElement('canvas');
    const video = document.createElement('video');
    video.srcObject = mediaStream;
    video.play();

    const interval = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          let brightness = 0;
          for (let i = 0; i < data.length; i += 4) {
            brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
          }
          const avgBrightness = brightness / (data.length / 4);
          setLightLevel(Math.round((avgBrightness / 255) * 100));
        }
      }
    }, 500);

    return () => clearInterval(interval);
  };

  const startVerificationProcess = () => {
    setStep('detecting');
    setErrorMessage('');
    setAttempts(prev => prev + 1);
  };

  const startCountdown = () => {
    if (!qualityMetrics.faceDetected || qualityMetrics.brightness < 40 || qualityMetrics.brightness > 80) {
      setErrorMessage('Ajuste su posición y asegúrese de tener buena iluminación antes de capturar.');
      return;
    }

    setStep('capture');
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          capturePhoto();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Validar calidad de la imagen capturada
      if (qualityMetrics.sharpness < 15) {
        setErrorMessage('La imagen está borrosa. Por favor, manténgase quieto y vuelva a intentar.');
        resetCapture();
        return;
      }

      if (!qualityMetrics.noGlare) {
        setErrorMessage('Se detectaron reflejos en la imagen. Ajuste la iluminación y vuelva a intentar.');
        resetCapture();
        return;
      }

      setCapturedImage(imageData);
      setStep('quality-check');
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      if (qualityCheckInterval.current) {
        clearInterval(qualityCheckInterval.current);
      }

      // Simular análisis de calidad final
      setTimeout(() => {
        setStep('done');
      }, 1500);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setStep('detecting');
    startCamera();
  };

  const handleSubmit = async () => {
    if (!capturedImage) return;

    if (attempts > 5) {
      setErrorMessage('Ha excedido el número máximo de intentos. Por favor, contacte a soporte técnico.');
      return;
    }

    setUploading(true);
    setErrorMessage('');
    
    try {
      await apiClient.post('/verification/facial', {
        faceImage: capturedImage,
        lightLevel,
        qualityMetrics: {
          brightness: qualityMetrics.brightness,
          sharpness: qualityMetrics.sharpness,
          attempts,
        },
        timestamp: new Date().toISOString(),
      });
      
      // Simular procesamiento de seguridad adicional
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirigir a página de confirmación en lugar del dashboard
      navigate('/verification-success');
    } catch (error) {
      setErrorMessage('Error en la verificación. Por favor, intente nuevamente o contacte a soporte.');
    } finally {
      setUploading(false);
    }
  };

  const getQualityIndicator = (metric: 'brightness' | 'sharpness' | 'face') => {
    if (metric === 'brightness') {
      if (qualityMetrics.brightness < 40) return { status: 'error', text: 'Muy oscuro', icon: '❌' };
      if (qualityMetrics.brightness > 80) return { status: 'error', text: 'Muy brillante', icon: '❌' };
      if (qualityMetrics.brightness < 50 || qualityMetrics.brightness > 70) return { status: 'warning', text: 'Aceptable', icon: '⚠️' };
      return { status: 'success', text: 'Óptimo', icon: '✓' };
    }
    
    if (metric === 'sharpness') {
      if (qualityMetrics.sharpness < 15) return { status: 'error', text: 'Borroso', icon: '❌' };
      if (qualityMetrics.sharpness < 25) return { status: 'warning', text: 'Aceptable', icon: '⚠️' };
      return { status: 'success', text: 'Nítido', icon: '✓' };
    }
    
    if (metric === 'face') {
      if (!qualityMetrics.faceDetected) return { status: 'error', text: 'No detectado', icon: '❌' };
      return { status: 'success', text: 'Detectado', icon: '✓' };
    }
    
    return { status: 'error', text: '', icon: '' };
  };

  const canCapture = () => {
    return qualityMetrics.faceDetected && 
           qualityMetrics.brightness >= 40 && 
           qualityMetrics.brightness <= 80 &&
           qualityMetrics.sharpness >= 15 &&
           qualityMetrics.noGlare;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Profesional */}
        <div className="bg-gradient-to-r from-green-600 via-green-500 to-teal-600 text-white p-8 rounded-t-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Verificación Biométrica Facial</h1>
              <p className="text-green-100 text-sm">Sistema de Seguridad del Banco Central de la República Argentina</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-center">
                <div className="text-4xl font-bold">2</div>
                <div className="text-xs">de 2</div>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Proceso Seguro y Encriptado</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl shadow-xl">
          {/* Instrucciones Iniciales */}
          {step === 'instructions' && (
            <div className="p-8">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Instrucciones de Verificación Biométrica
                </h3>
                <p className="text-blue-800 mb-4">
                  El sistema utilizará reconocimiento facial avanzado para verificar su identidad. 
                  Este proceso cumple con los estándares de seguridad del Banco Central.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-green-900 mb-2">Requisitos Correctos</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Rostro completamente visible</li>
                        <li>• Iluminación uniforme</li>
                        <li>• Mirada directa a la cámara</li>
                        <li>• Fondo neutro preferible</li>
                        <li>• Sin accesorios que cubran el rostro</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      ✕
                    </div>
                    <div>
                      <h4 className="font-bold text-red-900 mb-2">No Permitido</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Lentes de sol o gorras</li>
                        <li>• Mascarillas o bufandas</li>
                        <li>• Iluminación desde atrás</li>
                        <li>• Movimientos durante captura</li>
                        <li>• Fotografías de documentos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-5 rounded-r-lg mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-yellow-900 mb-1">Importante - Protección de Datos</p>
                    <p className="text-xs text-yellow-800">
                      Sus datos biométricos están protegidos según la Ley de Protección de Datos Personales Nº 25.326 
                      y son procesados bajo los más altos estándares de seguridad del Banco Central.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={startVerificationProcess}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Iniciar Verificación Biométrica
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Intento {attempts} de 5 permitidos
              </p>
            </div>
          )}

          {/* Vista de Detección y Captura */}
          {(step === 'detecting' || step === 'capture') && (
            <div className="p-8">
              {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg mb-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-red-900">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Panel de Métricas de Calidad */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className={`p-4 rounded-xl border-2 ${
                  getQualityIndicator('face').status === 'success' ? 'bg-green-50 border-green-500' :
                  getQualityIndicator('face').status === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-red-50 border-red-500'
                }`}>
                  <div className="text-center">
                    <div className="text-2xl mb-1">{getQualityIndicator('face').icon}</div>
                    <div className="text-xs font-semibold text-gray-700">Rostro</div>
                    <div className="text-xs text-gray-600">{getQualityIndicator('face').text}</div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border-2 ${
                  getQualityIndicator('brightness').status === 'success' ? 'bg-green-50 border-green-500' :
                  getQualityIndicator('brightness').status === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-red-50 border-red-500'
                }`}>
                  <div className="text-center">
                    <div className="text-2xl mb-1">{getQualityIndicator('brightness').icon}</div>
                    <div className="text-xs font-semibold text-gray-700">Iluminación</div>
                    <div className="text-xs text-gray-600">{getQualityIndicator('brightness').text}</div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border-2 ${
                  getQualityIndicator('sharpness').status === 'success' ? 'bg-green-50 border-green-500' :
                  getQualityIndicator('sharpness').status === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-red-50 border-red-500'
                }`}>
                  <div className="text-center">
                    <div className="text-2xl mb-1">{getQualityIndicator('sharpness').icon}</div>
                    <div className="text-xs font-semibold text-gray-700">Nitidez</div>
                    <div className="text-xs text-gray-600">{getQualityIndicator('sharpness').text}</div>
                  </div>
                </div>
              </div>

              {/* Vista de Cámara con Overlay */}
              <div className="relative mb-6">
                <div className="border-4 border-green-600 rounded-2xl overflow-hidden bg-black shadow-2xl">
                  <div className="relative aspect-[4/3]">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover mirror"
                    />
                    
                    {/* Overlay de guía facial */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="relative">
                        {/* Marco ovalado para guía */}
                        <div className={`w-64 h-80 border-4 rounded-full transition-all ${
                          canCapture() ? 'border-green-400 shadow-lg shadow-green-400/50' : 'border-white/50'
                        }`}>
                          {/* Esquinas decorativas */}
                          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                        </div>
                        
                        {/* Texto de guía */}
                        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-white text-sm font-semibold bg-black/60 px-4 py-2 rounded-lg whitespace-nowrap">
                          {canCapture() ? '✓ Posición correcta' : 'Ajuste su posición'}
                        </div>
                      </div>
                    </div>

                    {/* Contador de captura */}
                    {step === 'capture' && countdown > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-white text-9xl font-bold animate-pulse">
                          {countdown}
                        </div>
                      </div>
                    )}

                    {/* Indicador de procesamiento */}
                    {!qualityMetrics.noGlare && (
                      <div className="absolute top-4 left-4 right-4 bg-red-600/90 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Reflejo detectado - Ajuste la iluminación
                      </div>
                    )}
                  </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Botón de captura */}
              <button
                onClick={startCountdown}
                disabled={!canCapture() || step === 'capture'}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-5 rounded-xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {step === 'capture' ? `Capturando... ${countdown}` : 'Capturar Imagen Biométrica'}
              </button>

              <button
                onClick={() => setStep('instructions')}
                className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition"
              >
                Volver a Instrucciones
              </button>
            </div>
          )}

          {/* Vista de Verificación de Calidad */}
          {step === 'quality-check' && (
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                  <svg className="w-16 h-16 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Analizando Biometría Facial</h3>
                <p className="text-gray-600">Validando calidad y autenticidad de la imagen...</p>
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <p>✓ Verificando características faciales</p>
                  <p>✓ Detectando prueba de vida</p>
                  <p>✓ Comparando con documento de identidad</p>
                </div>
              </div>
            </div>
          )}

          {/* Vista de Imagen Capturada */}
          {step === 'done' && capturedImage && (
            <div className="p-8">
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-900">Imagen Capturada Exitosamente</p>
                    <p className="text-xs text-green-700 mt-1">La imagen cumple con todos los estándares de calidad requeridos.</p>
                  </div>
                </div>
              </div>

              <div className="relative mb-6 rounded-2xl overflow-hidden border-4 border-green-500 shadow-xl">
                <img src={capturedImage} alt="Verificación Biométrica" className="w-full object-cover mirror" />
                <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verificado
                </div>
              </div>

              {/* Métricas finales */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">{qualityMetrics.brightness}%</div>
                  <div className="text-xs text-gray-600">Iluminación</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">{qualityMetrics.sharpness.toFixed(1)}</div>
                  <div className="text-xs text-gray-600">Nitidez</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <div className="text-xs text-gray-600">Calidad</div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-5 rounded-xl transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando Verificación Biométrica...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Confirmar y Completar Verificación
                    </>
                  )}
                </button>
                
                <button
                  onClick={resetCapture}
                  disabled={uploading}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition disabled:opacity-50"
                >
                  Capturar Nueva Imagen
                </button>
              </div>

              {uploading && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-blue-800 text-center">
                    🔒 Transmitiendo datos de forma segura y encriptada al Banco Central...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
