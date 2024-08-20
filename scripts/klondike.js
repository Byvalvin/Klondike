// Function to load scripts from the stack dynamically
const loadScripts = (stack) => {
  if (stack.length === 0) {
    console.log('All scripts loaded.');
    return;
  }

  const { src, msg } = stack.shift(); // Get the next script from the stack

  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  script.onload = () => {
    console.log(msg);
    loadScripts(stack); // Load the next script from the stack
  };
  script.onerror = () => console.error(`Failed to load ${src}`);
  document.body.appendChild(script);
};

/**
 * Initializes the Klondike game and sets up event listeners for game controls.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    const game = new Game();
    const statusElement = document.getElementById('status');

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

    // Add event listeners to buttons
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

    // Define the stack of scripts
    const scriptStack = [
        { src: 'scripts/mode.js', msg: 'Done loading code.js' },
        // Add more scripts here as needed
    ];
    // Start loading scripts from the stack
    loadScripts(scriptStack);
    
    // Initialize the board on document load
    game.updateBoard();


});





