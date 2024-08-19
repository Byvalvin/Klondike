document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    const game = new Game();
    const statusElement = document.getElementById('status');

    // Function to update status and log errors
    function updateStatus(message, isError = false) {
        statusElement.innerText = message;
        if (isError) {
            console.error(message);
        }
    }

    // Function to handle button actions
    function handleButtonAction(action, successMessage, errorMessage) {
        try {
            action();
            updateStatus(successMessage);
        } catch (error) {
            updateStatus(errorMessage, true);
        }
    }

    // Event Listeners
    document.getElementById('reset-button').addEventListener('click', () => {
        handleButtonAction(() => game.reset(), 'Game reset', 'Error resetting game');
    });

    document.getElementById('discard-button').addEventListener('click', () => {
        handleButtonAction(() => game.discard(), 'Discarded cards from stock', 'Error discarding cards');
    });

    document.getElementById('board-button').addEventListener('click', () => {
        handleButtonAction(() => game.board(), 'Board updated', 'Error updating board');
    });

    document.getElementById('cheat-button').addEventListener('click', () => {
        handleButtonAction(() => game.cheat(), 'Cheat mode activated', 'Error activating cheat mode');
    });

    document.getElementById('save-button').addEventListener('click', () => {
        handleButtonAction(() => game.save(), 'Game saved', 'Error saving game');
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
        updateStatus('Game over');
    });

    // Initialize the board on document load
    game.updateBoard();
});


