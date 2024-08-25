// klondike.js

document.addEventListener('DOMContentLoaded', () => {
    // Setup Klondike
    const statusElement = document.getElementById('status');

    const startButton = document.getElementById('start-button');
    const difficultySelect = document.getElementById('difficulty');
    const difficultySelector = document.getElementById('difficulty-selector');
    const gameControls = document.getElementById('game-controls');
    const stateControls = document.getElementById('state-controls');

    // Difficulty Info Elements
    const difficultyInfoSection = document.getElementById('difficulty-info');
    const pileOrderingInfo = document.getElementById('pile-ordering-info');
    const numberOfPilesInfo = document.getElementById('number-of-piles-info');
    const suitOrderingInfo = document.getElementById('suit-ordering-info');
    const timedInfo = document.getElementById('timed-info');
    const difficultyInfoHeader = document.getElementById('difficulty-info-header');

    let currentGameHolder = null;
    let infoVisible = true;

    function toggleDifficultySelector(show) {
        difficultySelector.classList.toggle('hidden', !show);
        gameControls.classList.toggle('hidden', show);
        stateControls.classList.toggle('hidden', show);
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
            currentGameHolder = new Game(params);
            setupEventListeners(currentGameHolder);
            currentGameHolder.updateBoard();
            toggleDifficultySelector(false);
            showDifficultyInfo(difficultyName, params); // Show difficulty info when initializing the game
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

        
        // Add event listener for the toggle arrow in the difficulty info section
        // Toggle visibility of the difficulty info section
        document.getElementById('toggle-difficulty-info').addEventListener('click', () => {
            infoVisible = !infoVisible;
            difficultyInfoSection.classList.toggle('hidden', !infoVisible);
            toggleDifficultyInfoButton.querySelector('.material-icons').textContent = infoVisible ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
        });
        
        document.getElementById('toggle-timer').addEventListener('click', () => {
            document.getElementById('timer-container').classList.toggle('hidden-timer');
        });

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

    // Show difficulty info in the info section
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
        
        difficultyInfoSection.classList.remove('hidden');
    }


    // Begin Klondike
    populateDifficultySelector();

    startButton.addEventListener('click', () => {
        const selectedDifficulty = difficultySelect.value;
        const params = getDifficultyParams(selectedDifficulty);
        initializeGame(selectedDifficulty, params);
        updateStatus(`Difficulty: ${selectedDifficulty}`);
    });

    const defaultGameName = "Default";
    const defaultGame = { pileOrdering: "none", numberOfPiles: "four", suitOrdering: "acesFirst", timed: "none" };
    initializeGame(defaultGameName, defaultGame);
    toggleDifficultySelector(true);

});


