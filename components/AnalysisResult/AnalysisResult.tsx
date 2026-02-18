'use client';

import React, { useState } from 'react';
import { AnalysisResponse } from '@/lib/api';
import { Button } from '../UI/Button';

interface AnalysisResultProps {
  result: AnalysisResponse;
  onReset: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  const [showWarningModal, setShowWarningModal] = useState(false);

  const isSafe = result.status === 'safe';
  const isMalicious = result.status === 'malicious';
  const isSuspicious = result.status === 'suspicious';

  const handleContinue = () => {
    if (isSuspicious) {
      setShowWarningModal(true);
    } else {
      window.open(result.final_url, '_blank');
    }
  };

  const confirmContinue = () => {
    window.open(result.final_url, '_blank');
    setShowWarningModal(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`rounded-2xl shadow-xl overflow-hidden border-t-8 ${
        isSafe ? 'border-green-500 bg-white' : 
        isMalicious ? 'border-red-500 bg-white' : 
        'border-yellow-500 bg-white'
      }`}>
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-full ${
              isSafe ? 'bg-green-100 text-green-600' : 
              isMalicious ? 'bg-red-100 text-red-600' : 
              'bg-yellow-100 text-yellow-600'
            }`}>
              {isSafe && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isMalicious && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {isSuspicious && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isSafe ? 'Link Terverifikasi Aman' : 
                 isMalicious ? 'BAHAYA TERDETEKSI!' : 
                 'Waspada: Link Mencurigakan'}
              </h2>
              <p className="text-gray-500 truncate max-w-md">{result.original_url}</p>
            </div>
          </div>

          {result.findings.length > 0 && (
            <div className={`mb-8 p-4 rounded-lg ${
              isMalicious ? 'bg-red-50 text-red-800' : 
              isSuspicious ? 'bg-yellow-50 text-yellow-800' : 
              'bg-blue-50 text-blue-800'
            }`}>
              <h4 className="font-semibold mb-2">Hasil Analisis Sandbox:</h4>
              <ul className="list-disc list-inside space-y-1">
                {result.findings.map((finding, idx) => (
                  <li key={idx} className="text-sm">{finding}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {isSafe && (
              <Button onClick={handleContinue} variant="secondary" fullWidth>
                Lanjut ke Tujuan
              </Button>
            )}

            {isMalicious && (
              <>
                <Button onClick={onReset} variant="primary" fullWidth>
                  Kembali
                </Button>
                <button 
                  onClick={handleContinue}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors text-center"
                >
                  Saya mengerti risikonya, tetap lanjut (Nekat)
                </button>
              </>
            )}

            {isSuspicious && (
              <Button onClick={handleContinue} variant="warning" fullWidth>
                Lanjut ke Tujuan
              </Button>
            )}

            {!isMalicious && (
              <Button onClick={onReset} variant="outline" fullWidth>
                Scan Lagi
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Warning Modal for Suspicious Links */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Ulang</h3>
            <p className="text-gray-600 mb-6">
              Link ini memiliki anomali dan belum tentu aman. Apakah Anda yakin ingin melanjutkan ke:
              <br />
              <span className="font-mono text-xs break-all text-blue-600 mt-2 block">{result.final_url}</span>
            </p>
            <div className="flex gap-4">
              <Button onClick={() => setShowWarningModal(false)} variant="outline" className="flex-1">
                Batal
              </Button>
              <Button onClick={confirmContinue} variant="warning" className="flex-1">
                Ya, Lanjut
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
