'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '../UI/Button';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (file: File) => void;
  isLoading: boolean;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, isLoading }) => {
  const [scanMethod, setScanMethod] = useState<'file' | 'camera'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      if (scanMethod !== 'camera' || isTransitioning) return;
      
      setIsTransitioning(true);
      try {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;
        
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            handleCapture();
          },
          () => {}
        );
      } catch (err) {
        console.error("Scanner start error:", err);
      } finally {
        if (isMounted) setIsTransitioning(false);
      }
    };

    const handleCapture = () => {
      const video = document.querySelector('video');
      if (video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera_capture.png", { type: "image/png" });
            onScan(file);
          }
        }, 'image/png');
      }
    };

    if (scanMethod === 'camera') {
      startScanner();
    }

    return () => {
      isMounted = false;
      if (scannerRef.current && scannerRef.current.isScanning) {
        setIsTransitioning(true);
        scannerRef.current.stop()
          .then(() => {
            scannerRef.current?.clear();
          })
          .catch(err => console.error("Scanner stop error:", err))
          .finally(() => setIsTransitioning(false));
      }
    };
  }, [scanMethod]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onScan(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onScan(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex bg-gray-200 p-1 rounded-lg mb-6">
        <button 
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${scanMethod === 'file' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
          onClick={() => setScanMethod('file')}
        >
          Upload File
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${scanMethod === 'camera' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
          onClick={() => setScanMethod('camera')}
        >
          Camera Scan
        </button>
      </div>

      {scanMethod === 'file' ? (
        <div 
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Upload QR Image</h3>
              <p className="text-sm text-gray-500 mt-1">Drag and drop or click to browse</p>
            </div>
            <Button onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Choose File'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-black rounded-xl overflow-hidden relative min-h-[300px] flex items-center justify-center">
          <div id="reader" className="w-full"></div>
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <p className="text-white font-medium">Analyzing...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
