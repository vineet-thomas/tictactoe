// This will run only when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("JavaScript is working!");
    
    // Game state
    const game = {
        board: Array(9).fill(''),
        currentPlayer: 'X',
        gameActive: true,
        scores: { X: 0, O: 0 }
    };

    // Get all required elements
    const board = document.getElementById('gameBoard');
    const status = document.getElementById('gameStatus');
    const restartBtn = document.getElementById('restartBtn');
    const playerXScore = document.getElementById('playerXScore');
    const playerOScore = document.getElementById('playerOScore');
    const players = document.querySelectorAll('.player');

    // Initialize game
    initGame();

    function initGame() {
        console.log("Initializing game...");
        
        // Reset board state
        game.board = Array(9).fill('');
        game.gameActive = true;
        
        // Reset UI cells
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('x', 'o', 'win-cell');
            cell.textContent = '';
        });
        
        // Set status
        updateStatus(`${game.currentPlayer}'s turn`);
        
        // Set active player UI
        updatePlayerDisplay();
    }

    function updateStatus(message) {
        status.textContent = message;
    }

    function updatePlayerDisplay() {
        players.forEach(player => {
            player.classList.remove('active');
        });
        
        const currentPlayerElement = game.currentPlayer === 'X' 
            ? document.querySelector('.player-x') 
            : document.querySelector('.player-o');
        
        if (currentPlayerElement) {
            currentPlayerElement.classList.add('active');
        }
    }

    function makeMove(cell, index) {
        if (!game.gameActive || game.board[index] !== '') return;
        
        // Update game board state
        game.board[index] = game.currentPlayer;
        
        // Update UI
        cell.textContent = game.currentPlayer;
        cell.classList.add(game.currentPlayer.toLowerCase());
        
        // Check for win or draw
        if (checkWin()) {
            endGame(`${game.currentPlayer} Wins!`);
            updateScores();
        } else if (checkDraw()) {
            endGame("It's a Draw!");
        } else {
            // Switch player
            game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
            updateStatus(`${game.currentPlayer}'s turn`);
            updatePlayerDisplay();
        }
    }

    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            
            if (game.board[a] && 
                game.board[a] === game.board[b] && 
                game.board[a] === game.board[c]) {
                
                // Highlight winning cells
                pattern.forEach(index => {
                    const winningCell = document.querySelector(`.cell[data-index="${index}"]`);
                    if (winningCell) {
                        winningCell.classList.add('win-cell');
                    }
                });
                
                return true;
            }
        }
        
        return false;
    }

    function checkDraw() {
        return !game.board.includes('');
    }

    function endGame(message) {
        game.gameActive = false;
        updateStatus(message);
    }

    function updateScores() {
        game.scores[game.currentPlayer]++;
        playerXScore.textContent = game.scores.X;
        playerOScore.textContent = game.scores.O;
    }

    // Event Listeners
    board.addEventListener('click', (e) => {
        if (!e.target.classList.contains('cell')) return;
        
        const index = parseInt(e.target.getAttribute('data-index'));
        console.log(`Cell clicked: ${index}`);
        makeMove(e.target, index);
    });

    restartBtn.addEventListener('click', () => {
        console.log("New Game button clicked!");
        initGame();
    });
});