import React from 'react';
import Board from './Board';

const App: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-gray-600 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <Board />
      </div>
    </div>
  );
};

export default App;