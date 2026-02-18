const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface AnalysisResponse {
  status: 'safe' | 'malicious' | 'suspicious';
  original_url: string;
  final_url: string;
  findings: string[];
  risk_score: number;
}

export async function analyzeQR(file: File): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/api/analyze-qr`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to analyze QR code');
  }

  return response.json();
}
