import React from 'react';
import { Board } from './Board';

const App: React.FC = () => {
	return (
		<div className='w-screen h-screen bg-gray-600 flex flex-col items-center justify-center'>
			<h1 className='text-3xl font-bold text-white mb-6'>Sudoku Game</h1>

			<div className='bg-white p-4 rounded-lg shadow-md'>
				<Board key={1} />
			</div>
		</div>
	);
};

export default App;
