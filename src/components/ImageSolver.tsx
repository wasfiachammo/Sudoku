import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { AiOutlineCloudUpload } from 'react-icons/ai';

interface ImageSolverProps {
  onBoardDetected: (board: number[][]) => void;
}

const ImageSolver: React.FC<ImageSolverProps> = ({ onBoardDetected }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const preprocessImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = () => {
        img.src = reader.result as string;
      };
      
      reader.onerror = () => reject('Error reading image file');
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Failed to get canvas context');
        
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Apply preprocessing
        preprocessCanvas(ctx, canvas);

        // Convert the canvas to a Blob and resolve the promise
        canvas.toBlob((blob) => {
          if (blob) {
            const preprocessedFile = new File([blob], file.name, { type: 'image/png' });
            resolve(preprocessedFile);
          } else {
            reject('Error converting canvas to Blob');
          }
        }, 'image/png');
      };

      reader.readAsDataURL(file);
    });
  };

  const preprocessCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Convert image to grayscale
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
  
    // Apply grayscale conversion: average R, G, B values
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const gray = Math.round((r + g + b) / 3);
  
      pixels[i] = pixels[i + 1] = pixels[i + 2] = gray; // Set RGB to gray value
    }
  
    // Adjust contrast if necessary
    const contrastFactor = 1.2; // Example contrast factor (tweak this as needed)
    for (let i = 0; i < pixels.length; i += 4) {
      let val = pixels[i]; // Using grayscale, so R, G, and B are the same
      val = (val - 128) * contrastFactor + 128;
      pixels[i] = pixels[i + 1] = pixels[i + 2] = Math.min(Math.max(val, 0), 255); // Ensure within range
    }
  
    ctx.putImageData(imageData, 0, 0);
  
    // Apply binarization (thresholding) to get a black and white image
    const threshold = 128;
    const binarizedData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const binPixels = binarizedData.data;
  
    for (let i = 0; i < binPixels.length; i += 4) {
      const grayValue = binPixels[i]; // We can use any of the R, G, or B values since they're all equal in grayscale
      const newColor = grayValue > threshold ? 255 : 0;
      binPixels[i] = binPixels[i + 1] = binPixels[i + 2] = newColor; // Set all RGB channels to black or white
    }
  
    ctx.putImageData(binarizedData, 0, 0);
  };
  

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setLoading(true);
    setError('');

    try {
      const preprocessedFile = await preprocessImage(file);

      // Use Tesseract.js to recognize text from the preprocessed image
      const result = await Tesseract.recognize(preprocessedFile, 'eng', {
        logger: (m) => console.log(m), // Logs OCR progress
        oem: 1,  // Use LSTM-only engine
        ...( { psm: 6 } as any)  // Use type assertion to bypass TypeScript error
      });
      const text = result.data.text.replace(/[^1-9]/g, '0').padEnd(81, '0');
      console.log('Recognized text:', text);

      if (text.length !== 81) {
        throw new Error('Image quality is too low, or the Sudoku grid is incomplete.');
      }

      const board = Array.from({ length: 9 }, (_, i) =>
        text.slice(i * 9, (i + 1) * 9).split('').map(num => parseInt(num, 10))
      );

      console.log('Extracted board:', board);

      // Send the detected board back to the parent component
      onBoardDetected(board);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process the image. Please try again with a clearer image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 border-dotted border-gray-400 rounded-md bg-gray-100 transition duration-200 cursor-pointer">
      <label htmlFor="image-upload" className="flex items-center space-x-2 text-cyan-700">
        <AiOutlineCloudUpload size={26} />
        <span className="text-lg">Upload Sudoku Image</span>
      </label>
      <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

      {loading && <p>Processing image...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {imagePreview && (
        <div className="mt-4">
          <img src={imagePreview} alt="Image preview" className="w-42 h-32 object-cover rounded-md border-2 border-gray-200" />
        </div>
      )}
    </div>
  );
};

export default ImageSolver;
