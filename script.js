const gameBoard = (function () {
  //Defining the size of the game area
  const rows = 3;
  const columns = 3;

  let gameBoard = Array(rows) 
    .fill()
    .map(() => Array(columns).fill("")); //Create 2D Array
  console.log(gameBoard);

  //Setting a getter for gameBoard
  const getGameBoard = () => gameBoard;
  
  return {
    getGameBoard
  }
})();
