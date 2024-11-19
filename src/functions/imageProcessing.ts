export const preprocessImage = (file: File, setPreprocessedPreview: React.Dispatch<React.SetStateAction<string | null>>): Promise<File> => {
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

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      preprocessCanvas(ctx, canvas);

      setPreprocessedPreview(canvas.toDataURL());  

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

export const preprocessCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const gray = (r + g + b) / 3;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
  }

  const contrastFactor = 1.5;
  for (let i = 0; i < pixels.length; i += 4) {
    let gray = pixels[i];
    gray = (gray - 128) * contrastFactor + 128;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = Math.min(Math.max(gray, 0), 255);
  }

  const threshold = 128;
  for (let i = 0; i < pixels.length; i += 4) {
    const gray = pixels[i];
    const binary = gray > threshold ? 255 : 0;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = binary;
  }

  ctx.putImageData(imageData, 0, 0);
};

export const isValidSudokuGrid = (grid: number[][]): boolean => {
  return (
    grid.length === 9 &&
    grid.every((row) => row.length === 9 && row.every((cell) => cell >= 0 && cell <= 9))
  );
};
