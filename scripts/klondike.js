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
        cardElement.innerText = card.isFaceup() ? `${card.rank}\n${card.suit}` : '';
        if (!card.isFaceup()) {
            cardElement.classList.add('face-down');
        }
        return cardElement;
    }

    // Function to update the deck UI
    function updateDeck() {
        const deckContainer = document.getElementById('deck-container');
        deckContainer.innerHTML = ''; // Clear the deck container
        game.Stock.cards.forEach(card => {
            const cardElement = createCardElement(card);
            deckContainer.appendChild(cardElement);
        });
    }

    // Function to update the board UI
    function updateBoard() {
        const boardContainer = document.getElementById('board-container');
        boardContainer.innerHTML = ''; // Clear the board container

        // Create and append containers for stock and discard
        const topContainer = document.createElement('div');
        topContainer.className = 'top-container';
        const stockDiv = createDeckDiv(game.Stock);
        const discardDiv = createDeckDiv(game.Discard);
        topContainer.appendChild(stockDiv);
        topContainer.appendChild(discardDiv);
        boardContainer.appendChild(topContainer);

        // Create and append containers for suits and piles
        const suitContainer = document.createElement('div');
        suitContainer.className = 'suit-container';
        game.SUITS.forEach(suitDeck => {
            const suitDiv = createDeckDiv(suitDeck);
            suitContainer.appendChild(suitDiv);
        });
        boardContainer.appendChild(suitContainer);

        const pileContainer = document.createElement('div');
        pileContainer.className = 'pile-container';
        game.PILES.forEach(pileDeck => {
            const pileDiv = createDeckDiv(pileDeck);
            pileContainer.appendChild(pileDiv);
        });
        boardContainer.appendChild(pileContainer);
    }

    // Function to create a deck div
    function createDeckDiv(deck) {
        const deckDiv = document.createElement('div');
        deckDiv.className = 'deck';
        deckDiv.id = deck.nameDeck();
        deckDiv.draggable = false; // Disable default drag behavior

        // Create and add the label
        const label = document.createElement('div');
        label.className = 'deck-label';
        label.innerText = deck.nameDeck();
        deckDiv.appendChild(label);

        // Add the deck content
        const content = document.createElement('div');
        content.className = 'deck-content';
        deck.cards.forEach(card => {
            content.appendChild(createCardElement(card));
        });
        deckDiv.appendChild(content);

        // Add event listeners
        deckDiv.addEventListener('click', () => game.handleDeckClick(deck));
        deckDiv.addEventListener('dragstart', (event) => game.handleDragStart(event, deck));
        deckDiv.addEventListener('dragover', (event) => game.handleDragOver(event));
        deckDiv.addEventListener('drop', (event) => game.handleDrop(event, deck));

        return deckDiv;
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



