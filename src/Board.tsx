import React, { useState } from 'react';

const Board: React.FC = () => {
  const [board, setBoard] = useState(Array(9).fill(Array(9).fill('')));
  const [errors, setErrors] = useState<boolean[][]>(Array(9).fill(Array(9).fill(false))); // Error tracking

  // Helper function to check if a row is valid (no duplicates)
  const isRowValid = (row: number) => {
    const rowValues = board[row].filter((value: string)=> value !== '');
    return new Set(rowValues).size === rowValues.length;
  };

  // Helper function to check if a column is valid (no duplicates)
  const isColumnValid = (col: number) => {
    const colValues = board.map(row => row[col]).filter(value => value !== '');
    return new Set(colValues).size === colValues.length;
  };

  // Helper function to check if a 3x3 subgrid is valid (no duplicates)
  const isSubgridValid = (row: number, col: number) => {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    const subgridValues: string[] = [];
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (board[r][c] !== '') {
          subgridValues.push(board[r][c]);
        }
      }
    }
    return new Set(subgridValues).size === subgridValues.length;
  };

  // Check if the entire board is valid
  const validateBoard = () => {
    let newErrors = Array(9).fill(Array(9).fill(false));

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const isValid = isRowValid(r) && isColumnValid(c) && isSubgridValid(r, c);
        if (!isValid) {
          newErrors[r][c] = true;
        }
      }
    }
    setErrors(newErrors);
  };

  // Handle input change with explicit typing for value
  const handleChange = (row: number, col: number, value: string) => {
    if (/^[1-9]?$/.test(value)) { // Allow only numbers 1-9 or an empty string
      const newBoard = board.map((r, rowIndex) => 
        r.map((cell:number, colIndex:number) => 
          rowIndex === row && colIndex === col ? value : cell
        )
      );
      setBoard(newBoard);
    }
  };

  // Check Solution button click handler
  const checkSolution = () => {
    validateBoard();
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-8 bg-gray-100 rounded-lg shadow-lg">
      <div className="grid grid-cols-9 gap-1">
        {board.map((row, rowIndex) => 
          row.map((cell:number, colIndex:number) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              maxLength={1}
              value={cell}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              className={`
                w-10 h-10 text-center text-gray-700 font-bold border-2 
                ${((rowIndex + 1) % 3 === 0 && rowIndex !== 8) ? 'border-b-4' : 'border-b-2'}
                ${((colIndex + 1) % 3 === 0 && colIndex !== 8) ? 'border-r-4' : 'border-r-2'}
                border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white
                ${errors[rowIndex][colIndex] ? 'border-red-500 bg-red-100' : ''}
              `}
            />
          ))
        )}
      </div>
      <button
        onClick={checkSolution}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none hover:bg-blue-600"
      >
        Check Solution
      </button>
    </div>
  );
};

export default Board;
