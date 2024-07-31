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

  const resetGameBoard = () =>
    gameBoard.forEach((arr, index) => {
      gameBoard[index] = arr.map((item) => (item = ""));
    });

  return {
    getGameBoard,
    setGameBoard,
    resetGameBoard,
  };
})();

const createPlayer = function (name, symbol) {
  let _score = 0; //Create private score variable for each player object
  const getScore = () => _score;
  const giveScore = () => _score++;
  const resetScore = () => _score = 0;

  return { name, symbol, getScore, giveScore, resetScore };
};

const gameController = (function () {
  const board = gameBoard.getGameBoard();
  const x_Player = createPlayer("Furkan", "X");
  const o_Player = createPlayer("Buse", "O");
  let roundCounter = 1;

  let activePlayer = x_Player;

  const checkWinningCondition = function (numberOfMoves) {
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

    if (numberOfMoves === 9) {
      console.log("Beraberlik");
    }

    return false;
  };

  const switchPlayerTurn = function () {
    activePlayer = activePlayer === x_Player ? o_Player : x_Player;
  };

  let _numberOfMoves = 0;
  const makeMove = function (row, column) {
    if (gameBoard.setGameBoard(row, column, activePlayer.symbol)) {
      // check if it's a valid move
      _numberOfMoves++;

      if (_numberOfMoves > 2) checkWinningCondition(_numberOfMoves);

      switchPlayerTurn(); // switch player turn after a move
    }
  };

  const newGame = function () {
    // newGame includes all three rounds
    console.log("Yeni oyun");
    gameBoard.resetGameBoard();

    x_Player.resetScore();
    o_Player.resetScore();
  };

  const nextRound = function () {
    // After Round
    console.log("Yeni round");
    gameBoard.resetGameBoard();
    
    x_Player.resetScore();
    o_Player.resetScore();

    roundCounter++;
  };

  const endGame = function () {

  };

  const checkWinner = function () {
    const x_PlayerScore = x_Player.getScore();
    const o_PlayerScore = o_Player.getScore();

    if (roundCounter < 4) {
      // last player who makes winning move is the winner
      activePlayer.giveScore();
      return activePlayer;
    } else {
      let gameWinner;
      if (x_PlayerScore > o_PlayerScore) {
        gameWinner = x_Player;
      } else if (x_PlayerScore < o_PlayerScore) {
        gameWinner = o_Player;
      } else {
        gameWinner = { x_Player, o_Player };
      }
      endGame(gameWinner);
    }
  };

  return {
    newGame,
    makeMove,
    activePlayer,
    checkWinningCondition,
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
