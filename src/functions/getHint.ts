import { isValid } from './isValid';

type BoardType = {
	row: number;
	col: number;
	value: number;
};

export const getHint = (board: number[][]): BoardType | null => {
	const boardCopy = board.map(row => [...row]);
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (board[row][col] === 0) {
				for (let num = 1; num <= 9; num++) {
					if (isValid({ board: boardCopy, row, col, num })) {
						return { row, col, value: num };
					}
				}
			}
		}
	}
	return null;
};
