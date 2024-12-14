import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface PredictionResultProps {
  prediction: {
    label: string;
    confidence: number;
  } | null;
  error?: string;
}

export function PredictionResult({ prediction, error }: PredictionResultProps) {
  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    );
  }

  if (!prediction) return null;

  const isHealthy = prediction.label.toLowerCase().includes('healthy');

  return (
    <div className={`p-6 rounded-lg ${isHealthy ? 'bg-green-50' : 'bg-yellow-50'}`}>
      <div className="flex items-center gap-3 mb-4">
        {isHealthy ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : (
          <AlertCircle className="w-6 h-6 text-yellow-500" />
        )}
        <h3 className="text-xl font-semibold">
          {prediction.label}
        </h3>
      </div>
      <div className="mt-2">
        <p className="text-gray-600">
          Confidence: {(prediction.confidence * 100).toFixed(2)}%
        </p>
      </div>
    </div>
  );
}