import React, { useState, useEffect } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { CameraCapture } from './components/CameraCapture';
import { PredictionResult } from './components/PredictionResult';
import { Leaf, Camera } from 'lucide-react';
import { loadModel, predict } from './services/modelService';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<{ label: string; confidence: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadModel().catch(() => {
      setError('Failed to load the disease detection model');
    });
  }, []);

  const handleImageSelect = async (file: File) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      const img = new Image();
      img.src = imageUrl;
      await img.decode();

      const result = await predict(img);
      setPrediction(result);
    } catch (err) {
      setError('Failed to process the image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCapture = async (imageSrc: string) => {
    try {
      setError(null);
      setIsLoading(true);
      setSelectedImage(imageSrc);

      const img = new Image();
      img.src = imageSrc;
      await img.decode();

      const result = await predict(img);
      setPrediction(result);
    } catch (err) {
      setError('Failed to process the captured image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crop Disease Detection
          </h1>
          <p className="text-gray-600">
            Upload or capture an image of a crop leaf to detect diseases
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2
                ${activeTab === 'upload' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Leaf className="w-5 h-5" />
              Upload Image
            </button>
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2
                ${activeTab === 'camera' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Camera className="w-5 h-5" />
              Use Camera
            </button>
          </div>

          <div className="mb-6">
            {activeTab === 'upload' ? (
              <ImageUpload onImageSelect={handleImageSelect} />
            ) : (
              <CameraCapture onCapture={handleCapture} />
            )}
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Analyzing image...</p>
            </div>
          )}

          {selectedImage && !isLoading && (
            <div className="mb-6">
              <img
                src={selectedImage}
                alt="Selected crop"
                className="max-w-full rounded-lg mx-auto"
              />
            </div>
          )}

          {(prediction || error) && !isLoading && (
            <PredictionResult prediction={prediction} error={error || undefined} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;