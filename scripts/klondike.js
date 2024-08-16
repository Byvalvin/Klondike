document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    const game = new Game();
    
    // Handle user interactions
    document.getElementById('reset-button').addEventListener('click', () => {
        try {
            game.reset();
            document.getElementById('status').innerText = 'Game reset';
        } catch (error) {
            console.error(error.message);
            document.getElementById('status').innerText = 'Error resetting game';
        }
    });
    
    document.getElementById('discard-button').addEventListener('click', () => {
        try {
            game.discard();
            document.getElementById('status').innerText = 'Discarded cards from stock';
        } catch (error) {
            console.error(error.message);
            document.getElementById('status').innerText = 'Error discarding cards';
        }
    });
    
    document.getElementById('board-button').addEventListener('click', () => {
        game.board();
        document.getElementById('status').innerText = 'Board updated';
    });
    
    document.getElementById('cheat-button').addEventListener('click', () => {
        game.cheat();
        document.getElementById('status').innerText = 'Cheat mode activated';
    });
    
    document.getElementById('save-button').addEventListener('click', () => {
        try {
            game.save();
            document.getElementById('status').innerText = 'Game saved';
        } catch (error) {
            console.error(error.message);
            document.getElementById('status').innerText = 'Error saving game';
        }
    });
    
    document.getElementById('load-button').addEventListener('click', () => {
        const data = localStorage.getItem('savedGame');
        if (data) {
            try {
                game.load(data);
                document.getElementById('status').innerText = 'Game loaded';
            } catch (error) {
                console.error(error.message);
                document.getElementById('status').innerText = 'Error loading game';
            }
        } else {
            document.getElementById('status').innerText = 'No saved game found';
        }
    });
    
    document.getElementById('done-button').addEventListener('click', () => {
        game.done('Game over');
        document.getElementById('status').innerText = 'Game over';
    });
    
    // Initialize the board on document load
    document.addEventListener('DOMContentLoaded', () => {
        game.updateBoard();
    });
    
});

