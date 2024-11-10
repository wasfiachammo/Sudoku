type IsValidFunction = {
	board: number[][];
	row: number;
	col: number;
};
export const checkInput = ({ board, row, col }: IsValidFunction) => {
	const value = board[row][col];
	for (let c = 0; c < 9; c++) {
		if (c !== col && board[row][c] === value) {
			return false;
		}
	}
	for (let r = 0; r < 9; r++) {
		if (r !== row && board[r][col] === value) {
			return false;
		}
	}
	const startRow = Math.floor(row / 3) * 3;
	const startCol = Math.floor(col / 3) * 3;
	for (let r = startRow; r < startRow + 3; r++) {
		for (let c = startCol; c < startCol + 3; c++) {
			if ((r !== row || c !== col) && board[r][c] === value) {
				return false;
			}
		}
	}
	return true;
};
