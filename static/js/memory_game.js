const memoryCards = [
    { id: 1, icon: 'fa-phone', title: 'Emergency Call', pair: 1 },
    { id: 2, icon: 'fa-phone', title: 'Emergency Call', pair: 1 },
    { id: 3, icon: 'fa-location-dot', title: 'Safe Location', pair: 2 },
    { id: 4, icon: 'fa-location-dot', title: 'Safe Location', pair: 2 },
    { id: 5, icon: 'fa-shield-halved', title: 'Stay Protected', pair: 3 },
    { id: 6, icon: 'fa-shield-halved', title: 'Stay Protected', pair: 3 },
    { id: 7, icon: 'fa-users', title: 'Support Group', pair: 4 },
    { id: 8, icon: 'fa-users', title: 'Support Group', pair: 4 },
    { id: 9, icon: 'fa-bell', title: 'Stay Alert', pair: 5 },
    { id: 10, icon: 'fa-bell', title: 'Stay Alert', pair: 5 },
    { id: 11, icon: 'fa-map-location-dot', title: 'Safe Route', pair: 6 },
    { id: 12, icon: 'fa-map-location-dot', title: 'Safe Route', pair: 6 }
];

let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;
let moves = 0;
let gameTimer;
let seconds = 0;

function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startMemoryGame() {
    const gameBoard = document.getElementById('memory-board');
    const shuffledCards = shuffleCards([...memoryCards]);
    gameBoard.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    canFlip = true;
    
    document.getElementById('memory-moves').textContent = 'Moves: 0';
    document.getElementById('memory-timer').textContent = 'Time: 0:00';
    
    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.id = card.id;
        cardElement.dataset.pair = card.pair;
        
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <i class="fas fa-question"></i>
                </div>
                <div class="card-back">
                    <i class="fas ${card.icon}"></i>
                    <span>${card.title}</span>
                </div>
            </div>
        `;
        
        cardElement.addEventListener('click', () => flipCard(cardElement));
        gameBoard.appendChild(cardElement);
    });
    
    startTimer();
    document.getElementById('memory-game-container').style.display = 'block';
    document.querySelector('.games-grid').style.display = 'none';
}

function startTimer() {
    clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        document.getElementById('memory-timer').textContent = 
            `Time: ${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || flippedCards.includes(card)) return;
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('memory-moves').textContent = `Moves: ${moves}`;
        canFlip = false;
        
        const [card1, card2] = flippedCards;
        if (card1.dataset.pair === card2.dataset.pair) {
            matchedPairs++;
            flippedCards = [];
            canFlip = true;
            
            if (matchedPairs === memoryCards.length / 2) {
                setTimeout(showGameComplete, 500);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }
}

function showGameComplete() {
    clearInterval(gameTimer);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    
    document.getElementById('memory-complete-moves').textContent = `Moves: ${moves}`;
    document.getElementById('memory-complete-time').textContent = `Time: ${timeString}`;
    
    let stars = 3;
    if (moves > 24) stars = 1;
    else if (moves > 16) stars = 2;
    
    const starsContainer = document.getElementById('memory-complete-stars');
    starsContainer.innerHTML = '';
    for (let i = 0; i < stars; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        starsContainer.appendChild(star);
    }
    
    document.getElementById('memory-game-board').style.display = 'none';
    document.getElementById('memory-complete').style.display = 'block';
}

function restartMemoryGame() {
    document.getElementById('memory-game-board').style.display = 'block';
    document.getElementById('memory-complete').style.display = 'none';
    startMemoryGame();
}

function closeMemoryGame() {
    clearInterval(gameTimer);
    document.getElementById('memory-game-container').style.display = 'none';
    document.querySelector('.games-grid').style.display = 'grid';
} 