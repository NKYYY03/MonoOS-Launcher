import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Contrast } from 'lucide-react';
import { CapturedPhoto } from '../../types/launcher';

interface CameraAppProps {
  onCapturePhoto: (photo: CapturedPhoto) => void;
  onOpenGallery: () => void;
  recentPhoto?: CapturedPhoto;
}

export const CameraApp: React.FC<CameraAppProps> = ({
  onCapturePhoto,
  onOpenGallery,
  recentPhoto,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bwFilter, setBwFilter] = useState(true);
  const [flashBlink, setFlashBlink] = useState(false);

  const startCamera = async () => {
    setErrorMsg(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg('Camera unavailable in this browser context');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCamera(true);
    } catch {
      setErrorMsg('Camera permission declined · Studio shutter active');
      setHasCamera(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleShutter = () => {
    setFlashBlink(true);
    window.setTimeout(() => setFlashBlink(false), 160);

    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (hasCamera && videoRef.current && videoRef.current.videoWidth > 0) {
      if (bwFilter) ctx.filter = 'grayscale(100%) contrast(1.15)';
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      // Minimalist architectural fallback capture
      const grad = ctx.createLinearGradient(0, 0, 480, 640);
      grad.addColorStop(0, '#18181b');
      grad.addColorStop(1, '#09090b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 480, 640);
      ctx.fillStyle = '#d71921';
      ctx.beginPath();
      ctx.arc(240, 320, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.fillText(`MONO CAPTURE ${new Date().toLocaleTimeString()}`, 95, 580);
    }

    onCapturePhoto({
      id: `pic-${Date.now()}`,
      dataUrl: canvas.toDataURL('image/jpeg', 0.85),
      capturedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <div className="flex flex-col h-full justify-between px-4 pt-1 pb-5 bg-zinc-950 text-white rounded-t-3xl">
      {/* Viewfinder */}
      <div className="relative flex-1 rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${hasCamera ? 'opacity-100' : 'opacity-0'} ${
            bwFilter ? 'grayscale contrast-115' : ''
          }`}
        />

        {!hasCamera && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center mb-3">
              <Camera className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="text-xs text-zinc-400 max-w-[220px]">
              {errorMsg || 'Initializing viewfinder...'}
            </p>
            <button
              type="button"
              onClick={startCamera}
              className="mt-3 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-medium flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" /> Retry Camera
            </button>
          </div>
        )}

        {/* Rule of thirds reticle */}
        <div className="pointer-events-none absolute inset-4 border border-white/10 rounded-2xl" />

        {flashBlink && <div className="absolute inset-0 bg-white/80 pointer-events-none" />}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-5 px-4">
        <button
          type="button"
          onClick={onOpenGallery}
          aria-label="Open Photos"
          className="w-12 h-12 rounded-2xl overflow-hidden bg-zinc-800 border border-white/15 flex items-center justify-center"
        >
          {recentPhoto ? (
            <img src={recentPhoto.dataUrl} alt="Recent capture" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-zinc-400">Vault</span>
          )}
        </button>

        <button
          type="button"
          onClick={handleShutter}
          aria-label="Take photo"
          className="w-[72px] h-[72px] rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform"
        >
          <span className="w-[56px] h-[56px] rounded-full bg-white block" />
        </button>

        <button
          type="button"
          onClick={() => setBwFilter((v) => !v)}
          aria-label="Toggle monochrome filter"
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${
            bwFilter
              ? 'bg-white text-zinc-950 border-white'
              : 'bg-zinc-900 text-white border-white/15'
          }`}
        >
          <Contrast className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
