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

    console.log("Does not work");
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
  const x_Player = createPlayer("Player X", "X");
  const o_Player = createPlayer("Player O", "O");
  let roundCounter = 1;
  let _numberOfMoves = 0;
  let isRoundFinished = false;

  let activePlayer = x_Player;

  const getActivePlayer = () => activePlayer;
  const getPlayers = () => {
    return { x_Player, o_Player };
  };
  const getRoundCounter = () => roundCounter;

  const newGame = function () {
    // newGame includes all three rounds

    console.log("---------------------------------------------");
    console.log("New Game");
    console.log("---------------------------------------------");
    console.log("Round:", roundCounter);

    /* Reset */
    _numberOfMoves = 0;
    roundCounter = 1;
    isRoundFinished = false;
    activePlayer = x_Player;
    cacheDOM.reset();
    gameBoard.resetGameBoard();
    x_Player.resetScore();
    o_Player.resetScore();

    // Reset Results
    cacheDOM.showResults(x_Player, o_Player, "");
  };

  const nextRound = function () {
    /* Reset */
    roundCounter++; // todo Round counter ile ilgili problem var.

    console.log("---------------------------------------------");
    console.log("New Round");
    console.log("---------------------------------------------");
    console.log("Round:", roundCounter);

    //Reset after Round
    isRoundFinished = false;
    _numberOfMoves = 0;
    activePlayer = x_Player;
    cacheDOM.reset();
    gameBoard.resetGameBoard();

    // Reset Results
    cacheDOM.showResults(x_Player, o_Player, "");
  };

  const switchPlayerTurn = function () {
    activePlayer = activePlayer === x_Player ? o_Player : x_Player;
  };

  const makeMove = function (row, column) {
    if (isRoundFinished) {
      console.log("Round has finished, you cannot make a move.");
      return;
    }

    if (gameBoard.setGameBoard(row, column, activePlayer.symbol)) {
      // check if it's a valid move
      cacheDOM.render(row, column);
      _numberOfMoves++;

      if (_numberOfMoves > 2 && checkWinningCondition()) {
        isRoundFinished = true;
        return;
      }

      switchPlayerTurn(); // switch player turn after a move
      cacheDOM.showResults(x_Player, o_Player, "");
    }
  };

  const checkWinner = function (isTie = false) {
    const x_PlayerScore = x_Player.getScore();
    const o_PlayerScore = o_Player.getScore();

    if (roundCounter < 3) {
      // end round
      let roundWinner;

      roundWinner = activePlayer.name;

      if (isTie) {
        console.log("Tie");
        cacheDOM.showResults(x_Player, o_Player, "TIE");
        cacheDOM.winnerDialog(true);
      } else {
        console.log("Round Winner:", roundWinner);
        cacheDOM.showResults(x_Player, o_Player, `${roundWinner} WINS`);
        cacheDOM.winnerDialog(true);
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
        console.log("NO GAME WINNER, TIE");
        cacheDOM.showResults(x_Player, o_Player, "NO WINNER IN THE GAME, TIE");
        cacheDOM.winnerDialog(false);

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
        console.log("WINNER OF THE GAME:", gameWinner.name);
        cacheDOM.showResults(
          x_Player,
          o_Player,
          `WINNER OF THE GAME IS ${gameWinner.name}`
        );
        cacheDOM.winnerDialog(false);
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
        console.log("Horizontal equality...");

        winnerCoordinates.push(`${row},0`, `${row},1`, `${row},2`);

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
        console.log("Vertical equality...");
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
      console.log("Diagonal equality...");

      winnerCoordinates.push("2,2", "1,1", "0,0");

      activePlayer.giveScore();
      checkWinner();

      cacheDOM.addAnimationToWinnerSquares(winnerCoordinates);
      return true;
    } else if (isSame(secondDiagonalArray, secondDiagonalArray[0])) {
      console.log("Diagonal equality...");

      winnerCoordinates.push("2,0", "1,1", "0,2");

      activePlayer.giveScore();
      checkWinner();

      cacheDOM.addAnimationToWinnerSquares(winnerCoordinates);
      return true;
    }

    if (_numberOfMoves === 9) {
      console.log("No equality pattern...");
      checkWinner(true);
      return true;
    }

    return false;
  };

  return {
    newGame,
    makeMove,
    nextRound,
    getActivePlayer,
    getPlayers,
    getRoundCounter,
    checkWinningCondition,
  };
})();

const cacheDOM = (function () {
  const boardDOM = document.getElementById("board");
  const squares = boardDOM.children;

  const x_PlayerDOM = document.getElementById("x-player");
  const o_PlayerDOM = document.getElementById("o-player");

  const changeNameDOM = document.getElementById("change-name");
  const newGameDOM = document.getElementById("new-game");

  const winnerDialogDOM = document.getElementById("winner-dialog");
  const nameDialogDOM = document.getElementById("name-dialog");
  const turnDOM = document.getElementById("turn");
  const resultDOM = document.getElementById("result");
  const dialogChangeNameDOM = document.getElementById("dialog-change-name");

  const xName = document.getElementById("x-name");
  const oName = document.getElementById("o-name");

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

  newGameDOM.addEventListener("click", () => {
    gameController.newGame();
  });

  const preventCancel = function (e) {
    e.preventDefault();
  };

  const changeName = function () {
    const { x_Player, o_Player } = gameController.getPlayers();
    x_Player.name = xName.value || "Player X";
    o_Player.name = oName.value || "Player O";
    showResults(x_Player, o_Player, "");

    xName.value = "";
    oName.value = "";
  };

  winnerDialogDOM.addEventListener("cancel", preventCancel);
  changeNameDOM.addEventListener("click", () => {
    nameDialogDOM.showModal();
  });

  dialogChangeNameDOM.addEventListener("click", changeName);

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

  const addAnimationToWinnerSquares = function (coordinatesArr) {
    coordinatesArr.forEach((coordinates) => {
      for (const square of squares) {
        if (square.dataset.coordinate === coordinates) {
          square.firstChild.classList.add("scale-animation");
        }
      }
    });
  };

  const showResults = function (x_Player, o_Player, result) {
    x_PlayerDOM.textContent = `${x_Player.name}: ${x_Player.getScore()}`;
    o_PlayerDOM.textContent = `${o_Player.name}: ${o_Player.getScore()}`;

    resultDOM.textContent = result;
    turnDOM.textContent = gameController.getActivePlayer().symbol;
  };

  const winnerDialog = function (isRoundWin) {
    if (isRoundWin) {
      const nextRoundButton = document.createElement("button");
      nextRoundButton.textContent = "Next Round";
      nextRoundButton.setAttribute("id", "next-round-button");
      winnerDialogDOM.appendChild(nextRoundButton);

      const roundDOM = document.createElement("p");
      roundDOM.setAttribute("id", "round");
      roundDOM.textContent = `ROUND ${gameController.getRoundCounter()}`;

      winnerDialogDOM.prepend(roundDOM);

      nextRoundButton.addEventListener("click", () => {
        winnerDialogDOM.close();
        winnerDialogDOM.removeChild(roundDOM);
        winnerDialogDOM.removeChild(nextRoundButton);
        gameController.nextRound();
      });

      winnerDialogDOM.showModal();
    } else {
      winnerDialogDOM.showModal();

      const closeDialog = () => {
        winnerDialogDOM.close();
        winnerDialogDOM.removeEventListener("click", closeDialog);
      };

      winnerDialogDOM.addEventListener("click", closeDialog);
    }
  };

  return {
    render,
    reset,
    addAnimationToWinnerSquares,
    showResults,
    winnerDialog,
  };
})();

gameController.newGame();
