import React, { useState, useEffect } from 'react';
import './Popup.scss';
import Sudoku from '../../components/Sudoku.jsx';
import Button from 'react-bootstrap/Button';
import '../../sudoku.js';
import Spinner from 'react-bootstrap/Spinner';

// import 'bootstrap/dist/css/bootstrap.min.css';

const clearBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];
function equal(array1, array2) {
  if (!Array.isArray(array1) && !Array.isArray(array2)) {
    return array1 === array2;
  }

  if (array1.length !== array2.length) {
    return false;
  }

  for (var i = 0, len = array1.length; i < len; i++) {
    if (!equal(array1[i], array2[i])) {
      return false;
    }
  }

  return true;
}

function stringToBoard(str) {
  let board = [];
  for (let i = 0; i < 9; i++) {
    board.push([]);
    for (let j = 0; j < 9; j++) {
      const t = str[i * 9 + j];
      if (t == '.') {
        board[i].push(0);
      } else {
        board[i].push(parseInt(t));
      }
    }
  }
  return board;
}

function boardToString(board) {
  let str = '';
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] == 0 || board[i][j] == '0') {
        str += '.';
      } else {
        str += board[i][j];
      }
    }
  }
  return str;
}

const Popup = () => {
  const [loading, setLoading] = useState(false);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    // [1, 2, 0, 4, 0, 6, 0, 8, 9],
    // [0, 5, 0, 7, 0, 9, 0, 0, 0],
    // [0, 0, 0, 0, 2, 3, 4, 0, 6],
    // [2, 0, 4, 5, 0, 7, 0, 9, 1],
    // [5, 0, 7, 0, 9, 1, 0, 0, 0],
    // [0, 9, 0, 0, 0, 0, 0, 6, 0],
    // [3, 0, 5, 0, 0, 8, 0, 1, 2],
    // [6, 0, 0, 9, 0, 0, 0, 0, 0],
    // [9, 0, 2, 0, 4, 0, 6, 0, 9],
  ]);
  const [solved, setSolved] = useState(false);
  const [solvedBoard, setSolvedBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    // [1, 2, 3, 4, 5, 6, 7, 8, 9],
    // [4, 5, 6, 7, 8, 9, 1, 2, 3],
    // [7, 8, 9, 1, 2, 3, 4, 5, 6],
    // [2, 3, 4, 5, 6, 7, 8, 9, 1],
    // [5, 6, 7, 8, 9, 1, 2, 3, 4],
    // [8, 9, 1, 2, 3, 4, 5, 6, 7],
    // [3, 4, 5, 6, 7, 8, 9, 1, 2],
    // [6, 7, 8, 9, 1, 2, 3, 4, 5],
    // [9, 1, 2, 3, 4, 5, 6, 7, 8],
  ]);
  var [select, setSelect] = useState(-1);
  // let capturing = chrome.tabs.captureVisibleTab().then((dataUrl) => {
  //   console.log(dataUrl, 'dataUrl');
  // });
  var [err, setErr] = useState('');

  useEffect(() => {
    chrome.storage.sync.get(['solved'], function (result) {
      if (result.solved) {
        const ts = result.solved;
        setSolved(ts);
      }
    });
    chrome.storage.sync.get(['board'], function (result) {
      var tb = result.board;
      if (tb) {
        var ansBoard = solve(tb, true);
        var ansBoard2 = solve(tb, false);
        if (ansBoard === false) {
          setErr('No solution found');
          setSolvedBoard([...clearBoard]);
        } else if (ansBoard !== ansBoard2) {
          console.log('neq');
          console.log(ansBoard);
          console.log(ansBoard2);
          setErr('Multiple solutions found');
          setSolvedBoard([...clearBoard]);
        } else {
          setErr('Board is valid!');
          setSolvedBoard(stringToBoard(ansBoard));
        }
        setBoard(stringToBoard(result.board));
      }
    });
  }, []);
  return (
    <div
      tabIndex={0}
      onKeyUp={(e) => {
        if (select != -1) {
          if (!isNaN(parseInt(e.key)) && !solved) {
            let tempBoard = [...board];
            let solvedTempBoard = [...solvedBoard];
            tempBoard[Math.floor(select / 9)][select % 9] = parseInt(e.key);
            solvedTempBoard[Math.floor(select / 9)][select % 9] = parseInt(
              e.key
            );

            // if (select < 80) {
            //   const tempSelect = select + 1;
            //   setSelect(tempSelect);
            // }
            setBoard(tempBoard);
            chrome.storage.sync.set(
              { board: boardToString(tempBoard) },
              function () {}
            );
            // const ans = solve(boardToString(tempBoard));
            // setSolvedBoard(stringToBoard(ans));
            var ansBoard = solve(boardToString(tempBoard), true);
            var ansBoard2 = solve(boardToString(tempBoard), false);
            if (ansBoard === false) {
              setErr('No solution found');
              setSolvedBoard([...clearBoard]);
            } else if (ansBoard !== ansBoard2) {
              console.log('neq');
              console.log(ansBoard);
              console.log(ansBoard2);
              setErr('Multiple solutions found');
              setSolvedBoard([...clearBoard]);
            } else {
              setErr('Board is valid!');
              setSolvedBoard(stringToBoard(ansBoard));
            }
          }
          if (e.key === ' ') {
            setSelect(select + 1);
            setBoard([...board]);
          }
        }
      }}
      onKeyDown={(e) => {
        if (e.key == 'ArrowUp') {
          if (select > 8) {
            const tempSelect = select - 9;
            setSelect(tempSelect);
            setBoard([...board]);
          }
        } else if (e.key == 'ArrowDown') {
          if (select < 72) {
            const tempSelect = select + 9;
            setSelect(tempSelect);
            setBoard([...board]);
          }
        }
        if (e.key == 'ArrowLeft') {
          if (select % 9 != 0) {
            const tempSelect = select - 1;
            setSelect(tempSelect);
            setBoard([...board]);
          }
        }
        if (e.key == 'ArrowRight') {
          if (select % 9 != 8) {
            const tempSelect = select + 1;
            setSelect(tempSelect);
            setBoard([...board]);
          }
        }
      }}
      style={{
        backgroundColor: '#FFFFF0',
        height: '450px',
        width: '360px',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          //center horizontally
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          paddingTop: '10px',
          fontSize: '32px',
        }}
      >
        Sudoku Scanner
      </div>
      <div
        style={{
          paddingTop: '10px',
        }}
      >
        {loading ? (
          <div
            style={{
              width: '100%',
              height: '270px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner
              animation="border"
              variant="danger"
              style={{
                width: '100px',
                height: '100px',
              }}
            />
          </div>
        ) : (
          <Sudoku
            select={select}
            setSelect={setSelect}
            board={board}
            setBoard={setBoard}
            solved={solved}
            setSolved={setSolved}
            solvedBoard={solvedBoard}
            setSolvedBoard={setSolvedBoard}
          />
        )}
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '10px',
          fontWeight: 'bold',
          color: err === 'Board is valid!' ? 'green' : 'red',
          fontSize: '20px',
        }}
      >
        {err}
      </div>
      <div
        style={{
          //center horizontally
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          paddingTop: '15px',
        }}
      >
        <div
          style={{
            paddingRight: '20px',
          }}
        >
          <Button
            variant="primary"
            onClick={() => {
              const value = Math.floor(Math.random() * 1000);
              chrome.storage.sync.set({ key: value }, function () {});
              setSolved(false);
              chrome.storage.sync.set({ solved: false }, function () {});
              setLoading(true);
              // new Promise((r) => setTimeout(r, 1000)).then(() => {
              //   var newBoard = generate(65);
              //   var ansBoard = solve(newBoard, true);
              //   var ansBoard2 = solve(newBoard, false);
              //   if (ansBoard === false) {
              //     setErr('No solution found');
              //     setSolvedBoard([...clearBoard]);
              //   } else if (ansBoard !== ansBoard2) {
              //     console.log('neq');
              //     console.log(ansBoard);
              //     console.log(ansBoard2);
              //     setErr('Multiple solutions found');
              //     setSolvedBoard([...clearBoard]);
              //   } else {
              //     setErr('Board is valid!');
              //     setSolvedBoard(stringToBoard(ansBoard));
              //   }
              //   setBoard(stringToBoard(newBoard));
              //   chrome.storage.sync.set({ board: newBoard }, function () {});
              //   setLoading(false);
              // });
              try {
                chrome.tabs.captureVisibleTab().then((dataUrl) => {
                  console.log(dataUrl, 'dataUrl');
                  // const url = 'http://localhost:81/api';
                  const url =
                    'http://ec2-54-213-214-188.us-west-2.compute.amazonaws.com.:2048/api';
                  fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dataUrl: dataUrl }),
                  })
                    .then((response) => {
                      if (!response.ok) {
                        console.log('in exception');
                        window.alert(
                          'Board not found\n' +
                            'Advanced Error: ' +
                            response.status +
                            ' ' +
                            response.statusText
                        );
                        setLoading(false);
                        throw new Error('Board not found');
                      }
                      return response.json();
                    })
                    .then((data) => {
                      console.log('api', data);
                      var newBoard = boardToString(data['board']);
                      var ansBoard = solve(newBoard, true);
                      var ansBoard2 = solve(newBoard, false);
                      if (ansBoard === false) {
                        setErr('No solution found');
                        setSolvedBoard([...clearBoard]);
                      } else if (ansBoard !== ansBoard2) {
                        console.log('neq');
                        console.log(ansBoard);
                        console.log(ansBoard2);
                        setErr('Multiple solutions found');
                        setSolvedBoard([...clearBoard]);
                      } else {
                        setErr('Board is valid!');
                        setSolvedBoard(stringToBoard(ansBoard));
                      }
                      setBoard(stringToBoard(newBoard));
                      chrome.storage.sync.set(
                        { board: newBoard },
                        function () {}
                      );
                      setLoading(false);
                    });
                });
              } catch (e) {
                console.log('in exception');
                alert('Board not found\nAdvanced details:' + e);
              }
            }}
            style={{
              width: '70px',
            }}
          >
            Scan
          </Button>
        </div>
        <div
          style={{
            paddingLeft: '20px',
          }}
        >
          <Button
            variant="dark"
            onClick={() => {
              const temp = !solved;
              setSolved(temp);
              chrome.storage.sync.set({ solved: temp }, function () {});
              setBoard([...board]);
              chrome.storage.sync.get(['key'], function (result) {});
            }}
            style={{
              width: '70px',
            }}
            disabled={err !== 'Board is valid!'}
          >
            {solved ? 'Hide' : 'Show'}
          </Button>
        </div>
        {/* <div
          style={{
            paddingLeft: '20px',
          }}
        >
          <Button
            onClick={() => {
              var popupWindow = window.open(
                chrome.runtime.getURL('popup.html'),
                'exampleName',
                'width=400,height=400'
              );
              window.close(); // close the Chrome extension pop-up
            }}
          >
            TEST
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default Popup;
