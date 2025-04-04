class CandyGame {
    constructor() {
        this.grid = [];
        this.gridSize = 8;
        this.candyTypes = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
        this.candyIcons = {
            'red': '🍎',
            'blue': '🫐',
            'green': '🍏',
            'yellow': '🍋',
            'purple': '🍇',
            'orange': '🍊'
        };
        this.score = 0;
        this.moves = 0;
        this.selectedCandy = null;
        this.isProcessing = false;
    }

    init() {
        this.score = 0;
        this.moves = 0;
        this.updateScore();
        this.updateMoves();
        this.createGrid();
        this.setupEventListeners();
    }

    createGrid() {
        const gridElement = document.getElementById('candy-grid');
        gridElement.innerHTML = '';
        this.grid = [];

        for (let row = 0; row < this.gridSize; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                const candy = document.createElement('div');
                candy.className = 'candy';
                candy.dataset.row = row;
                candy.dataset.col = col;
                
                let type;
                do {
                    type = this.getRandomCandyType();
                    candy.className = `candy ${type}`;
                    candy.textContent = this.candyIcons[type];
                    this.grid[row][col] = type;
                } while (
                    this.checkMatch(row, col, type)
                );
                
                gridElement.appendChild(candy);
            }
        }
    }

    setupEventListeners() {
        const gridElement = document.getElementById('candy-grid');
        gridElement.addEventListener('click', (e) => {
            if (this.isProcessing) return;
            
            const candy = e.target.closest('.candy');
            if (!candy) return;

            const row = parseInt(candy.dataset.row);
            const col = parseInt(candy.dataset.col);

            this.handleCandyClick(row, col, candy);
        });
    }

    handleCandyClick(row, col, candyElement) {
        if (!this.selectedCandy) {
            this.selectedCandy = { row, col, element: candyElement };
            candyElement.classList.add('selected');
        } else {
            const prevRow = this.selectedCandy.row;
            const prevCol = this.selectedCandy.col;

            if (this.isAdjacent(prevRow, prevCol, row, col)) {
                this.swapCandies(prevRow, prevCol, row, col);
            }

            this.selectedCandy.element.classList.remove('selected');
            this.selectedCandy = null;
        }
    }

    isAdjacent(row1, col1, row2, col2) {
        return (Math.abs(row1 - row2) === 1 && col1 === col2) ||
               (Math.abs(col1 - col2) === 1 && row1 === row2);
    }

    async swapCandies(row1, col1, row2, col2) {
        this.isProcessing = true;
        this.moves++;
        this.updateMoves();

        // Swap in grid array
        const temp = this.grid[row1][col1];
        this.grid[row1][col1] = this.grid[row2][col2];
        this.grid[row2][col2] = temp;

        // Swap in DOM
        const candy1 = document.querySelector(`[data-row="${row1}"][data-col="${col1}"]`);
        const candy2 = document.querySelector(`[data-row="${row2}"][data-col="${col2}"]`);
        
        const tempClass = candy1.className;
        const tempText = candy1.textContent;
        
        candy1.className = candy2.className;
        candy1.textContent = candy2.textContent;
        
        candy2.className = tempClass;
        candy2.textContent = tempText;

        // Check for matches
        const matches = this.findMatches();
        if (matches.length > 0) {
            await this.handleMatches(matches);
        } else {
            // Swap back if no matches
            await this.swapCandies(row2, col2, row1, col1);
        }

        this.isProcessing = false;
    }

    findMatches() {
        const matches = new Set();

        // Check rows
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize - 2; col++) {
                if (this.grid[row][col] &&
                    this.grid[row][col] === this.grid[row][col + 1] &&
                    this.grid[row][col] === this.grid[row][col + 2]) {
                    matches.add(`${row},${col}`);
                    matches.add(`${row},${col + 1}`);
                    matches.add(`${row},${col + 2}`);
                }
            }
        }

        // Check columns
        for (let row = 0; row < this.gridSize - 2; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] &&
                    this.grid[row][col] === this.grid[row + 1][col] &&
                    this.grid[row][col] === this.grid[row + 2][col]) {
                    matches.add(`${row},${col}`);
                    matches.add(`${row + 1},${col}`);
                    matches.add(`${row + 2},${col}`);
                }
            }
        }

        return Array.from(matches).map(pos => {
            const [row, col] = pos.split(',').map(Number);
            return { row, col };
        });
    }

    async handleMatches(matches) {
        // Add score
        this.score += matches.length * 10;
        this.updateScore();

        // Remove matched candies
        for (const {row, col} of matches) {
            const candy = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            candy.classList.add('matched');
            this.grid[row][col] = null;
        }

        await this.delay(300); // Wait for animation

        // Drop candies
        await this.dropCandies();

        // Fill empty spaces
        this.fillEmptySpaces();

        // Check for new matches
        const newMatches = this.findMatches();
        if (newMatches.length > 0) {
            await this.handleMatches(newMatches);
        }
    }

    async dropCandies() {
        for (let col = 0; col < this.gridSize; col++) {
            let emptyRow = this.gridSize - 1;
            for (let row = this.gridSize - 1; row >= 0; row--) {
                if (this.grid[row][col] !== null) {
                    if (emptyRow !== row) {
                        // Move candy down
                        this.grid[emptyRow][col] = this.grid[row][col];
                        this.grid[row][col] = null;
                        
                        const candy = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                        const targetCandy = document.querySelector(`[data-row="${emptyRow}"][data-col="${col}"]`);
                        
                        targetCandy.className = candy.className;
                        targetCandy.textContent = candy.textContent;
                        candy.className = 'candy';
                        candy.textContent = '';
                    }
                    emptyRow--;
                }
            }
        }
    }

    fillEmptySpaces() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] === null) {
                    const type = this.getRandomCandyType();
                    this.grid[row][col] = type;
                    
                    const candy = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    candy.className = `candy ${type}`;
                    candy.textContent = this.candyIcons[type];
                }
            }
        }
    }

    getRandomCandyType() {
        return this.candyTypes[Math.floor(Math.random() * this.candyTypes.length)];
    }

    checkMatch(row, col, type) {
        // Check horizontal matches
        if (col >= 2 &&
            this.grid[row][col - 1] === type &&
            this.grid[row][col - 2] === type) {
            return true;
        }
        
        // Check vertical matches
        if (row >= 2 &&
            this.grid[row - 1][col] === type &&
            this.grid[row - 2][col] === type) {
            return true;
        }
        
        return false;
    }

    updateScore() {
        document.getElementById('candy-score').textContent = `Score: ${this.score}`;
    }

    updateMoves() {
        document.getElementById('candy-moves').textContent = `Moves: ${this.moves}`;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

let game;

function openCandyGame() {
    document.getElementById('candy-game-container').style.display = 'block';
    document.querySelector('.games-grid').style.display = 'none';
    game = new CandyGame();
    game.init();
}

function closeCandyGame() {
    document.getElementById('candy-game-container').style.display = 'none';
    document.querySelector('.games-grid').style.display = 'grid';
}

function restartCandyGame() {
    if (game) {
        game.init();
    }
} 