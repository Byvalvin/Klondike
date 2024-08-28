document.addEventListener('DOMContentLoaded', () => {
    // Setup Klondike
    const statusElement = document.getElementById('status');
    const startButton = document.getElementById('start-button');
    const difficultySelect = document.getElementById('difficulty');
    const difficultySelector = document.getElementById('difficulty-selector');

    // Difficulty Info Elements
    const difficultyInfoContainer = document.getElementById('difficulty-info-container');
    const difficultyInfoButton = document.getElementById('toggle-difficulty-info');
    const difficultyInfoSection = document.getElementById('difficulty-info');
    const pileOrderingInfo = document.getElementById('pile-ordering-info');
    const numberOfPilesInfo = document.getElementById('number-of-piles-info');
    const suitOrderingInfo = document.getElementById('suit-ordering-info');
    const timedInfo = document.getElementById('timed-info');
    const difficultyInfoHeader = document.getElementById('difficulty-info-header');

    // Game History Elements
    const gameHistorySection = document.getElementById('game-history');
    const gameHistoryTableBody = gameHistorySection.querySelector('tbody');
    const gameHistoryButton = document.getElementById('toggle-game-history');

    const timerButton = document.getElementById('toggle-timer');

    let currentGameHolder = null;
    let currentGameParams = null;
    let infoVisible = false;
    let historyVisible = false;

    const toggleVisibility = (element, show) => {
        if (element) {
            element.classList.toggle('hidden', !show);
        }
    };

    function toggleDifficultySelector(show) {
        toggleVisibility(difficultySelector, show);
        toggleVisibility(startButton, show);
        toggleVisibility(difficultyInfoContainer, !show);
    }

    function populateDifficultySelector() {
        difficulties.forEach(difficulty => {
            const option = document.createElement('option');
            option.value = difficulty.name;
            option.textContent = difficulty.name;
            difficultySelect.appendChild(option);
        });
    }

    function initializeGame(difficultyName, params) {
        if (currentGameHolder) {
            currentGameHolder.stopTimer();
        }
        if (params) {
            console.log(`Initializing game with difficulty: ${difficultyName}`, params);
            currentGameParams = { difficultyName, ...params };
            currentGameHolder = new Game(params);
            setupEventListeners(currentGameHolder);
            currentGameHolder.updateBoard();
            toggleDifficultySelector(false);
            showDifficultyInfo(difficultyName, params); // Show difficulty info
            difficultyInfoButton.classList.remove('hidden'); // Ensure the button is visible
        } else {
            updateStatus('Selected difficulty not found', true);
        }
    }

    function updateStatus(message, isError = false) {
        statusElement.innerText = message;
        if (isError) {
            console.error(message);
        }
    }

    function handleButtonAction(action, successMessage, errorMessage) {
        try {
            action();
            updateStatus(successMessage);
        } catch (error) {
            updateStatus(errorMessage, true);
        }
    }

    function addButtonListener(buttonId, action, successMessage, errorMessage) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => handleButtonAction(action, successMessage, errorMessage));
        } else {
            console.warn(`Button with ID '${buttonId}' not found.`);
        }
    }

    function setupEventListeners(game) {
        addButtonListener('reset-button', () => game.reset(), 'Stock reset', 'Error resetting stock');
        addButtonListener('discard-button', () => game.discard(), 'Discarded cards from stock', 'Error discarding cards');
        addButtonListener('board-button', () => game.board(), 'Board updated', 'Error updating board');
        addButtonListener('cheat-button', () => game.cheat(), 'Cheat mode activated', 'Error activating cheat mode');
        addButtonListener('save-button', () => game.save(), 'Game saved', 'Error saving game');

        document.getElementById('load-button').addEventListener('click', () => {
            const data = localStorage.getItem('savedGame');
            if (data) {
                handleButtonAction(() => game.load(data), 'Game loaded', 'Error loading game');
            } else {
                updateStatus('No saved game found');
            }
        });

        document.getElementById('done-button').addEventListener('click', () => {
            game.done('Game over');
            toggleDifficultySelector(true);
            updateStatus('Game over');
            recordGameHistory(currentGameParams);
        });

        document.querySelectorAll('.deck').forEach(deck => {
            deck.addEventListener('dragstart', (e) => game.handleDragStart(e, deck));
            deck.addEventListener('dragover', (e) => e.preventDefault());
            deck.addEventListener('drop', (e) => {
                e.preventDefault();
                game.handleDrop(e);
            });
        });
    }

    function showDifficultyInfo(difficultyName, params) {
        difficultyInfoHeader.textContent = `Difficulty: ${difficultyName}`;
        
        pileOrderingInfo.textContent = params.pileOrdering === "none" ? 
            "None" 
            : 
            params.pileOrdering === "altColor" ? "Alternate Colours" : "Same Colours";
        
        const numberMap = { three: 3, four: 4, seven: 7 };
        numberOfPilesInfo.textContent = numberMap[params.numberOfPiles] || params.numberOfPiles;
        
        suitOrderingInfo.textContent = params.suitOrdering === "acesFirst" ? "Aces First" : "Kings First";

        const timeMap = { threeMins: 3, fiveMins: 5, tenMins: 10 };
        timedInfo.textContent = timeMap[params.timed] || params.timed;
        
        toggleVisibility(difficultyInfoSection, true);
    }

    function recordGameHistory(params) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${params.difficultyName}</td>
            <td>Pile Order: ${params.pileOrdering}, Number of Piles: ${params.numberOfPiles}, Suit Order: ${params.suitOrdering}, Timed: ${params.timed}</td>
        `;
        gameHistoryTableBody.appendChild(row);
    }

    // Begin Klondike
    // Show player game difficulty options
    populateDifficultySelector();

    // Start a new game
    startButton.addEventListener('click', () => {
        const selectedDifficulty = difficultySelect.value;
        const params = getDifficultyParams(selectedDifficulty);
        initializeGame(selectedDifficulty, params);
        updateStatus(`Difficulty: ${selectedDifficulty}`);
    });

    // Toggle visibility of the difficulty info section
    difficultyInfoButton.addEventListener('click', () => {
        infoVisible = !infoVisible;
        toggleVisibility(difficultyInfoContainer, !infoVisible);
        difficultyInfoButton.querySelector('.material-icons').textContent = infoVisible ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
    });

    // Toggle visibility of the game history section
    gameHistoryButton.addEventListener('click', () => {
        historyVisible = !historyVisible;
        toggleVisibility(gameHistorySection, historyVisible);
        gameHistoryButton.querySelector('.material-icons').textContent = historyVisible ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
    });

    // Toggle timer visibility
    timerButton.addEventListener('click', () => {
        document.getElementById('timer-container').classList.toggle('hidden-timer');
    });

    // Initialize default game
    const defaultGameName = "Default";
    const defaultGame = { pileOrdering: "none", numberOfPiles: "four", suitOrdering: "acesFirst", timed: "none" };
    initializeGame(defaultGameName, defaultGame);
    toggleDifficultySelector(true);
});
