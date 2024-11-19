import { solveBoard } from './solvedBoard';

export const solvePuzzle = (board: number[][], setBoard: any) => {
	const solvedBoard = solveBoard(board);
	if (solvedBoard) {
		setBoard(solvedBoard);
	} else {
		alert('No solution found for the current board.');
	}
};

