import React, { useState, useEffect } from 'react';
import SudokuSquare from './SudokuSquare.jsx';

export default function SudokuRow(props) {
  const [squares, setSquares] = useState([]);

  useEffect(() => {
    let tempSquares = [];
    for (let i = 0; i < 9; i++) {
      tempSquares.push(
        <SudokuSquare
          squareNumber={props.rowNumber * 9 + i}
          select={props.select}
          setSelect={props.setSelect}
          board={props.board}
          setBoard={props.setBoard}
          solved={props.solved}
          setSolved={props.setSolved}
          solvedBoard={props.solvedBoard}
          setSolvedBoard={props.setSolvedBoard}
          key={i}
        />
      );
    }
    setSquares(tempSquares);
  }, [props.board]);

  return (
    <div
      style={{
        // align row
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      {squares}
    </div>
  );
}
