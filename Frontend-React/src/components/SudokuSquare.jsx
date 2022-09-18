import React, { useState, useEffect } from 'react';

export default function SudokuSquare(props) {
  const row = Math.floor(props.squareNumber / 9);
  const col = props.squareNumber % 9;
  const emptyBorder = '0px';
  const normalBorder = '1px solid black';
  const thickBorder = '3px solid black';
  const style = {
    borderTop: row % 3 === 0 ? thickBorder : normalBorder,
    borderBottom: row === 8 ? thickBorder : emptyBorder,
    borderLeft: col % 3 === 0 ? thickBorder : normalBorder,
    borderRight: col === 8 ? thickBorder : emptyBorder,
    width: '30px',
    height: '30px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: '18px',
    backgroundColor: props.select == props.squareNumber ? 'lightblue' : 'white',
    fontWeight: props.board[row][col] === 0 ? '400' : '600',
    //   props.selected === props.squareNumber ? 'lightblue' : 'white',
  };
  const [num, setNum] = useState(0);
  const [stateStyle, setStateStyle] = useState(style);
  useEffect(() => {
    console.log('useEffect SudokuSquare num', props.solved);
    if (props.solved) {
      setNum(
        props.solvedBoard[Math.floor(props.squareNumber / 9)][
          props.squareNumber % 9
        ]
      );
      var temp = { ...style };

      temp['fontWeight'] = props.board[row][col] === 0 ? '400' : '600';
      setStateStyle(temp);
    } else {
      setNum(
        props.board[Math.floor(props.squareNumber / 9)][props.squareNumber % 9]
      );
      var temp = { ...style };

      temp['fontWeight'] = props.board[row][col] === 0 ? '400' : '600';
      setStateStyle(temp);
    }
  }, [props.board, props.solvedBoard, props.solved]);
  //}, [props.board, props.solvedBoard, props.solved]);

  useEffect(() => {
    var temp = { ...style };
    temp['backgroundColor'] =
      props.select === props.squareNumber ? 'lightblue' : 'white';
    setStateStyle(temp);
  }, [props.select]);

  useEffect(() => {
    console.log('exclusive', props.solved);
  }, [props.solved]);

  return (
    <div
      style={stateStyle}
      onClick={() => {
        console.log('clicked box', props.select);
        const temp = props.squareNumber;
        props.setSelect(temp);
        var temp2 = [...props.board];
        props.setBoard(temp2);
      }}
    >
      {num === 0 ? '' : num}
    </div>
  );
}
