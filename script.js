const gameBoard = (function () {
  //Defining the size of the game area
  const _gridSize = 3; // 3 x 3

  let gameBoard = Array(_gridSize)
    .fill()
    .map(() => Array(_gridSize).fill("")); //Create 2D Array

  //Gameboard interaction
  const getGameBoard = () => gameBoard; // no need

  const setGameBoard = function (row, column, symbol) {
    if (
      !(gameBoard[row][column] === undefined) &&
      gameBoard[row][column] === ""
    ) {
      // look if it's truthy

      gameBoard[row][column] = symbol;

      console.log("Sütun atandıktan sonra", getGameBoard());
      return true;
    }

    console.log("Çalışmadı");
    return false;
  };

  const resetGameBoard = () => gameBoard.forEach((arr, index) => {
    console.log(arr);
    gameBoard[index] = arr.map(item => item = "");
  })
  console.log("Reset func", resetGameBoard());

  return {
    getGameBoard,
    setGameBoard,
    resetGameBoard
  };
})();

const createPlayer = function (name, symbol) {
  let _score = 0; //Create private score variable for each player object
  const getScore = () => _score;
  const giveScore = () => _score++;

  return { name, symbol, getScore, giveScore };
};

const gameController = (function () {
  const board = gameBoard.getGameBoard();
  const x_Player = createPlayer("Furkan", "X");
  const o_Player = createPlayer("Buse", "O");

  let activePlayer = x_Player;

  const checkWinner = function (numberOfMoves) {
    const isSame = function (array, controlValue) {
      const _isSame = (currentValue) =>
        !(currentValue === "") && currentValue === controlValue;
      return array.every(_isSame);
    };

    // check horizontal equality
    for (let row = 0; row < board.length; row++) {
      const firstCell = board[row][0];

      if (isSame(board[row], firstCell)) {
        console.log("Yatayda üçü eşit, kazandınız");
        return true;
      }
    }

    // check vertical equality
    for (let column = 0; column < board.length; column++) {
      let verticalArray = [];
      const firstCell = board[0][column];

      for (let row = 0; row < board.length; row++) {
        verticalArray.push(board[row][column]);
      }

      if (isSame(verticalArray, firstCell)) {
        console.log("Dikeyde üçü eşit, kazandınız");
        return true;
      }
    }

    // check diagonal equality
    let firstDiagonalArray = [];
    let secondDiagonalArray = [];
    for (let i = 0; i < board.length; i++) {
      // check this tomorrow if it works or not
      const reverseIndex = board.length - 1 - i;

      let cell = board[i][i];
      firstDiagonalArray.push(cell);

      cell = board[reverseIndex][i];
      secondDiagonalArray.push(cell);
    }
    if (
      isSame(firstDiagonalArray, firstDiagonalArray[0]) ||
      isSame(secondDiagonalArray, secondDiagonalArray[0])
    ) {
      console.log("Çaprazda üçü eşit, kazandınız");
      return true;
    }

    // check 

    return false;
  };

  let _numberOfMoves = 0;
  const makeMove = function (row, column) {
    if (gameBoard.setGameBoard(row, column, activePlayer.symbol)) {
      // check if it's a valid move
      _numberOfMoves++;

      if (_numberOfMoves > 2) checkWinner(_numberOfMoves);

      roundReset();
    }
  };

  const switchPlayerTurn = function () {
    activePlayer = activePlayer === x_Player ? o_Player : x_Player;
  };

  const newGame = function () {
    console.log("Yeni Round, Sıranın sahibi:", activePlayer);
  };

  const roundReset = function () {
    console.log("-------------------------------------------------------");
    switchPlayerTurn();
    console.log("Round Devamı, Sıranın sahibi:", activePlayer);
  };

  return {
    newGame,
    makeMove,
    activePlayer,
    checkWinner,
  };
})();

gameController.newGame();
gameController.makeMove(0, 0); //Horizontal test
gameController.makeMove(1, 0);
gameController.makeMove(0, 1);
gameController.makeMove(1, 1);
gameController.makeMove(2, 0);
gameController.makeMove(1, 2);

// gameController.makeMove(0, 0); //Vertical test
// gameController.makeMove(0, 1);
// gameController.makeMove(1, 0);
// gameController.makeMove(1, 2);
// gameController.makeMove(2, 0);

// gameController.makeMove(0, 0); // diagonal test
// gameController.makeMove(1, 0),
// gameController.makeMove(1, 1);
// gameController.makeMove(2, 1);
// gameController.makeMove(2, 2);
