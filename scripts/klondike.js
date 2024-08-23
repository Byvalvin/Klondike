// klondike.js

document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('status');
    const difficultySelect = document.getElementById('difficulty');
    const startButton = document.getElementById('start-button');

    const difficultySelector = document.getElementById('difficulty-selector');
    const gameControls = document.getElementById('game-controls');
    const stateControls = document.getElementById('state-controls');

    // Show difficulty selector and start button
    function showDifficultySelector() {
        difficultySelector.classList.remove('hidden');
        gameControls.classList.add('hidden');
        stateControls.classList.add('hidden');
    }

    // Hide difficulty selector and start button
    function hideDifficultySelector() {
        difficultySelector.classList.add('hidden');
        gameControls.classList.remove('hidden');
        stateControls.classList.remove('hidden');
    }
    
    // Populate the difficulty selector with options
    function populateDifficultySelector() {
        difficulties.forEach(difficulty => {
            const option = document.createElement('option');
            option.value = difficulty.name;
            option.textContent = difficulty.name;
            difficultySelect.appendChild(option);
        });
    }

    // Initialize the game with params
    function initializeGame(difficultyName, params) {
        if (params) {
            console.log(`Initializing game with difficulty: ${difficultyName}`, params);
            const game = new Game(params);
            setupEventListeners(game);
            game.updateBoard();
            hideDifficultySelector();
            
        } else {
            updateStatus('Selected difficulty not found', true);
        }
    }

    // Updates the status element with a message
    function updateStatus(message, isError = false) {
        statusElement.innerText = message;
        if (isError) {
            console.error(message);
        }
    }

    // Handles button actions with error handling
    function handleButtonAction(action, successMessage, errorMessage) {
        try {
            action();
            updateStatus(successMessage);
        } catch (error) {
            updateStatus(errorMessage, true);
        }
    }

    // Adds an event listener to a button if it exists
    function addButtonListener(buttonId, action, successMessage, errorMessage) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => handleButtonAction(action, successMessage, errorMessage));
        } else {
            console.warn(`Button with ID '${buttonId}' not found.`);
        }
    }

    // Sets up event listeners for game controls
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
            showDifficultySelector();
            updateStatus('Game over');
        });

        // drag and drop
        document.querySelectorAll('.deck').forEach(deck => {
            deck.addEventListener('dragstart', (e) => game.handleDragStart(e, deck));
            deck.addEventListener('dragover', (e) => e.preventDefault());
            deck.addEventListener('drop', (e) => {
                e.preventDefault();
                game.handleDrop(e);
            });
        });
    }

    // Populate the difficulty selector
    populateDifficultySelector();

    // Initialize the game when the start button is clicked
    startButton.addEventListener('click', () => {
        const selectedDifficulty = difficultySelect.value;
        const params = getDifficultyParams(selectedDifficulty);
        initializeGame(selectedDifficulty, params);
    });

    // Optionally initialize with default or pre-selected difficulty if needed
    showDifficultySelector(); // Show the difficulty selector initially
    
    // Optionally initialize with default or pre-selected difficulty if needed
    const defaultGameName = "Default";
    const defaultGame = { pileOrdering:"none", numberOfPiles:"four", suitOrdering:"acesFirst", timed:"none" };
    initializeGame(defaultGameName, defaultGame);
});



