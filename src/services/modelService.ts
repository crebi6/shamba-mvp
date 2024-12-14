import * as tf from '@tensorflow/tfjs';

let model: tf.LayersModel | null = null;

const CLASS_NAMES = [
  'Healthy',
  'Common Rust',
  'Gray Leaf Spot',
  'Northern Leaf Blight'
];

export async function loadModel() {
  try {
    // Note: Replace this URL with your actual model URL
    model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/plant_disease_model/model.json');
    return true;
  } catch (error) {
    console.error('Error loading model:', error);
    return false;
  }
}

export async function preprocessImage(imageData: ImageData | HTMLImageElement): Promise<tf.Tensor> {
  return tf.tidy(() => {
    let tensor = tf.browser.fromPixels(imageData)
      .resizeNearestNeighbor([224, 224]) // Resize to model input size
      .toFloat()
      .expandDims();
    
    // Normalize the image
    tensor = tensor.div(255.0);
    
    return tensor;
  });
}

export async function predict(image: ImageData | HTMLImageElement) {
  if (!model) {
    throw new Error('Model not loaded');
  }

  const tensor = await preprocessImage(image);
  const predictions = await model.predict(tensor) as tf.Tensor;
  const probabilities = await predictions.data();
  
  // Clean up tensors
  tensor.dispose();
  predictions.dispose();

  // Get the index with highest probability
  const maxProbability = Math.max(...Array.from(probabilities));
  const predictedClass = Array.from(probabilities).indexOf(maxProbability);

  return {
    label: CLASS_NAMES[predictedClass],
    confidence: maxProbability
  };
}