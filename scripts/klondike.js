// klondike.js

document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('status');
    const difficultySelect = document.getElementById('difficulty');
    const startButton = document.getElementById('start-button');

    /**
     * Populates the difficulty selector with options.
     */
    function populateDifficultySelector() {
        difficulties.forEach(difficulty => {
            const option = document.createElement('option');
            option.value = difficulty.name;
            option.textContent = difficulty.name;
            difficultySelect.appendChild(option);
        });
    }

    /**
     * Initializes the game with the selected difficulty.
     * @param {string} difficultyName - The name of the selected difficulty level.
     */
    function initializeGame(difficultyName) {
        // Get difficulty
        const score = generateDifficultyScore();
        console.log(`Generated Score: ${score}`);
        const difficultyName = getDifficulty(score);
        console.log(`Difficulty Level: ${difficulty.name}`);
            
        const difficultyParams = getDifficultyParams(difficultyName);
        if (difficultyParams) {
            console.log(`Initializing game with difficulty: ${difficultyName}`);
            const game = new Game(difficultyParams);
            setupEventListeners(game);
            game.updateBoard();
        } else {
            updateStatus('Selected difficulty not found', true);
        }
    }

    /**
     * Updates the status element with a message.
     * @param {string} message - The message to display.
     * @param {boolean} [isError=false] - Indicates if the message is an error.
     */
    function updateStatus(message, isError = false) {
        statusElement.innerText = message;
        if (isError) {
            console.error(message);
        }
    }

    /**
     * Handles button actions with error handling.
     * @param {Function} action - The action to perform.
     * @param {string} successMessage - The message to display on success.
     * @param {string} errorMessage - The message to display on error.
     */
    function handleButtonAction(action, successMessage, errorMessage) {
        try {
            action();
            updateStatus(successMessage);
        } catch (error) {
            updateStatus(errorMessage, true);
        }
    }

    /**
     * Adds an event listener to a button if it exists.
     * @param {string} buttonId - The ID of the button.
     * @param {Function} action - The action to perform when the button is clicked.
     * @param {string} successMessage - The message to display on success.
     * @param {string} errorMessage - The message to display on error.
     */
    function addButtonListener(buttonId, action, successMessage, errorMessage) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => handleButtonAction(action, successMessage, errorMessage));
        } else {
            console.warn(`Button with ID '${buttonId}' not found.`);
        }
    }

    /**
     * Sets up event listeners for game controls.
     * @param {Game} game - The game instance.
     */
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
            updateStatus('Game over');
        });

        document.querySelectorAll('.deck').forEach(deck => {
            deck.addEventListener('dragstart', (e) => game.handleDragStart(e, deck));
        });
    }

    // Populate the difficulty selector
    populateDifficultySelector();

    // Initialize the game when the start button is clicked
    startButton.addEventListener('click', () => {
        const selectedDifficulty = difficultySelect.value;
        initializeGame(selectedDifficulty);
    });

    // Optionally initialize with default or pre-selected difficulty if needed
    // initializeGame(difficultySelect.value || difficulties[0].name);
});





