import React, { useState, useEffect } from 'react';
import { generatePuzzle } from './functions/generatePuzzle';
import { removeCells } from './functions/removeCells';
import { BaseButton } from './components/BaseButton';
import { checkInput } from './functions/checkInput';
import { solveBoard} from './functions/solvedBoard'; // Import new functions
import { getHint } from './functions/getHint';
export const Board: React.FC = () => {
	const { board: initialBoard, readonlyCells: initialReadonlyCells } = generatePuzzle();
	const [board, setBoard] = useState<number[][]>(initialBoard);
	const [readonlyCells, setReadonlyCells] = useState<boolean[][]>(initialReadonlyCells);
	const [errors, setErrors] = useState<boolean[][]>(Array(9).fill(Array(9).fill(false)));

	// useEffect(() => {
	// 	generateNewPuzzle('medium');
	// }, []);

	const handleChange = (row: number, col: number, value: string) => {
		if (readonlyCells[row][col]) return;

		if (/^[1-9]?$/.test(value)) {
			setBoard(prevBoard => {
				const newBoard = prevBoard.map((r, rowIndex) => 
					r.map((cell, colIndex) => 
						(rowIndex === row && colIndex === col ? parseInt(value) || 0 : cell)
					)
				);
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

	const solvePuzzle = () => {
		const solvedBoard = solveBoard(board);
		if (solvedBoard) {
			setBoard(solvedBoard);
		} else {
			alert('No solution found for the current board.');
		}
	};

	const revealHint = () => {
		const hint = getHint(board);
		if (hint) {
			const { row, col, value } = hint;
			setBoard(prevBoard => {
				const newBoard = prevBoard.map((r, rowIndex) =>
					r.map((cell, colIndex) =>
						rowIndex === row && colIndex === col ? value : cell
					)
				);
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
				<BaseButton title='Easy' color='bg-green-500' onClick={() => generateNewPuzzle('easy')} />
				<BaseButton title='Medium' color='bg-yellow-500' onClick={() => generateNewPuzzle('medium')} />
				<BaseButton title='Hard' color='bg-red-500' onClick={() => generateNewPuzzle('hard')} />
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

			<BaseButton title='Check Solution' color='bg-blue-500' onClick={checkSolution} />
			<BaseButton title='Solve' color='bg-blue-500' onClick={solvePuzzle} /> {/* Solve Button */}
			<BaseButton title='Hint' color='bg-red-500' onClick={revealHint} /> {/* Hint Button */}
		</div>
	);
};
