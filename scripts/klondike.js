document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    const game = new Game();
    const statusElement = document.getElementById('status');

    // Function to update status
    function updateStatus(message) {
        statusElement.innerText = message;
    }

    // Handle user interactions
    document.getElementById('reset-button').addEventListener('click', () => {
        try {
            game.reset();
            updateStatus('Game reset');
        } catch (error) {
            console.error('Error resetting game:', error.message);
            updateStatus('Error resetting game');
        }
    });

    document.getElementById('discard-button').addEventListener('click', () => {
        try {
            game.discard();
            updateStatus('Discarded cards from stock');
        } catch (error) {
            console.error('Error discarding cards:', error.message);
            updateStatus('Error discarding cards');
        }
    });

    document.getElementById('board-button').addEventListener('click', () => {
        try {
            game.board();
            updateStatus('Board updated');
        } catch (error) {
            console.error('Error updating board:', error.message);
            updateStatus('Error updating board');
        }
    });

    document.getElementById('cheat-button').addEventListener('click', () => {
        try {
            game.cheat();
            updateStatus('Cheat mode activated');
        } catch (error) {
            console.error('Error activating cheat mode:', error.message);
            updateStatus('Error activating cheat mode');
        }
    });

    document.getElementById('save-button').addEventListener('click', () => {
        try {
            game.save();
            updateStatus('Game saved');
        } catch (error) {
            console.error('Error saving game:', error.message);
            updateStatus('Error saving game');
        }
    });

    document.getElementById('load-button').addEventListener('click', () => {
        const data = localStorage.getItem('savedGame');
        if (data) {
            try {
                game.load(data);
                updateStatus('Game loaded');
            } catch (error) {
                console.error('Error loading game:', error.message);
                updateStatus('Error loading game');
            }
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

