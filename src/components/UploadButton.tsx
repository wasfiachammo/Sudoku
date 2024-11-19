import React from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';

interface UploadButtonProps {
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  accept?: string;
  className?: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  id,
  onChange,
  label = 'Upload File',
  accept = '*',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <label htmlFor={id} className="flex items-center space-x-2 text-cyan-700 cursor-pointer">
        <AiOutlineCloudUpload size={26} />
        <span className="text-lg">{label}</span>
      </label>
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
};

export default UploadButton;
