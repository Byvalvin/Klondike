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
            updateUI(); // Update the UI after a successful action
        } catch (error) {
            updateStatus(errorMessage, true);
        }
    }

    // Function to create a card element
    function createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        if (card.isFaceUp) {
            cardElement.innerText = `${card.rank}\n${card.suit}`;
        } else {
            cardElement.classList.add('face-down');
            cardElement.innerText = ''; // Face-down cards have no text
        }
        return cardElement;
    }

    // Function to update the deck UI
    function updateDeck() {
        const deckContainer = document.getElementById('deck-container');
        deckContainer.innerHTML = ''; // Clear the deck container
        game.getDeck().forEach(card => {
            const cardElement = createCardElement(card);
            deckContainer.appendChild(cardElement);
        });
    }

    // Function to update the board UI
    function updateBoard() {
        const boardContainer = document.getElementById('board-container');
        boardContainer.innerHTML = ''; // Clear the board container
        game.getBoard().forEach(pile => {
            const pileContainer = document.createElement('div');
            pileContainer.className = 'pile';
            pile.forEach(card => {
                const cardElement = createCardElement(card);
                pileContainer.appendChild(cardElement);
            });
            boardContainer.appendChild(pileContainer);
        });
    }

    // Function to update all UI components
    function updateUI() {
        updateDeck();
        updateBoard();
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

    // Initialize the UI on document load
    updateUI();
});



