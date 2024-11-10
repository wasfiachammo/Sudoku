type isValidProps = {
	board: number[][];
	row: number;
	col: number;
	num: number;
};

export const isValid = ({ board, row, col, num }: isValidProps): boolean => {
	for (let i = 0; i < 9; i++) {
		if (board[row][i] === num || board[i][col] === num) return false;
	}
	const startRow = Math.floor(row / 3) * 3;
	const startCol = Math.floor(col / 3) * 3;
	for (let i = startRow; i < startRow + 3; i++) {
		for (let j = startCol; j < startCol + 3; j++) {
			if (board[i][j] === num) return false;
		}
	}
	return true;
};
