import React, { useState, useEffect } from 'react';
import SudokuRow from './SudokuRow.jsx';

export default function Sudoku(props) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let tempRows = [];
    for (let i = 0; i < 9; i++) {
      tempRows.push(
        <SudokuRow
          rowNumber={i}
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
    setRows(tempRows);
  }, [props.board]);
  return (
    <div
      style={{
        //align column
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {rows}
    </div>
  );
}
