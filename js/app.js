/*-------------- Constants -------------*/
const shipTypes = [
    { name: "carrier", size: 5, marker: "Ca" },
    { name: "battleship", size: 4, marker: "Ba" },
    { name: "cruiser", size: 3, marker: "Cr" },
    { name: "submarine", size: 3, marker: "Su" },
    { name: "destroyer", size: 2, marker: "De" }
];

const redTeam = 'redTeam';
const blueTeam = 'blueTeam';

/*---------- Variables (state) ---------*/

// Set initial first player
let currentPlayer = redTeam;

// Set variables for boards for each player
let redTeamBoard, blueTeamBoard;

// Set variables for ships for each team
let redTeamShips, blueTeamShips;

// Set initial game condition
let gameOver = false;

/*----- Cached Element References  -----*/

// Connect player grids
const redTeamGridEl = document.createElement('div');
redTeamGridEl.classList.add('grid');
document.body.append(redTeamGridEl);

const blueTeamGridEl = document.createElement('div');
blueTeamGridEl.classList.add('grid');
document.body.appendChild(blueTeamGridEl);

// Connect buttons & messages
const statusMessageEl = document.getElementById('status-message');
const startButton = document.getElementById('start-button');

/*-------------- Functions -------------*/

// Set initial game conditions
function initGame() {
    // Initialize empty boards
    redTeamBoard = createBoard();
    blueTeamBoard = createBoard();

    // Initialize ship placement
    placeShips(redTeamBoard, shipTypes);
    placeShips(blueTeamBoard, shipTypes);

    // Copy shipTypes to track hits and sunk status
    redTeamShips = JSON.parse(JSON.stringify(shipTypes));
    blueTeamShips = JSON.parse(JSON.stringify(shipTypes));

    // Render both boards
    renderBoard(redTeamBoard, redTeamGridEl, false); // Show red team's board
    renderBoard(blueTeamBoard, blueTeamGridEl, true); // Hide blue team's board to start

    // Update message upon setting up board
    updateMessage("Red Team, it's your turn!");
}

// Develop board based on grid size and set initial conditions
function createBoard() {
    const board = [];
    const [rows, cols] = [10, 10];
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i][j] = {
                hasShip: false,
                isHit: false,
                shipMarker: null
            };
        }
    }
    return board;
}

// Place ships on the board
function placeShips(board, shipTypes) {
    const rows = board.length;
    const cols = board[0].length;

    function isAreaFree(row, col, shipLength, orientation) {
        const startRow = Math.max(0, row - 1);
        const endRow = Math.min(rows - 1, row + (orientation === 0 ? 0 : shipLength - 1) + 1);
        const startCol = Math.max(0, col - 1);
        const endCol = Math.min(cols - 1, col + (orientation === 0 ? shipLength - 1 : 0) + 1);

        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                if (board[r][c].hasShip) {
                    return false;
                }
            }
        }
        return true;
    }

    for (const ship of shipTypes) {
        const shipLength = ship.size;
        const shipMarker = ship.marker;
        let placed = false;
        while (!placed) {
            const orientation = Math.floor(Math.random() * 2);
            let row, col;
            if (orientation === 0) {
                // Horizontal placement
                row = Math.floor(Math.random() * rows);
                col = Math.floor(Math.random() * (cols - shipLength + 1));
            } else {
                // Vertical placement
                row = Math.floor(Math.random() * (rows - shipLength + 1));
                col = Math.floor(Math.random() * cols);
            }

            if (isAreaFree(row, col, shipLength, orientation)) {
                // Place the ship
                for (let i = 0; i < shipLength; i++) {
                    if (orientation === 0) {
                        board[row][col + i].hasShip = true;
                        board[row][col + i].shipMarker = shipMarker;
                    } else {
                        board[row + i][col].hasShip = true;
                        board[row + i][col].shipMarker = shipMarker;
                    }
                }
                placed = true;
            }
        }
    }
}

// Find ship by marker
function findShipByMarker(marker, ships) {
    return ships.find(ship => ship.marker === marker);
}

// Handle attacks
function handleAttack(x, y, attackingPlayer, defendingBoard, defendingShips) {
    if (defendingBoard[x][y].isHit) {
        updateMessage("You've already hit this space! Choose a different one.");
        return;
    }

    defendingBoard[x][y].isHit = true;

    if (defendingBoard[x][y].hasShip) {
        updateMessage(`${attackingPlayer} hit a ship!`);
        const ship = findShipByMarker(defendingBoard[x][y].shipMarker, defendingShips);
        ship.hits = (ship.hits || 0) + 1;
        if (ship.hits === ship.size) {
            ship.sunk = true;
            updateMessage(`${attackingPlayer} sunk the ${ship.name}!`);
        }

        if (checkForWin(defendingShips)) {
            gameOver = true;
            updateMessage(`${attackingPlayer} wins!`);
        }
    } else {
        updateMessage(`${attackingPlayer} missed.`);
    }

    if (!gameOver) {
        switchTurn();
    }
}

// Develop a function to switch between players & hide the board based on whose turn it is
function switchTurn() {
    currentPlayer = currentPlayer === redTeam ? blueTeam : redTeam;
    updateMessage(`${currentPlayer === redTeam ? 'Red Team' : 'Blue Team'}, it's your turn!`);

    if (currentPlayer === redTeam) {
        renderBoard(blueTeamBoard, blueTeamGridEl, true);
        renderBoard(redTeamBoard, redTeamGridEl, false);
    } else {
        renderBoard(redTeamBoard, redTeamGridEl, true);
        renderBoard(blueTeamBoard, blueTeamGridEl, false);
    }
}

// Check for win conditions
function checkForWin(ships) {
    return ships.every(ship => ship.sunk);
}

// Function to change the display of the board
function renderBoard(board, gridElement, hideShips = false) {
    gridElement.innerHTML = " "; // Clears current grid
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (board[i][j].isHit) {
                if (board[i][j].hasShip) {
                    cell.classList.add("hit");
                    cell.textContent = board[i][j].shipMarker;
                } else {
                    cell.classList.add("miss");
                }
            } else if (board[i][j].hasShip && !hideShips) {
                cell.classList.add("ship");
                cell.textContent = board[i][j].shipMarker;
            }
            cell.dataset.x = i;
            cell.dataset.y = j;
            gridElement.appendChild(cell);
        }
    }
}

function updateMessage(msg) {
    statusMessageEl.textContent = msg;
}

/*----------- Event Listeners ----------*/

startButton.addEventListener("click", () => {
    initGame();
});

blueTeamGridEl.addEventListener("click", event => {
    if (gameOver || currentPlayer !== redTeam) return;

    const target = event.target;
    if (target.classList.contains("cell")) {
        const x = parseInt(target.dataset.x);
        const y = parseInt(target.dataset.y);
        handleAttack(x, y, "Red Team", blueTeamBoard, blueTeamShips);
        renderBoard(blueTeamBoard, blueTeamGridEl, true);
    }
});

redTeamGridEl.addEventListener("click", event => {
    if (gameOver || currentPlayer !== blueTeam) return;

    const target = event.target;
    if (target.classList.contains("cell")) {
        const x = parseInt(target.dataset.x);
        const y = parseInt(target.dataset.y);
        handleAttack(x, y, "Blue Team", redTeamBoard, redTeamShips);
        renderBoard(redTeamBoard, redTeamGridEl, true);
    }
});
