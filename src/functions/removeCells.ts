export const removeCells = (board: number[][], difficulty: 'easy' | 'medium' | 'hard'): { board: number[][]; readonlyCells: boolean[][] } => {
	const difficultyLevels: { [key in 'easy' | 'medium' | 'hard']: number } = {
		easy: 40,
		medium: 35,
		hard: 30,
	};

	const cellsToRemove = difficultyLevels[difficulty];
	const newBoard = board.map(row => [...row]);
	const readonlyCells = Array.from({ length: 9 }, () => Array(9).fill(true));

	let count = 0;
	while (count < cellsToRemove) {
		const row = Math.floor(Math.random() * 9);
		const col = Math.floor(Math.random() * 9);

		if (newBoard[row][col] !== 0) {
			newBoard[row][col] = 0;
			readonlyCells[row][col] = false;
			count++;
		}
	}

	return { board: newBoard, readonlyCells };
};
