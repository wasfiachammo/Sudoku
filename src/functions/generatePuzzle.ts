import { isValid } from './isValid';
type generatePuzzleProps = {
	board: number[][];
	readonlyCells: boolean[][];
};

export const generatePuzzle = (): generatePuzzleProps => {
	const board = Array.from({ length: 9 }, () => Array(9).fill(0));
	const readonlyCells = Array.from({ length: 9 }, () => Array(9).fill(false));

	const solve = (board: number[][]): boolean => {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (board[row][col] === 0) {
					for (let num = 1; num <= 9; num++) {
						if (isValid({ board, row, col, num })) {
							board[row][col] = num;
							if (solve(board)) return true;
							board[row][col] = 0;
						}
					}
					return false;
				}
			}
		}
		return true;
	};

	solve(board);
	return { board, readonlyCells };
};
