import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, X, RefreshCw, AlertCircle, Upload, SwitchCamera } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { compressImage } from '../../utils/imageCompressor';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
  onFallbackToFilePicker: () => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  onFallbackToFilePicker
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  // Stop active stream tracks safely
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Start camera stream
  const startCamera = useCallback(async (preferredFacing: 'environment' | 'user') => {
    setLoading(true);
    setError(null);

    // Stop existing stream if any
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Live camera access is not supported by your browser or environment. Please choose an image file instead.');
      setLoading(false);
      return;
    }

    try {
      // First try with preferred facingMode
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: preferredFacing },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
      } catch (firstErr) {
        // Fallback to any basic video constraint if ideal facingMode fails
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((playErr) => {
          console.warn('Video play error:', playErr);
        });
      }

      // Check available camera devices to see if switching is possible
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      } catch {
        setHasMultipleCameras(false);
      }

      setLoading(false);
    } catch (err: unknown) {
      const e = err as Error;
      console.error('Camera access error:', e);
      let msg = 'Could not access camera. Please allow camera permissions in your browser.';
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera access in your browser settings (look for the camera icon in your address bar).';
      } else if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
        msg = 'No camera device was detected on your machine.';
      } else if (e.name === 'NotReadableError' || e.name === 'TrackStartError') {
        msg = 'The camera is currently being used by another application. Please close other camera apps and retry.';
      }
      setError(msg);
      setLoading(false);
    }
  }, [stream]);

  // When modal opens/closes
  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [isOpen]);

  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleSnap = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Draw the video frame to the canvas
      ctx.drawImage(video, 0, 0, width, height);

      const rawDataUrl = canvas.toDataURL('image/jpeg', 0.9);

      // Compress photo for performance & storage
      const compressed = await compressImage(rawDataUrl, 1400, 1400, 0.85);

      // Stop stream and send capture
      stopStream();
      onCapture(compressed);
      onClose();
    } catch (err) {
      console.error('Failed to capture photo:', err);
      setError('Failed to capture photo from video feed.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleModalClose = () => {
    stopStream();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-nature-lg border border-sage-border overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-sage-border/60 bg-cream-light">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-forest" />
            <span className="font-bold text-sm text-charcoal">Nature Camera Viewfinder</span>
          </div>
          <div className="flex items-center gap-1">
            {hasMultipleCameras && (
              <button
                onClick={handleToggleFacingMode}
                className="p-1.5 text-charcoal-muted hover:text-forest hover:bg-sage-light rounded-lg transition-colors"
                title="Flip Camera (Front/Back)"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleModalClose}
              className="p-1.5 text-charcoal-muted hover:text-charcoal hover:bg-sage-light rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder Area */}
        <div className="relative bg-black flex-1 flex items-center justify-center min-h-[320px] max-h-[58vh] overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-2 bg-charcoal/90 z-10">
              <RefreshCw className="w-6 h-6 animate-spin text-sage" />
              <span className="text-xs font-medium">Connecting to camera device...</span>
            </div>
          )}

          {error ? (
            <div className="p-6 text-center text-cream space-y-3 max-w-sm mx-auto z-10">
              <div className="w-12 h-12 rounded-full bg-rose-900/50 text-rose-300 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-white">Camera Access Notice</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                {error}
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => startCamera(facingMode)}
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Retry Camera
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    handleModalClose();
                    onFallbackToFilePicker();
                  }}
                  icon={<Upload className="w-3.5 h-3.5" />}
                >
                  Upload File Instead
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Video Stream Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Guide Overlay */}
              <div className="absolute inset-4 pointer-events-none border border-white/25 rounded-2xl flex items-center justify-center">
                {/* Center target crosshair */}
                <div className="w-16 h-16 border-2 border-sage/60 rounded-xl relative">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-sage/40 -translate-y-1/2" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-sage/40 -translate-x-1/2" />
                </div>
                <div className="absolute bottom-2 text-[10px] text-white/80 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  Frame specimen in natural light
                </div>
              </div>
            </>
          )}

          {/* Hidden Canvas for Frame Capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Shutter / Controls Footer */}
        {!error && (
          <div className="p-4 bg-cream-light border-t border-sage-border/60 flex items-center justify-between">
            <button
              onClick={() => {
                handleModalClose();
                onFallbackToFilePicker();
              }}
              className="text-xs text-charcoal-muted hover:text-charcoal font-medium flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Choose File</span>
            </button>

            {/* Shutter Button */}
            <button
              type="button"
              disabled={loading || isCapturing}
              onClick={handleSnap}
              className="w-16 h-16 rounded-full bg-white border-4 border-forest p-1 shadow-nature hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
              title="Snap Specimen Photo"
            >
              <div className="w-full h-full rounded-full bg-forest flex items-center justify-center text-sage">
                {isCapturing ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-6 h-6" />
                )}
              </div>
            </button>

            {hasMultipleCameras ? (
              <button
                onClick={handleToggleFacingMode}
                className="text-xs text-charcoal-muted hover:text-forest font-medium flex items-center gap-1.5"
              >
                <SwitchCamera className="w-3.5 h-3.5" />
                <span>Flip</span>
              </button>
            ) : (
              <div className="w-16" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
