import React, { useState ,useEffect} from 'react';
import { GeneratePuzzle } from './Components/GeneratePuzzle';
import { RemoveCells } from './Components/RemoveCells';
import { MyButton } from './Components/MyButton';

export const Board: React.FC = () => {
  // Get both the board and readonlyCells from GeneratePuzzle
  const { board: initialBoard, readonlyCells: initialReadonlyCells } = GeneratePuzzle();
  
  // Use states for board and readonly cells
  const [board, setBoard] = useState<number[][]>(initialBoard);
  const [readonlyCells, setReadonlyCells] = useState<boolean[][]>(initialReadonlyCells); 
  const [errors, setErrors] = useState<boolean[][]>(Array(9).fill(Array(9).fill(false)));
  useEffect(() => {
    generateNewPuzzle('medium');
  }, []);

  // Helper function to check if a value is valid in the Sudoku board
  const isValid = (board: number[][], row: number, col: number): boolean => {
    const value = board[row][col];

    // Check the row
    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c] === value) {
        return false;
      }
    }

    // Check the column
    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col] === value) {
        return false;
      }
    }

    // Check the 3x3 subgrid
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

  // Handle input change for editable cells only
  const handleChange = (row: number, col: number, value: string) => {
    // If the cell is read-only, prevent changes
    if (readonlyCells[row][col]) return;

    // Validate input (only allow numbers 1-9)
    if (/^[1-9]?$/.test(value)) {
      const newBoard = board.map((r, rowIndex) =>
        r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? parseInt(value) || 0 : cell))
      );
      setBoard(newBoard);
    }
  };

  const checkSolution = () => {
    let newErrors = Array.from({ length: 9 }, () => Array(9).fill(false));
    let isValidSolution = true;
  
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== 0) {
          // Check if the current value is valid
          if (!isValid(board, r, c)) {
            newErrors[r][c] = true; // Mark as an error
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

  
  const generateNewPuzzle = (difficulty: 'easy' | 'medium' | 'hard') => {
    // Generate a solved board first
    const { board: newGeneratedBoard, readonlyCells: newReadonlyCells } = GeneratePuzzle();
    
    // Now remove cells based on difficulty
    const { board: puzzleWithRemovedCells, readonlyCells: updatedReadonlyCells } = RemoveCells(newGeneratedBoard, difficulty);
    
    // Update the state with the new puzzle and readonly cells
    setBoard(puzzleWithRemovedCells); // Update board with the new puzzle
    setReadonlyCells(updatedReadonlyCells); // Update readonlyCells with the new puzzle's readonly cells
    setErrors(Array(9).fill(Array(9).fill(false))); // Clear errors
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-8 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <MyButton label="Easy" color="bg-green-500" onClick={() => generateNewPuzzle('easy')} />
        <MyButton label="Medium" color="bg-yellow-500" onClick={() => generateNewPuzzle('medium')} />
        <MyButton label="Hard" color="bg-red-500" onClick={() => generateNewPuzzle('hard')} />
      </div>

      <div className="grid grid-cols-9 gap-1">
  {board.map((row, rowIndex) =>
    row.map((cell, colIndex) => (
      <input
        key={`${rowIndex}-${colIndex}`}
        type="text"
        maxLength={1}
        value={cell === 0 ? '' : cell}
        onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
        readOnly={readonlyCells[rowIndex][colIndex]} // This ensures that cells that should be read-only can't be edited
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

      <MyButton label="Check Solution" color="bg-blue-500" onClick={checkSolution} />
    </div>
  );
};
