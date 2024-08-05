const gameBoard = (function () {
  //Defining the size of the game area
  const _gridSize = 3; // 3 x 3

  let gameBoard = Array(_gridSize)
    .fill()
    .map(() => Array(_gridSize).fill("O")); //Create 2D Array

  //Gameboard interaction
  const getGameBoard = () => gameBoard; // no need

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

const cacheDOM = (function () {
  const boardDOM = document.getElementById("board");
  // console.log(boardDOM.children);

  // for(const index of boardDOM.children)
  // {
  //   console.log(index);
  // }

  // Give coordinates to square elements according to position in gameBoard Array
  for (let i = 0, childIndex = 0; i < gameBoard.getGameBoard().length; i++) {
    for (let j = 0; j < gameBoard.getGameBoard()[i].length; j++, childIndex++) {
      boardDOM.children[childIndex].dataset.coordinate = `${i},${j}`;
    }
  }

  const render = function (row, column) {
    const coordinate = `${row},${column}`;
    const child = document.querySelector(`[data-coordinate = ${CSS.escape(coordinate)}]`);

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
    for (const child of boardDOM.children) {
      child.textContent = "";
    }
  }

  // for (const child of boardDOM.children) {
  //   // console.log(child);

  //   child.addEventListener("click", () => {
  //     console.log(child);
  //   });
  // }

  return {
    render,
    reset
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

  let activePlayer = x_Player;

  const newGame = function () {
    // newGame includes all three rounds

    console.log("---------------------------------------------");
    console.log("Yeni oyun");
    console.log("---------------------------------------------");
    console.log("Round:", roundCounter);

    /* Reset */
    _numberOfMoves = 0;
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
    _numberOfMoves = 0;
    cacheDOM.reset();
    gameBoard.resetGameBoard();
  };

  const switchPlayerTurn = function () {
    activePlayer = activePlayer === x_Player ? o_Player : x_Player;
  };

  const makeMove = function (row, column) {
    const isRoundFinished = checkWinningCondition() ? true : false;

    if(isRoundFinished) {
      console.log("Round bitti, taş koyamazsınız.");
      return;
    }

    if (gameBoard.setGameBoard(row, column, activePlayer.symbol)) {
      // check if it's a valid move
      cacheDOM.render(row, column);
      _numberOfMoves++;

      

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

  const checkWinningCondition = function (_numberOfMoves) {
    const isSame = function (array, controlValue) {
      const _isSame = (currentValue) =>
        !(currentValue === "") && currentValue === controlValue;
      return array.every(_isSame);
    };

    // check horizontal equality
    for (let row = 0; row < board.length; row++) {
      const firstCell = board[row][0];

      if (isSame(board[row], firstCell)) {
        console.log("Yatayda üçü eşit...");
        activePlayer.giveScore();
        checkWinner();
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
        activePlayer.giveScore();
        checkWinner();
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
      console.log("Çaprazda üçü eşit...");
      activePlayer.giveScore();
      checkWinner();
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

gameController.newGame();
// gameController.makeMove(0, 0); //Horizontal test
// gameController.makeMove(1, 0);
// gameController.makeMove(0, 1);
// gameController.makeMove(1, 1);
// gameController.makeMove(2, 0);
// gameController.makeMove(1, 2);

// gameController.makeMove(0, 0); //Vertical test
// gameController.makeMove(0, 1);
// gameController.makeMove(1, 0);
// gameController.makeMove(1, 2);
// gameController.makeMove(2, 0);

gameController.makeMove(0, 0); // diagonal test
gameController.makeMove(1, 0), gameController.makeMove(1, 1);
gameController.makeMove(2, 1);
gameController.makeMove(0, 1);
gameController.makeMove(0, 2);
gameController.makeMove(2, 2);

// gameController.makeMove(0, 0); //Horizontal test
// gameController.makeMove(1, 0);
// gameController.makeMove(0, 1);
// gameController.makeMove(1, 1);
// gameController.makeMove(2, 0);
// gameController.makeMove(1, 2);

// gameController.makeMove(0, 0); // tie test
// gameController.makeMove(1, 0);
// gameController.makeMove(1, 1);
// gameController.makeMove(2, 1);
// gameController.makeMove(0, 1);
// gameController.makeMove(0, 2);
// gameController.makeMove(1, 2);
// gameController.makeMove(2, 2);
// gameController.makeMove(2, 0);
