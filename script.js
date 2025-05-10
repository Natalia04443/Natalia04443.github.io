let board = [];
let size = 8;
let moves = [];
let startTime, playerName;

function startGame() {
  const input = document.getElementById("playerNameInput");
  const name = input.value.trim();
  if (name) {
    playerName = name;
    localStorage.setItem("nreinas_player", playerName);
    document.getElementById("playerModal").style.display = "none";
  }
}

window.onload = function () {
  const saved = localStorage.getItem("nreinas_player");
  if (saved) {
    playerName = saved;
    document.getElementById("playerModal").style.display = "none";
  }
};

function initBoard() {
  size = parseInt(document.getElementById("size").value);
  board = Array.from({ length: size }, () => Array(size).fill(""));
  moves = [];
  startTime = new Date();
  drawBoard();
}

function drawBoard() {
  const container = document.getElementById("board-container");
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${size}, 50px)`;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (board[i][j] === "Q") cell.classList.add("queen");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", handleCellClick);
      container.appendChild(cell);
    }
  }
  highlightCells();
}

function handleCellClick(e) {
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  if (board[row][col] === "") {
    if (isSafe(row, col)) {
      board[row][col] = "Q";
      moves.push({ row, col });
      drawBoard();
      if (moves.length === size) checkVictory();
    }
  }
}

function highlightCells() {
  document.querySelectorAll(".cell").forEach(cell => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    if (board[row][col] === "") {
      if (isSafe(row, col)) cell.classList.add("green");
      else cell.classList.add("red");
    }
  });
}

function isSafe(row, col) {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] === "Q") {
        if (i === row || j === col || Math.abs(i - row) === Math.abs(j - col)) return false;
      }
    }
  }
  return true;
}

function resetBoard() {
  initBoard();
}

function undoMove() {
  const last = moves.pop();
  if (last) {
    board[last.row][last.col] = "";
    drawBoard();
  }
}

function checkVictory() {
  const timeTaken = Math.round((new Date() - startTime) / 1000);
  const message = document.getElementById("victory-message");
  message.classList.remove("hidden");
  message.innerHTML = `✅ ¡Felicidades ${playerName}!<br/>
    Has completado el juego.<br/>
    ⏱ Tiempo: ${timeTaken}s<br/>
    🔢 Movimientos: ${moves.length}`;
}

function solve() {
  initBoard();
  function place(r) {
    if (r === size) return true;
    for (let c = 0; c < size; c++) {
      if (isSafe(r, c)) {
        board[r][c] = "Q";
        moves.push({ row: r, col: c });
        if (place(r + 1)) return true;
        board[r][c] = "";
        moves.pop();
      }
    }
    return false;
  }
  place(0);
  drawBoard();
  checkVictory();
}