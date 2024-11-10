// import { checkInput } from "./checkInput";

// export const checkSolution = (
// 	board: number[][],
// 	setErrors: React.Dispatch<React.SetStateAction<boolean[][]>>,
//   ): void => {
// 	const newErrors = Array.from({ length: 9 }, () => Array(9).fill(false));
// 	let isValidSolution = true;
  
// 	for (let r = 0; r < 9; r++) {
// 	  for (let c = 0; c < 9; c++) {
// 		if (board[r][c] !== 0) {
// 		  // Check if the current value is valid
// 		  if (!checkInput(board, r, c)) {
// 			newErrors[r][c] = true; // Mark as an error
// 			isValidSolution = false;
// 		  }
// 		}
// 	  }
// 	}
  
// 	setErrors(newErrors);
// 	if (isValidSolution) {
// 	  alert('Congratulations! The solution is correct.');
// 	} else {
// 	  alert('There are errors in the solution. Please check the highlighted cells.');
// 	}
//   };
