let nombreJugador = sessionStorage.getItem('nombreJugador');
let N, tablero, movimientos, tiempoInicio;
const tableroHTML = document.getElementById('tablero');

function guardarNombre() {
    nombreJugador = document.getElementById('nombreJugador').value.trim();
    if (nombreJugador) {
        sessionStorage.setItem('nombreJugador', nombreJugador);
        document.getElementById('nombreJugadorModal').style.display = 'none';
    }
}

function iniciarJuego() {
    N = parseInt(document.getElementById('nInput').value);
    tablero = Array.from({length: N}, () => Array(N).fill(false));
    movimientos = [];
    tiempoInicio = Date.now();
    tableroHTML.style.gridTemplateColumns = `repeat(${N}, 40px)`;
    tableroHTML.innerHTML = '';
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            const cell = document.createElement('div');
            cell.className = 'celda';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.onclick = () => colocarReina(r, c);
            tableroHTML.appendChild(cell);
        }
    }
    actualizarCeldas();
    document.getElementById('mensajeVictoria').textContent = '';
    mostrarNumeroDeSoluciones(N);
}

function colocarReina(r, c) {
    if (tablero[r][c]) return;
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (tablero[i][j] && (i === r || j === c || Math.abs(i - r) === Math.abs(j - c))) return;
        }
    }
    tablero[r][c] = true;
    movimientos.push([r, c]);
    actualizarCeldas();
    if (movimientos.length === N) mostrarVictoria();
}

function actualizarCeldas() {
    [...tableroHTML.children].forEach(cell => {
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        cell.className = 'celda';
        if (tablero[r][c]) {
            cell.classList.add('reina');
        } else {
            let atacada = false;
            for (let [qr, qc] of movimientos) {
                if (qr === r || qc === c || Math.abs(qr - r) === Math.abs(qc - c)) {
                    atacada = true;
                    break;
                }
            }
            cell.classList.add(atacada ? 'atacada' : 'segura');
        }
    });
}

function deshacerMovimiento() {
    const ultimo = movimientos.pop();
    if (ultimo) {
        tablero[ultimo[0]][ultimo[1]] = false;
        actualizarCeldas();
    }
}

function reiniciarJuego() {
    iniciarJuego();
}

function mostrarVictoria() {
    const tiempo = ((Date.now() - tiempoInicio) / 1000).toFixed(1);
    document.getElementById('mensajeVictoria').textContent = `✅ Felicitaciones, ${nombreJugador}. Juego completado en ${tiempo}s con ${movimientos.length} movimientos.`;
}

function resolver() {
    reiniciarJuego();
    const soluciones = [];
    const tab = Array(N).fill(-1);
    function esSeguro(fila, col) {
        for (let i = 0; i < fila; i++) {
            if (tab[i] === col || Math.abs(i - fila) === Math.abs(tab[i] - col)) return false;
        }
        return true;
    }
    function backtrack(fila) {
        if (fila === N) {
            soluciones.push([...tab]);
            return;
        }
        for (let col = 0; col < N; col++) {
            if (esSeguro(fila, col)) {
                tab[fila] = col;
                backtrack(fila + 1);
                tab[fila] = -1;
            }
        }
    }
    backtrack(0);
    const solucion = soluciones[0];
    solucion.forEach((col, fila) => colocarReina(fila, col));
}

function mostrarNumeroDeSoluciones(N) {
    let count = 0;
    const tab = Array(N).fill(-1);
    function esSeguro(fila, col) {
        for (let i = 0; i < fila; i++) {
            if (tab[i] === col || Math.abs(i - fila) === Math.abs(tab[i] - col)) return false;
        }
        return true;
    }
    function backtrack(fila) {
        if (fila === N) {
            count++;
            return;
        }
        for (let col = 0; col < N; col++) {
            if (esSeguro(fila, col)) {
                tab[fila] = col;
                backtrack(fila + 1);
                tab[fila] = -1;
            }
        }
    }
    backtrack(0);
    document.getElementById('infoSoluciones').textContent = `Hay ${count} posibles soluciones para un tablero de ${N}x${N}.`;
}

if (!nombreJugador) {
    document.getElementById('nombreJugadorModal').style.display = 'flex';
} else {
    document.getElementById('nombreJugadorModal').style.display = 'none';
}