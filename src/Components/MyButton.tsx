import React from 'react';

interface MyButtonProps {
  label: string;
  color: string;
  onClick: () => void;
}

export const MyButton: React.FC<MyButtonProps> = ({ label, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 my-1 ${color} text-white rounded-lg focus:outline-none hover:opacity-90 transition-opacity duration-200`}
    >
      {label}
    </button>
  );
};


