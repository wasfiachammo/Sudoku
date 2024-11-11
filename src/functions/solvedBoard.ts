import { isValid } from './isValid';

export const solveBoard = (board: number[][]): number[][] | null => {
	const boardCopy = board.map(row => [...row]);

	const solve = (row = 0, col = 0): boolean => {
		if (row === 9) return true;
		if (col === 9) return solve(row + 1, 0);
		if (boardCopy[row][col] !== 0) return solve(row, col + 1);

		for (let num = 1; num <= 9; num++) {
			if (isValid({ board: boardCopy, row, col, num })) {
				boardCopy[row][col] = num;
				if (solve(row, col + 1)) return true;
				boardCopy[row][col] = 0;
			}
		}
		return false;
	};

	return solve() ? boardCopy : null;
};


