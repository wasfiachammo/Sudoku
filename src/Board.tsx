import React, { useState } from 'react';
import { generatePuzzle } from './functions/generatePuzzle';
import { removeCells } from './functions/removeCells';
import { BaseButton } from './components/BaseButton';
import { checkInput } from './functions/checkInput';
import { getHint } from './functions/getHint';
import { IconButton } from './components/IconButton';

import { MdCheckCircle } from 'react-icons/md';
import { BiBulb } from 'react-icons/bi';
import { RiRobot2Line } from 'react-icons/ri';
import ImageUploadButton from './components/UploadButton';
import { solvePuzzle } from './functions/solvePuzzle';
import ImageSolver from './components/ImageSolver';

export const Board: React.FC = () => {
	const { board: initialBoard, readonlyCells: initialReadonlyCells } = generatePuzzle();
	const [board, setBoard] = useState<number[][]>(initialBoard);
	const [readonlyCells, setReadonlyCells] = useState<boolean[][]>(initialReadonlyCells);
	const [errors, setErrors] = useState<boolean[][]>(Array(9).fill(Array(9).fill(false)));

	// useEffect(() => {
	// 	generateNewPuzzle('medium');
	// }, []);

	// const handleImageUpload = (file: File) => {
	// 	console.log('Uploaded file:', file);
	// 	// You can handle the uploaded file, e.g., upload it to a server
	// };
	const handleImageUpload = (recognizedBoard: number[][]) => {
		setBoard(recognizedBoard);
		setReadonlyCells(Array(9).fill(Array(9).fill(true)));
	  };

	  
	const handleChange = (row: number, col: number, value: string) => {
		if (readonlyCells[row][col]) return;

		if (/^[1-9]?$/.test(value)) {
			setBoard(prevBoard => {
				const newBoard = prevBoard.map((r, rowIndex) => r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? parseInt(value) || 0 : cell)));
				return newBoard;
			});
		}
	};

	const checkSolution = () => {
		const newErrors = Array.from({ length: 9 }, () => Array(9).fill(false));
		let isValidSolution = true;

		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				if (board[r][c] !== 0) {
					if (!checkInput({ board, row: r, col: c })) {
						newErrors[r][c] = true;
						isValidSolution = false;
					}
				}
			}
		}

		setErrors(newErrors);
		if (isValidSolution) {
			alert('Congratulations! The solution is correct.');
		} else {
			alert('There are errors in the solution. Please check the highlighted cells.');
		}
	};

	const revealHint = () => {
		const hint = getHint(board);
		if (hint) {
			const { row, col, value } = hint;
			setBoard(prevBoard => {
				const newBoard = prevBoard.map((r, rowIndex) => r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? value : cell)));
				return newBoard;
			});
		} else {
			alert('No hints available!');
		}
	};

	const generateNewPuzzle = (difficulty: 'easy' | 'medium' | 'hard') => {
		const { board: newGeneratedBoard, readonlyCells: newReadonlyCells } = generatePuzzle();
		const { board: puzzleWithRemovedCells, readonlyCells: updatedReadonlyCells } = removeCells(newGeneratedBoard, difficulty);

		setBoard(puzzleWithRemovedCells);
		setReadonlyCells(updatedReadonlyCells);
		setErrors(Array(9).fill(Array(9).fill(false)));
	};

	return (
		<div className='max-w-md mx-auto p-4 mt-8 bg-gray-100 rounded-lg shadow-lg'>
			<div className='flex justify-between items-center mb-4'>
				<BaseButton title='Easy' color='bg-blue-700 hover:bg-blue-500' onClick={() => generateNewPuzzle('easy')} />
				<BaseButton title='Medium' color='bg-teal-700 hover:bg-teal-600' onClick={() => generateNewPuzzle('medium')} />
				<BaseButton title='Hard' color='bg-red-600 hover:bg-red-500' onClick={() => generateNewPuzzle('hard')} />
			</div>
			<div className='grid grid-cols-9 gap-1'>
				{board?.map((row, rowIndex) =>
					row?.map((cell, colIndex) => (
						<input
							key={`${rowIndex}-${colIndex}`}
							type='text'
							maxLength={1}
							value={cell === 0 ? '' : cell}
							onChange={e => handleChange(rowIndex, colIndex, e.target.value)}
							readOnly={readonlyCells[rowIndex][colIndex]}
							className={`
								w-10 h-10 text-center font-bold 
								${readonlyCells[rowIndex][colIndex] ? 'bg-gray-200 text-gray-600' : 'bg-white text-gray-800'}
								border-2 
								${errors[rowIndex][colIndex] ? 'border-red-500 bg-red-100' : 'border-gray-300'}
								rounded focus:outline-none focus:border-blue-500
								${(rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'border-b-4' : 'border-b-2'}
								${(colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'border-r-4' : 'border-r-2'}
							`}
						/>
					))
				)}
			</div>
			<div className='flex justify-between items-center mt-4 space-x-4'>
				<IconButton icon={<MdCheckCircle />} reversed title='Check Solution' color='text-white bg-emerald-600 hover:bg-emerald-500' onClick={checkSolution} />
				<IconButton
					icon={<RiRobot2Line />}
					reversed
					title='Solve'
					color='text-white bg-sky-600 hover:bg-sky-500'
					onClick={() => {
						solvePuzzle(board, setBoard);
					}}
				/>
				<IconButton icon={<BiBulb />} reversed title='Hint' color='text-white bg-amber-600 hover:bg-amber-500' onClick={revealHint} />
			</div>

			<div className='max-w-md mx-auto p-4 mt-8'>
				{/* <ImageUploadButton onUpload={handleImageUpload} /> */}
				<ImageSolver onBoardDetected={handleImageUpload} />
			</div>
		</div>
	);
};
