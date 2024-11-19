import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import UploadButton from './UploadButton';
import { preprocessImage, isValidSudokuGrid } from '../functions/imageProcessing'; 

interface ImageSolverProps {
  onBoardDetected: (board: number[][]) => void;
}

const ImageSolver: React.FC<ImageSolverProps> = ({ onBoardDetected }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [preprocessedPreview, setPreprocessedPreview] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setError('');
    setLoading(true);

    try {
      const preprocessedFile = await preprocessImage(file, setPreprocessedPreview);

      const result = await Tesseract.recognize(preprocessedFile, 'eng', {
        logger: (m) => console.log(m), 
        oem: 1,  
        ...( { psm: 6 } as any) 
      });

      const text = result.data.text.replace(/[^1-9]/g, '0').padEnd(81, '0');
      console.log('Recognized text:', text);

      if (text.length !== 81) {
        throw new Error('Image quality is too low, or the Sudoku grid is incomplete.');
      }

      const board = Array.from({ length: 9 }, (_, i) =>
        text.slice(i * 9, (i + 1) * 9).split('').map((num) => parseInt(num, 10))
      );

      console.log('Extracted board:', board);

      if (!isValidSudokuGrid(board)) {
        throw new Error('The detected grid is not valid.');
      }

      onBoardDetected(board);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 border-2 border-dotted border-gray-400 rounded-md bg-gray-50">
      <UploadButton
        id="image-upload"
        onChange={handleImageUpload}
        label="Upload Sudoku Image"
        accept="image/*"
        className="mb-0"
      />

      {loading && <p className="text-blue-600">Processing image...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {imagePreview && (
        <div>
          <p>Uploaded Image:</p>
          <img
            src={imagePreview}
            alt="Uploaded"
            className="w-42 h-32 object-cover rounded-md border-2 border-gray-200"
          />
        </div>
      )}
      {/* test*/}
      {/* {preprocessedPreview && (
        <div>
          <p className="text-cyan-700">Preprocessed Image:</p>
          <img
            src={preprocessedPreview}
            alt="Preprocessed"
            className="w-42 h-32 object-cover rounded-md border-2 border-gray-200"
          />
        </div>
      )} */}
    </div>
  );
};

export default ImageSolver;
