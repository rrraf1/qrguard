'use client';

import { useState } from 'react';
import { QRScanner } from '@/components/QRScanner/QRScanner';
import { AnalysisResult } from '@/components/AnalysisResult/AnalysisResult';
import { analyzeQR, AnalysisResponse } from '@/lib/api';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeQR(file);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Gagal menganalisis QR code. Pastikan gambar jelas dan merupakan QR code valid.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
          QR Guard
        </h1>
        <p className="text-lg text-gray-600">
          Lapisan pelindung antara Anda dan QR Code yang tidak dikenal.
        </p>
      </div>

      <div className="space-y-8">
        {!result ? (
          <>
            <QRScanner onScan={handleScan} isLoading={loading} />
            
            {loading && (
              <div className="text-center animate-pulse">
                <p className="text-blue-600 font-medium">Menganalisis link di sandbox...</p>
              </div>
            )}

            {error && (
              <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </>
        ) : (
          <AnalysisResult result={result} onReset={handleReset} />
        )}
      </div>

      <footer className="mt-20 text-center text-gray-400 text-sm">
        &copy; 2026 QR Guard - Lab ICT Project
      </footer>
    </main>
  );
}
