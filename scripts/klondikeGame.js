class Game {
    constructor() {
        this.startMessage = 'Welcome to Klondike!';
        this.endMessage = 'Thank you for playing';
        this.gameOn = true;
        this.Stock = new Deck('Stock');
        this.Discard = new Deck('Discard');
        this.SUITS = ['Spades', 'Hearts', 'Diamonds', 'Clubs'].map(name => new Deck(name));
        this.PILES = Array.from({ length: 7 }, (_, i) => new Deck(`Pile ${i + 1}`));
        this.selectedCard = null; // Track the currently selected card
        this.initializeGame();
    }

    initializeGame() {
        const fullDeck = this.createDeck();
        fullDeck.shuffle();

        // Deal cards to the stock
        while (!fullDeck.isEmpty()) {
            this.Stock.pushDeck(fullDeck.popDeck());
        }

        // Deal cards to piles
        this.PILES.forEach((pile, i) => {
            for (let j = 0; j <= i; j++) {
                const card = this.Stock.popDeck();
                card.faceupCard(j === i);
                pile.pushDeck(card);
            }
        });

        // Deal a few cards to discard pile
        for (let i = 0; i < 3 && !this.Stock.isEmpty(); i++) {
            this.Discard.pushDeck(this.Stock.popDeck());
        }

        // Face up top card in stock if any
        if (!this.Stock.isEmpty()) {
            this.Stock.peekDeck().faceupCard(true);
        }

        this.updateBoard();
    }

    createDeck() {
        const suits = ['s', 'h', 'd', 'c'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
        const deck = new Deck('Full Deck');
        suits.forEach(suit => {
            ranks.forEach(rank => {
                deck.pushDeck(new Card(suit, rank));
            });
        });
        return deck;
    }

    reset() {
        if (this.Stock.isEmpty()) {
            const relay = new Deck("relay_deck");
            while (!this.Discard.isEmpty()) {
                relay.pushDeck(this.Discard.popDeck());
            }
            while (!relay.isEmpty()) {
                this.Stock.pushDeck(relay.popDeck());
            }
            if (!this.Stock.isEmpty()) {
                this.Stock.peekDeck().faceupCard(true);
            }
        } else {
            throw new Error('Stock Not Empty');
        }
        this.updateBoard();
    }

    discard() {
        if (this.Stock.isEmpty()) {
            throw new Error('Stock Empty');
        }
        const relay = new Deck("relay_deck");
        const moves = Math.min(3, this.Stock.sizeDeck());
        for (let n = 0; n < moves; n++) {
            this.Stock.peekDeck().faceupCard(false);
            relay.pushDeck(this.Stock.popDeck());
            this.Discard.pushDeck(relay.popDeck());
        }
        if (!this.Stock.isEmpty()) {
            this.Stock.peekDeck().faceupCard(true);
        }
        this.updateBoard();
    }

    board() {
        if (!this.isValidState()) {
            console.log('No Cards');
        } else {
            console.log(`${this.Stock.nameDeck()}: ${this.Stock}`);
            console.log(`${this.Discard.nameDeck()}: ${this.Discard}`);
            this.SUITS.forEach(deck => console.log(`${deck.nameDeck()}: ${deck}`));
            this.PILES.forEach(deck => console.log(`${deck.nameDeck()}: ${deck}`));
        }
    }

    cheat() {
        if (!this.isValidState()) {
            console.log('No Cards');
        } else {
            console.log(`${this.Stock.nameDeck()}: ${JSON.stringify(this.Stock)}`);
            console.log(`${this.Discard.nameDeck()}: ${JSON.stringify(this.Discard)}`);
            this.SUITS.forEach(deck => console.log(`${deck.nameDeck()}: ${JSON.stringify(deck)}`));
            this.PILES.forEach(deck => console.log(`${deck.nameDeck()}: ${JSON.stringify(deck)}`));
        }
    }

    isValidState() {
        return this.Stock && this.Discard && this.SUITS.length > 0 && this.PILES.length > 0;
    }

    done(message) {
        this.gameOn = false;
        console.log(message);
    }

    load(data) {
        try {
            const lines = data.split('\n').filter(line => line.trim() !== '');
            const Decks = lines.map(line => {
                const [deckName, ...cardStrings] = line.split(' ');
                const deck = new Deck(deckName);
                cardStrings.forEach(cardString => {
                    const cardRank = cardString[0];
                    const cardSuit = cardString[1];
                    const cardState = cardString[2];
                    const card = new Card(cardSuit, cardRank);
                    card.faceupCard(cardState === '+');
                    deck.pushDeck(card);
                });
                return deck;
            });
            // Assign decks to game properties
            this.Stock = Decks.find(deck => deck.nameDeck() === 'Stock');
            this.Discard = Decks.find(deck => deck.nameDeck() === 'Discard');
            this.SUITS = Decks.filter(deck => ['Spades', 'Hearts', 'Diamonds', 'Clubs'].includes(deck.nameDeck()));
            this.PILES = Decks.filter(deck => !['Stock', 'Discard', 'Spades', 'Hearts', 'Diamonds', 'Clubs'].includes(deck.nameDeck()));
        } catch (err) {
            console.error('Error loading game:', err);
        }
        this.updateBoard();
    }

    save() {
        try {
            const Decks = [this.Stock, this.Discard, ...this.SUITS, ...this.PILES];
            const data = Decks.map(deck => `${deck.nameDeck()} ${deck.toJSON()}`).join('\n');
            localStorage.setItem('savedGame', data);
            console.log('Game saved');
        } catch (err) {
            console.error('Error saving game:', err);
        }
    }

    move(fromDeckName, toDeckName) {
        console.log(`Attempting to move from ${fromDeckName} to ${toDeckName}`);
        const fromDeck = [this.Stock, ...this.SUITS, ...this.PILES].find(deck => deck.nameDeck() === fromDeckName);
        const toDeck = [...this.SUITS, ...this.PILES].find(deck => deck.nameDeck() === toDeckName);

            // Debugging: log the deck names and if they are found
        console.log('Available decks:', [this.Stock, ...this.SUITS, ...this.PILES].map(deck => deck.nameDeck()));
        console.log('Source deck:', fromDeck ? fromDeck.nameDeck() : 'Not found');
        console.log('Target deck:', toDeck ? toDeck.nameDeck() : 'Not found');
        
        if (!fromDeck || !toDeck) {
            throw new Error('Invalid deck names');
        }
        const card = fromDeck.popDeck();
        if (!card) {
            throw new Error('No card to move');
        }
        card.faceupCard(true);
        if (this.canMove(fromDeck, toDeck, card)) {
            toDeck.pushDeck(card);
        } else {
            fromDeck.pushDeck(card); // Return card if move is invalid
            throw new Error('Invalid move');
        }
        if (!fromDeck.isEmpty()) {
            fromDeck.peekDeck().faceupCard(true);
        }
        this.updateBoard();
    }

canMove(fromDeck, toDeck, card) {
    const fromName = fromDeck.nameDeck();
    const toName = toDeck.nameDeck();
    const rankCard = card.rankCard();

    if (fromName === 'Stock') {
        if (this.SUITS.map(d => d.nameDeck()).includes(toName)) {
            return this.canMoveStockToSuit(toDeck, card);
        }
        if (this.PILES.map(d => d.nameDeck()).includes(toName)) {
            return this.canMoveStockToPile(toDeck, card);
        }
    }
    if (this.PILES.map(d => d.nameDeck()).includes(fromName)) {
        if (this.SUITS.map(d => d.nameDeck()).includes(toName)) {
            return this.canMovePileToSuit(fromDeck, toDeck);
        }
        if (this.PILES.map(d => d.nameDeck()).includes(toName)) {
            return this.canMovePileToPile(fromDeck, toDeck);
        }
    }
    if (this.SUITS.map(d => d.nameDeck()).includes(fromName) && this.PILES.map(d => d.nameDeck()).includes(toName)) {
        return this.canMoveSuitToPile(fromDeck, toDeck);
    }
    return false;
}

canMoveStockToSuit(toDeck, card) {
    const rankSuitTop = toDeck.isEmpty() ? 0 : toDeck.peekDeck().rankCard();
    return card.rankCard() === rankSuitTop + 1 || card.rankCard() === 1;
}

canMoveStockToPile(toDeck, card) {
    const rankPileTop = toDeck.isEmpty() ? 0 : toDeck.peekDeck().rankCard();
    return card.rankCard() === rankPileTop + 1 || card.rankCard() === 13;
}

canMovePileToSuit(fromDeck, toDeck) {
    const rankPileTop = fromDeck.peekDeck().rankCard();
    const rankSuitTop = toDeck.isEmpty() ? 0 : toDeck.peekDeck().rankCard();
    return rankPileTop === rankSuitTop + 1 || rankPileTop === 1;
}

canMovePileToPile(fromDeck, toDeck) {
    const rankPileTop = fromDeck.peekDeck().rankCard();
    const rankTargetPileTop = toDeck.isEmpty() ? 0 : toDeck.peekDeck().rankCard();
    return rankPileTop === rankTargetPileTop + 1;
}

canMoveSuitToPile(fromDeck, toDeck) {
    const rankSuitTop = fromDeck.peekDeck().rankCard();
    const rankPileTop = toDeck.isEmpty() ? 0 : toDeck.peekDeck().rankCard();
    return rankSuitTop === rankPileTop + 1 || rankSuitTop === 13;
}

    updateBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = ''; // Clear previous board

        const decks = [this.Stock, this.Discard, ...this.SUITS, ...this.PILES];

        decks.forEach(deck => {
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
            content.innerHTML = deck.toString();
            deckDiv.appendChild(content);

            // Add event listeners
            deckDiv.addEventListener('click', () => this.handleDeckClick(deck));
            deckDiv.addEventListener('dragstart', (event) => this.handleDragStart(event, deck));
            deckDiv.addEventListener('dragover', (event) => this.handleDragOver(event));
            deckDiv.addEventListener('drop', (event) => this.handleDrop(event, deck));

            // Append the deckDiv to the gameBoard
            gameBoard.appendChild(deckDiv);
        });
    }

    handleDeckClick(deck) {
        if (this.selectedCard === null) {
            // Select card from the clicked deck
            if (!deck.isEmpty()) {
                this.selectedCard = deck.popDeck();
                this.updateBoard(); // Update board to reflect changes
            }
        } else {
            // Move the selected card to the clicked deck
            try {
                this.move(this.selectedCard.deckName, deck.nameDeck());
                this.selectedCard = null;
                this.updateBoard(); // Update board to reflect changes
            } catch (error) {
                console.error(error.message);
                // Return the card to its original deck if the move fails
                deck.pushDeck(this.selectedCard);
                this.selectedCard = null;
                this.updateBoard(); // Update board to reflect changes
            }
        }
    }

    handleDragStart(event, deck) {
        if (!deck.isEmpty()) {
            event.dataTransfer.setData('text/plain', deck.nameDeck());
            event.dataTransfer.effectAllowed = 'move';
        }
    }

    handleDragOver(event) {
        event.preventDefault(); // Allow drop
        event.dataTransfer.dropEffect = 'move';
    }

    handleDrop(event, targetDeck) {
        event.preventDefault();
        const sourceDeckName = event.dataTransfer.getData('text/plain');
        try {
            this.move(sourceDeckName, targetDeck.nameDeck());
            this.updateBoard(); // Update board to reflect changes
        } catch (error) {
            console.error(error.message);
        }
    }
}

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
