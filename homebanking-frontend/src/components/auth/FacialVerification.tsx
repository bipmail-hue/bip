import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';

type VerificationStep = 'instructions' | 'recording' | 'reviewing' | 'uploading';
type RecordingPhase = 'normal' | 'acercar' | 'complete';

export default function FacialVerification() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [step, setStep] = useState<VerificationStep>('instructions');
  const [recordingPhase, setRecordingPhase] = useState<RecordingPhase>('normal');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [phaseTimer, setPhaseTimer] = useState<number>(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseIntervalRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // Función para comprimir imagen
  const compressImage = (canvas: HTMLCanvasElement): string => {
    // Redimensionar a 400px max para fotos faciales (muy comprimido)
    const maxSize = 400;
    const width = canvas.width;
    const height = canvas.height;
    
    let newWidth = width;
    let newHeight = height;
    
    if (width > height && width > maxSize) {
      newWidth = maxSize;
      newHeight = (height * maxSize) / width;
    } else if (height > maxSize) {
      newHeight = maxSize;
      newWidth = (width * maxSize) / height;
    }
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;
    const ctx = tempCanvas.getContext('2d');
    ctx?.drawImage(canvas, 0, 0, newWidth, newHeight);
    
    // Comprimir al 50% de calidad
    return tempCanvas.toDataURL('image/jpeg', 0.5);
  };

  // Capturar foto del video
  const capturePhoto = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(video, 0, 0);
    return compressImage(canvas);
  };

  useEffect(() => {
    if (step === 'recording') {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (phaseIntervalRef.current) {
        clearInterval(phaseIntervalRef.current);
      }
    };
  }, [step]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      setErrorMessage('No se pudo acceder a la cámara. Por favor, permita el acceso.');
    }
  };

  const startRecording = () => {
    if (!stream) return;

    const photos: string[] = [];
    
    // Iniciar secuencia de instrucciones
    setRecordingPhase('normal');
    setPhaseTimer(3);
    
    let timeLeft = 3;
    let currentPhase: RecordingPhase = 'normal';
    
    phaseIntervalRef.current = setInterval(() => {
      // Capturar foto cada segundo
      const photo = capturePhoto();
      if (photo) {
        photos.push(photo);
      }
      
      timeLeft--;
      setPhaseTimer(timeLeft);
      
      if (timeLeft === 0) {
        if (currentPhase === 'normal') {
          currentPhase = 'acercar';
          setRecordingPhase('acercar');
          timeLeft = 3;
          setPhaseTimer(3);
        } else {
          setRecordingPhase('complete');
          if (phaseIntervalRef.current) {
            clearInterval(phaseIntervalRef.current);
          }
          // Capturar última foto y finalizar
          setTimeout(() => {
            const lastPhoto = capturePhoto();
            if (lastPhoto) {
              photos.push(lastPhoto);
            }
            setCapturedPhotos(photos);
            setStep('reviewing');
            // Detener la cámara
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
            }
          }, 500);
        }
      }
    }, 1000) as unknown as number;
  };

  const startVerificationProcess = () => {
    setStep('recording');
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    if (capturedPhotos.length === 0) return;

    setStep('uploading');
    setErrorMessage('');
    
    try {
      // Enviar solo las fotos comprimidas (mucho más ligero que video)
      await apiClient.post('/verification/facial', {
        facePhotos: capturedPhotos,
        timestamp: new Date().toISOString(),
      });
      console.log('✅ Fotos faciales enviadas correctamente');
    } catch (error) {
      console.log('⚠️ Error en API pero continuamos:', error);
    }
    
    // SIEMPRE avanzar al siguiente paso
    navigate('/verification-success');
  };

  const retakeVideo = () => {
    setCapturedPhotos([]);
    setStep('recording');
    startCamera();
  };

  const getPhaseInstruction = () => {
    if (recordingPhase === 'normal') {
      return 'Muestra tu rostro a la cámara';
    } else if (recordingPhase === 'acercar') {
      return '¡Acerca tu rostro a la cámara!';
    }
    return 'Procesando...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-green-500 to-teal-600 text-white p-8 rounded-t-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Verificación Facial con Video</h1>
              <p className="text-green-100 text-sm">Paso 2 de 2: Grabación de Movimientos Faciales</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-center">
                <div className="text-4xl font-bold">2</div>
                <div className="text-xs">de 2</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl shadow-xl">
          {/* Instrucciones */}
          {step === 'instructions' && (
            <div className="p-8">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Verificación con Video Facial
                </h3>
                <p className="text-blue-800 mb-4">
                  Vamos a grabar un video corto de tu rostro para verificar tu identidad. Solo sigue las instrucciones en pantalla.
                </p>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-green-900 mb-3 text-center text-lg">📹 Qué voy a hacer:</h4>
                <ol className="space-y-3 text-green-800">
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
                    <span>Primero muestra tu rostro normal frente a la cámara (3 segundos)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
                    <span>Luego acerca tu cara hacia la cámara (3 segundos)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
                    <span>La grabación se detendrá automáticamente</span>
                  </li>
                </ol>
              </div>

              <button
                onClick={startVerificationProcess}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                Iniciar Grabación
              </button>
            </div>
          )}

          {/* Grabando */}
          {step === 'recording' && (
            <div className="p-8">
              {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg mb-6">
                  <p className="text-sm font-semibold text-red-900">{errorMessage}</p>
                </div>
              )}

              <div className="relative mb-6">
                <div className="rounded-2xl overflow-hidden bg-black shadow-2xl relative">
                  <div className="aspect-[3/4] sm:aspect-video relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover mirror"
                    />
                    
                    {/* Overlay oscuro con recorte de óvalo para el rostro */}
                    {stream && (
                      <div className="absolute inset-0 pointer-events-none">
                        {/* SVG con máscara para crear el efecto de óvalo recortado */}
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                          <defs>
                            {/* Definir máscara con óvalo recortado */}
                            <mask id="faceMask">
                              <rect width="100%" height="100%" fill="white"/>
                              <ellipse 
                                cx="50%" 
                                cy="45%" 
                                rx={recordingPhase === 'acercar' ? '35%' : '28%'}
                                ry={recordingPhase === 'acercar' ? '40%' : '32%'}
                                fill="black"
                                className="transition-all duration-500"
                              />
                            </mask>
                            {/* Gradiente animado para el borde */}
                            <linearGradient id="ovalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#22c55e">
                                <animate attributeName="stop-color" values="#22c55e;#3b82f6;#22c55e" dur="3s" repeatCount="indefinite"/>
                              </stop>
                              <stop offset="50%" stopColor="#3b82f6">
                                <animate attributeName="stop-color" values="#3b82f6;#22c55e;#3b82f6" dur="3s" repeatCount="indefinite"/>
                              </stop>
                              <stop offset="100%" stopColor="#22c55e">
                                <animate attributeName="stop-color" values="#22c55e;#3b82f6;#22c55e" dur="3s" repeatCount="indefinite"/>
                              </stop>
                            </linearGradient>
                          </defs>
                          
                          {/* Capa oscura con recorte */}
                          <rect 
                            width="100%" 
                            height="100%" 
                            fill="rgba(0,0,0,0.7)" 
                            mask="url(#faceMask)"
                          />
                          
                          {/* Borde del óvalo con gradiente animado */}
                          <ellipse 
                            cx="50%" 
                            cy="45%" 
                            rx={recordingPhase === 'acercar' ? '35%' : '28%'}
                            ry={recordingPhase === 'acercar' ? '40%' : '32%'}
                            fill="none"
                            stroke="url(#ovalGradient)"
                            strokeWidth="4"
                            className="transition-all duration-500"
                          />
                          
                          {/* Líneas guía sutiles */}
                          <line x1="50%" y1="25%" x2="50%" y2="30%" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="4,4"/>
                          <line x1="50%" y1="60%" x2="50%" y2="65%" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="4,4"/>
                        </svg>
                        
                        {/* Instrucción actual en la parte superior */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-full shadow-lg">
                          <div className="text-center">
                            <div className="text-lg font-bold">{getPhaseInstruction()}</div>
                          </div>
                        </div>
                        
                        {/* Indicador de captura */}
                        {recordingPhase !== 'complete' && (
                          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-full shadow-lg">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            <span className="font-bold text-sm">REC</span>
                          </div>
                        )}
                        
                        {/* Contador de tiempo en la parte inferior */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-black/60 backdrop-blur-sm text-white px-6 py-2 rounded-full">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="font-mono text-lg">{phaseTimer}s</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Texto de ayuda */}
                        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                          <p className="text-white/80 text-sm bg-black/40 px-4 py-1 rounded-full">
                            Ubica tu rostro dentro del óvalo
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Canvas oculto para capturar fotos */}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <button
                onClick={startRecording}
                disabled={!stream || (recordingPhase !== 'complete' && phaseTimer > 0)}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-5 rounded-xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <div className="w-4 h-4 bg-white rounded-full"></div>
                {phaseTimer > 0 ? 'Capturando...' : 'Iniciar Captura'}
              </button>
            </div>
          )}

          {/* Revisar Fotos */}
          {step === 'reviewing' && capturedPhotos.length > 0 && (
            <div className="p-8">
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg mb-6">
                <p className="text-sm font-semibold text-green-900">Fotos capturadas exitosamente</p>
                <p className="text-xs text-green-700 mt-1">{capturedPhotos.length} fotos capturadas para verificación</p>
              </div>

              <div className="relative mb-6 rounded-2xl overflow-hidden border-4 border-green-500 shadow-xl">
                {/* Mostrar última foto capturada */}
                <img 
                  src={capturedPhotos[capturedPhotos.length - 1]} 
                  alt="Última captura facial"
                  className="w-full mirror"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-5 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Confirmar y Enviar Verificación
                </button>

                <button
                  onClick={retakeVideo}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition"
                >
                  Capturar de Nuevo
                </button>
              </div>
            </div>
          )}

          {/* Subiendo */}
          {step === 'uploading' && (
            <div className="p-8">
              <div className="text-center">
                <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                  <svg className="w-16 h-16 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Procesando Verificación</h3>
                <p className="text-gray-600">Enviando y verificando su identidad...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
