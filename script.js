const gameBoard = (function () {
  //Defining the size of the game area
  const _rows = 3;
  const _columns = 3;

  let gameBoard = Array(_rows)
    .fill()
    .map(() => Array(_columns).fill("")); //Create 2D Array

  console.log(gameBoard[1][2]);

  //Gameboard interaction
  const getGameBoard = () => gameBoard; // no need

  const setGameBoard = function (row, column, symbol) {
    if (!(gameBoard[row][column] === undefined)) {
      console.log("Çalıştı");
      console.log(gameBoard[row][column] || symbol);
      gameBoard[row][column] = gameBoard[row][column] || symbol; //if it's empty string then assign player symbol.
    } else {
      console.log("Çalışmadı");
    }

    console.log("Sütun atandıktan sonra", getGameBoard());
  };

  return {
    getGameBoard,
    setGameBoard,
  };
})();

const createPlayer = function (name, symbol) {
  let _score = 0; //Create private score variable for each player object
  const getScore = () => _score;
  const giveScore = () => _score++;

  return { name, symbol, getScore, giveScore };
};

const gameController = (function () {
  //   const board = gameBoard.getGameBoard();
  const board = gameBoard.getGameBoard();
  const x_Player = createPlayer("Furkan", "X");
  const o_Player = createPlayer("Buse", "O");

  let activePlayer = x_Player;

  const makeMove = function (row, column) {
    gameBoard.setGameBoard(row, column, activePlayer.symbol);
  };

  const switchPlayerTurn = function () {
    activePlayer = activePlayer === x_Player ? o_Player : x_Player;
  };
  
  const playRound = function () {
    
  };

  return {
    playRound
  };
})();
