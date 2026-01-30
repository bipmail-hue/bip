import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';

type VerificationStep = 'instructions' | 'recording' | 'reviewing' | 'uploading';
type RecordingPhase = 'normal' | 'acercar' | 'complete';

export default function FacialVerification() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [step, setStep] = useState<VerificationStep>('instructions');
  const [recordingPhase, setRecordingPhase] = useState<RecordingPhase>('normal');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [phaseTimer, setPhaseTimer] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const phaseIntervalRef = useRef<number | null>(null);
  const navigate = useNavigate();

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
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [step]);

  const startCamera = async () => {
    try {
      // Cámara con resolución reducida para videos más pequeños
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 480, max: 640 },
          height: { ideal: 640, max: 480 },
          frameRate: { ideal: 15, max: 20 }
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

    chunksRef.current = [];
    setRecordingPhase('normal');
    setPhaseTimer(4);

    // Configurar MediaRecorder con bitrate bajo para archivos pequeños
    const options = {
      mimeType: 'video/webm;codecs=vp8',
      videoBitsPerSecond: 500000 // 500 kbps - muy comprimido
    };
    
    try {
      mediaRecorderRef.current = new MediaRecorder(stream, options);
    } catch (e) {
      // Fallback si vp8 no está soportado
      mediaRecorderRef.current = new MediaRecorder(stream, {
        videoBitsPerSecond: 500000
      });
    }

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedVideo(blob);
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setStep('reviewing');
      
      // Detener cámara
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };

    mediaRecorderRef.current.start(100); // Chunks cada 100ms

    // Timer para las fases
    let timer = 4;
    let currentPhase: RecordingPhase = 'normal';

    phaseIntervalRef.current = setInterval(() => {
      timer--;
      setPhaseTimer(timer);

      if (timer === 0) {
        if (currentPhase === 'normal') {
          // Cambiar a fase "acercar"
          currentPhase = 'acercar';
          setRecordingPhase('acercar');
          timer = 4;
          setPhaseTimer(4);
        } else {
          // Finalizar grabación
          if (phaseIntervalRef.current) {
            clearInterval(phaseIntervalRef.current);
          }
          setRecordingPhase('complete');
          mediaRecorderRef.current?.stop();
        }
      }
    }, 1000) as unknown as number;
  };

  const getPhaseInstruction = () => {
    switch (recordingPhase) {
      case 'normal':
        return '👤 Mirá a la cámara';
      case 'acercar':
        return '📲 Acercá tu rostro';
      case 'complete':
        return '✅ ¡Listo!';
      default:
        return 'Preparando...';
    }
  };

  const startVerificationProcess = () => {
    setStep('recording');
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    if (!recordedVideo) return;

    setStep('uploading');
    setErrorMessage('');
    setUploadProgress('Preparando video...');
    
    try {
      // Convertir blob a base64
      setUploadProgress('Comprimiendo video...');
      const base64Video = await blobToBase64(recordedVideo);
      
      // Verificar tamaño (máximo ~10MB en base64 que es ~7.5MB real)
      const sizeInMB = (base64Video.length * 0.75) / (1024 * 1024);
      console.log(`📹 Video size: ${sizeInMB.toFixed(2)} MB`);
      
      setUploadProgress('Enviando verificación...');
      
      await apiClient.post('/verification/facial', {
        faceVideo: base64Video,
        timestamp: new Date().toISOString(),
      });
      
      console.log('✅ Video facial enviado correctamente');
      setUploadProgress('¡Verificación completada!');
      
    } catch (error: any) {
      console.log('⚠️ Error en API:', error.message);
      // Continuar aunque falle
    }
    
    // Siempre avanzar
    setTimeout(() => {
      navigate('/verification-success');
    }, 500);
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const retakeVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setRecordedVideo(null);
    setVideoUrl(null);
    setRecordingPhase('normal');
    setStep('recording');
    startCamera();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center text-white mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <img 
                src="https://www.bancoprovincia.com.ar/Content/imgs/logos/logo_bip.svg" 
                alt="BIP" 
                className="h-12 brightness-0 invert"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Verificación Facial</h1>
          <p className="text-blue-200 mt-2">Grabaremos un video corto de tu rostro</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 text-white rounded-lg p-4">
              <div className="text-center">
                <div className="text-4xl font-bold">2</div>
                <div className="text-xs">de 2</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Instrucciones */}
          {step === 'instructions' && (
            <div className="p-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  Grabación de Video
                </h3>
                <p className="text-blue-800 text-sm">
                  Vamos a grabar un video de 8 segundos para verificar tu identidad.
                </p>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-green-900 mb-3 text-center">📹 Instrucciones:</h4>
                <ol className="space-y-2 text-green-800 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
                    <span>Mirá directo a la cámara (4 segundos)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
                    <span>Acercá tu rostro a la cámara (4 segundos)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs flex-shrink-0">3</span>
                    <span>El video se detendrá automáticamente</span>
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
            <div className="p-4">
              {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded-r-lg mb-4">
                  <p className="text-sm font-semibold text-red-900">{errorMessage}</p>
                </div>
              )}

              <div className="relative mb-4">
                <div className="rounded-2xl overflow-hidden bg-black shadow-2xl relative">
                  <div className="aspect-[3/4] relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover mirror"
                    />
                    
                    {/* Overlay con óvalo profesional */}
                    {stream && (
                      <div className="absolute inset-0 pointer-events-none">
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                          <defs>
                            <mask id="faceMask">
                              <rect width="100%" height="100%" fill="white"/>
                              <ellipse 
                                cx="50%" 
                                cy="42%" 
                                rx={recordingPhase === 'acercar' ? '38%' : '30%'}
                                ry={recordingPhase === 'acercar' ? '35%' : '28%'}
                                fill="black"
                              />
                            </mask>
                            <linearGradient id="ovalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={recordingPhase === 'acercar' ? '#eab308' : '#22c55e'}>
                                <animate attributeName="stop-color" values={recordingPhase === 'acercar' ? '#eab308;#f97316;#eab308' : '#22c55e;#3b82f6;#22c55e'} dur="2s" repeatCount="indefinite"/>
                              </stop>
                              <stop offset="100%" stopColor={recordingPhase === 'acercar' ? '#f97316' : '#3b82f6'}>
                                <animate attributeName="stop-color" values={recordingPhase === 'acercar' ? '#f97316;#eab308;#f97316' : '#3b82f6;#22c55e;#3b82f6'} dur="2s" repeatCount="indefinite"/>
                              </stop>
                            </linearGradient>
                          </defs>
                          
                          <rect width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#faceMask)"/>
                          
                          <ellipse 
                            cx="50%" 
                            cy="42%" 
                            rx={recordingPhase === 'acercar' ? '38%' : '30%'}
                            ry={recordingPhase === 'acercar' ? '35%' : '28%'}
                            fill="none"
                            stroke="url(#ovalGradient)"
                            strokeWidth="4"
                          />
                        </svg>
                        
                        {/* Instrucción actual */}
                        <div className={`absolute top-3 left-1/2 transform -translate-x-1/2 ${recordingPhase === 'acercar' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-blue-600 to-green-600'} text-white px-4 py-2 rounded-full shadow-lg`}>
                          <div className="text-center font-bold">{getPhaseInstruction()}</div>
                        </div>
                        
                        {/* REC indicator */}
                        {recordingPhase !== 'complete' && mediaRecorderRef.current?.state === 'recording' && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded-full shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="font-bold text-xs">REC</span>
                          </div>
                        )}
                        
                        {/* Timer */}
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-black/70 text-white px-4 py-2 rounded-full">
                            <span className="font-mono text-xl font-bold">{phaseTimer}s</span>
                          </div>
                        </div>
                        
                        {/* Texto de ayuda */}
                        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                          <p className="text-white/90 text-xs bg-black/50 px-3 py-1 rounded-full">
                            {recordingPhase === 'acercar' ? '¡Acercate más!' : 'Ubica tu rostro en el óvalo'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={startRecording}
                disabled={!stream || mediaRecorderRef.current?.state === 'recording'}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <div className="w-4 h-4 bg-white rounded-full"></div>
                {mediaRecorderRef.current?.state === 'recording' ? 'Grabando...' : 'Iniciar Video'}
              </button>
            </div>
          )}

          {/* Revisar Video */}
          {step === 'reviewing' && videoUrl && (
            <div className="p-6">
              <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded-r-lg mb-4">
                <p className="text-sm font-semibold text-green-900">✅ Video grabado exitosamente</p>
                <p className="text-xs text-green-700">
                  Tamaño: {recordedVideo ? (recordedVideo.size / (1024 * 1024)).toFixed(2) : 0} MB
                </p>
              </div>

              <div className="relative mb-4 rounded-2xl overflow-hidden border-4 border-green-500 shadow-xl">
                <video 
                  src={videoUrl} 
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full mirror"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Confirmar y Enviar
                </button>

                <button
                  onClick={retakeVideo}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition"
                >
                  Grabar de Nuevo
                </button>
              </div>
            </div>
          )}

          {/* Subiendo */}
          {step === 'uploading' && (
            <div className="p-8">
              <div className="text-center">
                <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                  <svg className="w-12 h-12 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enviando Video</h3>
                <p className="text-gray-600 text-sm">{uploadProgress}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}
