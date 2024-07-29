const gameBoard = (function () {
  //Defining the size of the game area
  const _rows = 3;
  const _columns = 3;

  let _gameBoard = Array(_rows)
    .fill()
    .map(() => Array(_columns).fill("")); //Create 2D Array

  console.log(_gameBoard); //Logging array

  //Setting a getter for gameBoard
  const getGameBoard = () => _gameBoard;

  return {
    getGameBoard,
  };
})();

const createPlayer = function (name) {
  let score = 0; //Create private score variable for each player object
  const getScore = () => score;
  const giveScore = () => score++;

  return { name, getScore, giveScore };
}

// const Player1 = createPlayer("Furkan");
// const Player2 = createPlayer("Serkan");
