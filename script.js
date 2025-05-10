
let boardSize = 8;
let board = [];
let moves = [];
let playerName = '';
let timer = 0;
let timerInterval;

function startGame() {
    playerName = document.getElementById("playerName").value;
    if (playerName.trim() === "") return alert("Por favor, ingresa un nombre.");
    document.getElementById("intro").style.display = "none";
    document.getElementById("main").style.display = "block";
    document.getElementById("playerInfo").innerText = "Jugador: " + playerName;
    initializeBoard();
    startTimer();
}

function initializeBoard() {
    boardSize = parseInt(document.getElementById("boardSize").value);
    const boardContainer = document.getElementById("board");
    boardContainer.innerHTML = "";
    boardContainer.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`;
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(""));
    moves = [];
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.onclick = () => placeQueen(r, c);
            boardContainer.appendChild(cell);
        }
    }
    updateHighlights();
    updateStatus();
}

function placeQueen(row, col) {
    if (board[row][col] === "Q") return;
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (r === row && c === col) continue;
            if (board[r][c] === "Q" && (r === row || c === col || Math.abs(r - row) === Math.abs(c - col))) return;
        }
    }
    board[row][col] = "Q";
    moves.push([row, col]);
    updateHighlights();
    updateStatus();
    if (moves.length === boardSize) checkVictory();
}

function updateHighlights() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        cell.className = "cell";
        if (board[r][c] === "Q") {
            cell.classList.add("queen");
        } else if (isAttacked(r, c)) {
            cell.classList.add("attacked");
        } else {
            cell.classList.add("safe");
        }
    });
}

function isAttacked(r, c) {
    return moves.some(([qr, qc]) => qr === r || qc === c || Math.abs(qr - r) === Math.abs(qc - c));
}

function resetBoard() {
    clearInterval(timerInterval);
    timer = 0;
    startTimer();
    initializeBoard();
}

function undoMove() {
    if (moves.length === 0) return;
    const [r, c] = moves.pop();
    board[r][c] = "";
    updateHighlights();
    updateStatus();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById("timer").innerText = "Tiempo: " + timer + "s";
    }, 1000);
}

function updateStatus() {
    document.getElementById("moves").innerText = "Movimientos: " + moves.length;
}

function checkVictory() {
    if (moves.length !== boardSize) return;
    document.getElementById("victoryMessage").style.display = "flex";
    document.getElementById("summary").innerText = `¡Felicidades, ${playerName}! Has completado el juego en ${timer} segundos con ${moves.length} movimientos.`;
    clearInterval(timerInterval);
}

function closeVictory() {
    document.getElementById("victoryMessage").style.display = "none";
}

function solveBoard() {
    alert("Función de resolver aún no implementada.");
}
