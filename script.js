const gameBoard = (function () {
  //Defining the size of the game area
  const _gridSize = 3; // 3 x 3

  let gameBoard = Array(_gridSize)
    .fill()
    .map(() => Array(_gridSize).fill("")); //Create 2D Array

  //Gameboard interaction
  const getGameBoard = () => gameBoard;

  const setGameBoard = function (row, column, symbol) {
    if (
      !(gameBoard[row][column] === undefined) &&
      gameBoard[row][column] === ""
    ) {
      // look if it's truthy

      gameBoard[row][column] = symbol;

      getGameBoard().forEach((item) => {
        // debugging purposes only
        const clonedArray = [...item];
        console.log(clonedArray);
      });
      console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

      return true;
    }

    console.log("Çalışmadı");
    return false;
  };

  const resetGameBoard = () => {
    gameBoard.forEach((arr) => {
      arr.fill("");
    });
  };
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
  const resetScore = () => (_score = 0);

  return { name, symbol, getScore, giveScore, resetScore };
};

const gameController = (function () {
  const board = gameBoard.getGameBoard();
  const x_Player = createPlayer("Furkan", "X");
  const o_Player = createPlayer("Buse", "O");
  let roundCounter = 1;
  let _numberOfMoves = 0;
  let isRoundFinished = false;

  let activePlayer = x_Player;

  const newGame = function () {
    // newGame includes all three rounds

    console.log("---------------------------------------------");
    console.log("Yeni oyun");
    console.log("---------------------------------------------");
    console.log("Round:", roundCounter);

    /* Reset */
    _numberOfMoves = 0;
    isRoundFinished = false;
    cacheDOM.reset();
    gameBoard.resetGameBoard();
    x_Player.resetScore();
    o_Player.resetScore();
  };

  const nextRound = function () {
    /* Reset */
    roundCounter++; // todo Round counter ile ilgili problem var.

    console.log("---------------------------------------------");
    console.log("Yeni round");
    console.log("---------------------------------------------");
    console.log("Round:", roundCounter);

    //Reset after Round
    isRoundFinished = false;
    _numberOfMoves = 0;
    cacheDOM.reset();
    gameBoard.resetGameBoard();
  };

  const switchPlayerTurn = function () {
    activePlayer = activePlayer === x_Player ? o_Player : x_Player;
  };

  const makeMove = function (row, column) {
    if (isRoundFinished) {
      console.log("Round bitti, taş koyamazsınız.");
      return;
    }

    if (gameBoard.setGameBoard(row, column, activePlayer.symbol)) {
      // check if it's a valid move
      cacheDOM.render(row, column);
      _numberOfMoves++;

      if (_numberOfMoves > 2 && checkWinningCondition()) {
        isRoundFinished = true;
      }

      switchPlayerTurn(); // switch player turn after a move
    }
  };

  const checkWinner = function () {
    const x_PlayerScore = x_Player.getScore();
    const o_PlayerScore = o_Player.getScore();

    if (roundCounter < 3) {
      // end round
      let roundWinner;

      !(_numberOfMoves === 9)
        ? (roundWinner = activePlayer.name)
        : (roundWinner = "");

      if (roundWinner === "") {
        console.log("Raundun kazananı yok, berabere");
      } else {
        console.log("Raundun kazananı:", roundWinner);
      }

      console.log(
        x_Player.name,
        ":",
        x_Player.getScore(),
        " - ",
        o_Player.name,
        ":",
        o_Player.getScore()
      );

      return roundWinner;
    } else {
      // end game
      let gameWinner;
      if (x_PlayerScore > o_PlayerScore) {
        gameWinner = x_Player;
      } else if (x_PlayerScore < o_PlayerScore) {
        gameWinner = o_Player;
      } else {
        gameWinner = "";
      }

      if (gameWinner === "") {
        console.log("Oyunun kazananı yok, berabere");

        console.log(
          x_Player.name,
          ":",
          x_Player.getScore(),
          " - ",
          o_Player.name,
          ":",
          o_Player.getScore()
        );
      } else {
        console.log("Oyunun kazananı:", gameWinner.name);

        console.log(
          x_Player.name,
          ":",
          x_Player.getScore(),
          " - ",
          o_Player.name,
          ":",
          o_Player.getScore()
        );
      }

      return gameWinner;
    }
  };

  const checkWinningCondition = function () {
    const isSame = function (array, controlValue) {
      const _isSame = (currentValue) =>
        !(currentValue === "") && currentValue === controlValue;
      return array.every(_isSame);
    };

    const winnerCoordinates = [];

    // check horizontal equality
    for (let row = 0; row < board.length; row++) {
      const firstCell = board[row][0];

      if (isSame(board[row], firstCell)) {
        console.log("Yatayda üçü eşit...");

        winnerCoordinates.push(`${row},0`, `${row},1`, `${row},2`);
        console.log(winnerCoordinates);

        activePlayer.giveScore();
        checkWinner();
        
        cacheDOM.addAnimationToWinnerSquares(winnerCoordinates);
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
        console.log("Dikeyde üçü eşit...");
        winnerCoordinates.push(`0,${column}`, `1,${column}`, `2,${column}`);

        activePlayer.giveScore();
        checkWinner();

        cacheDOM.addAnimationToWinnerSquares(winnerCoordinates);
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
    if (isSame(firstDiagonalArray, firstDiagonalArray[0])) {
      console.log("Çaprazda üçü eşit...");

      winnerCoordinates.push("2,2", "1,1", "0,0");

      activePlayer.giveScore();
      checkWinner();

      cacheDOM.addAnimationToWinnerSquares(winnerCoordinates);
      return true;
    } else if (isSame(secondDiagonalArray, secondDiagonalArray[0])) {
      console.log("Çaprazda üçü eşit...");

      winnerCoordinates.push("0,0", "1,1", "2,2");

      activePlayer.giveScore();
      checkWinner();

      cacheDOM.addAnimationToWinnerSquares(winnerCoordinates);
      return true;
    }

    if (_numberOfMoves === 9) {
      console.log("Eşitlik deseni bulunamadı...");
      checkWinner();
      return true;
    }

    return false;
  };

  return {
    newGame,
    makeMove,
    nextRound,
    activePlayer,
    checkWinningCondition,
  };
})();

const cacheDOM = (function () {
  const boardDOM = document.getElementById("board");
  const squares = boardDOM.children;
  console.log(squares);

  // Give coordinates to square elements according to position in gameBoard Array
  for (let i = 0, childIndex = 0; i < gameBoard.getGameBoard().length; i++) {
    for (let j = 0; j < gameBoard.getGameBoard()[i].length; j++, childIndex++) {
      boardDOM.children[childIndex].dataset.coordinate = `${i},${j}`;
    }
  }

  for (const square of squares) {
    square.addEventListener("click", (e) => {
      const splitCoordinates = square.dataset.coordinate.split(",");

      const row = splitCoordinates[0];
      const column = splitCoordinates[1];

      gameController.makeMove(row, column);
    });
  }

  const render = function (row, column) {
    const coordinate = `${row},${column}`;
    const child = document.querySelector(
      `[data-coordinate = ${CSS.escape(coordinate)}]`
    );

    if (child.children.length !== 0) {
      return;
    }

    const board = gameBoard.getGameBoard();
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    svg.appendChild(use);

    if (child.dataset.coordinate === `${row},${column}`) {
      if (board[row][column] === "X") {
        use.setAttribute("href", "#x-symbol");
      } else if (board[row][column] === "O") {
        use.setAttribute("href", "#o-symbol");
      }
    }

    child.appendChild(svg);
  };

  const reset = function () {
    for (const child of squares) {
      child.textContent = "";
    }
  };

  const addAnimationToWinnerSquares = function(coordinatesArr) {
    coordinatesArr.forEach(coordinates => {
      for (const square of squares) {
        if(square.dataset.coordinate === coordinates)
        {
          square.firstChild.classList.add("scale-animation");
        }
      }
    });
  } 

  return {
    render,
    reset,
    addAnimationToWinnerSquares
  };
})();

gameController.newGame();
