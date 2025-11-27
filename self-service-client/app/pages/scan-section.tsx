'use client';

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { QrCode, Camera, RefreshCcw, CheckCircle, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ScanSection() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  const stopCamera = () => {
    if (codeReaderRef.current) codeReaderRef.current.reset();
    setIsScanning(false);
  };

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();

    codeReaderRef.current.listVideoInputDevices().then((devices) => {
      setVideoDevices(devices);
      setCurrentDeviceId(devices[0]?.deviceId || null);
    });

    return () => stopCamera();
  }, []);

  const startCamera = async (deviceId: string | null = currentDeviceId) => {
    if (!videoRef.current || !codeReaderRef.current || !deviceId) return;

    setIsScanning(true);

    codeReaderRef.current.decodeFromVideoDevice(
      deviceId,
      videoRef.current,
      (result, err) => {
        if (result) {
          setScanResult(result.getText());
          stopCamera();
          // langsung redirect
          window.location.href = result.getText();
        }
        if (err && !(err instanceof NotFoundException)) console.error(err);
      }
    );
  };

  const handleScanAgain = () => {
    setScanResult(null);
    if (currentDeviceId) startCamera(currentDeviceId);
  };

  const toggleCamera = () => {
    if (!videoDevices.length) return;
    const currentIndex = videoDevices.findIndex(d => d.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % videoDevices.length;
    const nextDeviceId = videoDevices[nextIndex].deviceId;
    setCurrentDeviceId(nextDeviceId);
    stopCamera();
    setTimeout(() => startCamera(nextDeviceId), 200);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col items-center justify-center px-6">
      <motion.div className="text-center mb-12">
        <motion.div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
          <QrCode size={16} /> Quick Order
        </motion.div>

        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-4">
          Scan Your Table
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Scan QR code di meja kamu untuk mulai memesan
        </p>
      </motion.div>

      <motion.div className="bg-white shadow-2xl rounded-3xl p-8 max-w-lg w-full border border-slate-200">
        {scanResult ? (
          <div className="text-center py-8">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">QR Code Detected!</h3>
            <p className="mb-4">Berhasil scan meja:</p>
            <div className="bg-blue-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
              <p className="text-3xl font-bold text-blue-600 font-mono">{scanResult}</p>
            </div>
            <button onClick={handleScanAgain} className="px-6 py-3 bg-amber-600 text-white rounded-full flex items-center gap-2">
              <RotateCcw size={18} /> Scan Again
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
              {!isScanning && (
                <div className="text-center text-slate-400">
                  <QrCode size={64} className="mx-auto mb-4 opacity-30" />
                  <p className="text-sm">Scanner will appear here</p>
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${isScanning ? "block" : "hidden"}`}
              />
            </div>

            <div className="w-full flex flex-col gap-3">
              <button
                onClick={() => startCamera()}
                className={`w-full px-6 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all bg-gradient-to-r from-amber-600 to-orange-500 hover:shadow-xl text-white`}
              >
                <Camera size={20} /> Start Camera Scan
              </button>

              {videoDevices.length > 1 && (
                <button
                  onClick={toggleCamera}
                  className="w-full px-6 py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-semibold flex items-center justify-center gap-3"
                >
                  <RefreshCcw size={20} /> Flip Camera
                </button>
              )}

              {isScanning && (
                <button
                  onClick={stopCamera}
                  className="w-full px-6 py-4 bg-red-500 text-white rounded-2xl font-semibold"
                >
                  Stop Camera
                </button>
              )}
            </div>

            <p className="text-xs text-slate-400 text-center mt-6">
              Arahkan kamera ke QR code yang ada di meja
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
