class Game {
    constructor() {
        this.startMessage = 'Welcome to Klondike!';
        this.endMessage = 'Thank you for playing';
        this.gameOn = true;
        this.Stock = new Deck('Stock');
        this.Discard = new Deck('Discard');
        this.SUITS = [
            new Deck('Spades'),
            new Deck('Hearts'),
            new Deck('Diamonds'),
            new Deck('Clubs')
        ];
        this.PILES = [
            new Deck('Pile 1'),
            new Deck('Pile 2'),
            new Deck('Pile 3'),
            new Deck('Pile 4'),
            new Deck('Pile 5'),
            new Deck('Pile 6'),
            new Deck('Pile 7')
        ];
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
        for (let i = 0; i < this.PILES.length; i++) {
            for (let j = 0; j <= i; j++) {
                const card = this.Stock.popDeck();
                card.faceupCard(j === i);
                this.PILES[i].pushDeck(card);
            }
        }

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
        for (let suit of suits) {
            for (let rank of ranks) {
                deck.pushDeck(new Card(suit, rank));
            }
        }
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
    }

    discard() {
        if (this.Stock.isEmpty()) {
            throw new Error('Stock Empty');
        }
        const relay = new Deck("relay_deck");
        const max = 3;
        const moves = Math.min(max, this.Stock.sizeDeck());
        for (let n = 0; n < moves; n++) {
            this.Stock.peekDeck().faceupCard(false);
            relay.pushDeck(this.Stock.popDeck());
            this.Discard.pushDeck(relay.popDeck());
        }
        if (!this.Stock.isEmpty()) {
            this.Stock.peekDeck().faceupCard(true);
        }
    }

    board() {
        if (!this.Stock || !this.Discard || this.SUITS.length === 0 || this.PILES.length === 0) {
            console.log('No Cards');
        } else {
            console.log(`${this.Stock.nameDeck()}: ${this.Stock}`);
            console.log(`${this.Discard.nameDeck()}: ${this.Discard}`);
            this.SUITS.forEach(deck => console.log(`${deck.nameDeck()}: ${deck}`));
            this.PILES.forEach(deck => console.log(`${deck.nameDeck()}: ${deck}`));
        }
    }

    cheat() {
        if (!this.Stock || !this.Discard || this.SUITS.length === 0 || this.PILES.length === 0) {
            console.log('No Cards');
        } else {
            console.log(`${this.Stock.nameDeck()}: ${JSON.stringify(this.Stock)}`);
            console.log(`${this.Discard.nameDeck()}: ${JSON.stringify(this.Discard)}`);
            this.SUITS.forEach(deck => console.log(`${deck.nameDeck()}: ${JSON.stringify(deck)}`));
            this.PILES.forEach(deck => console.log(`${deck.nameDeck()}: ${JSON.stringify(deck)}`));
        }
    }

    done(message) {
        this.gameOn = false;
        console.log(message);
    }

    load(data) {
        try {
            const lines = data.split('\n').filter(line => line.trim() !== '');
            const Decks = [];
            lines.forEach(line => {
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
                Decks.push(deck);
            });
            // Assign decks to game properties (example):
            this.Stock = Decks.find(deck => deck.nameDeck() === 'Stock');
            this.Discard = Decks.find(deck => deck.nameDeck() === 'Discard');
            this.SUITS = Decks.filter(deck => ['Spades', 'Hearts', 'Diamonds', 'Clubs'].includes(deck.nameDeck()));
            this.PILES = Decks.filter(deck => !['Stock', 'Discard', 'Spades', 'Hearts', 'Diamonds', 'Clubs'].includes(deck.nameDeck()));
        } catch (err) {
            console.error('Error loading game:', err);
        }
    }

    save() {
        try {
            const Decks = [this.Stock, this.Discard, ...this.SUITS, ...this.PILES];
            const data = Decks.map(deck => {
                return `${deck.nameDeck()} ${deck.toJSON()}`;
            }).join('\n');
            // Save to localStorage
            localStorage.setItem('savedGame', data);
            console.log('Game saved');
        } catch (err) {
            console.error('Error saving game:', err);
        }
    }

    move(fromDeckName, toDeckName) {
        const fromDeck = [this.Stock, ...this.SUITS, ...this.PILES].find(deck => deck.nameDeck() === fromDeckName);
        const toDeck = [this.SUITS, ...this.PILES].find(deck => deck.nameDeck() === toDeckName);
        if (!fromDeck || !toDeck) {
            throw new Error('Invalid deck names');
        }
        const relay = new Deck("relay_deck");
        const stockName = 'Stock';
        const suitNames = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
        const pileNames = Array.from({ length: 7 }, (_, i) => `Pile ${i + 1}`);

        if (fromDeck.nameDeck() === stockName && suitNames.includes(toDeck.nameDeck())) {
            // Logic for Stock to Suit
            const rankStockTop = fromDeck.peekDeck().rankCard();
            const rankSuitTop = toDeck.isEmpty() ? 0 : toDeck.peekDeck().rankCard();
            const isAce = rankStockTop === 1;
            const canMove = rankStockTop === rankSuitTop + 1;
            if (isAce || canMove) {
                const card = fromDeck.popDeck();
                card.faceupCard(true);
                toDeck.pushDeck(card);
                if (!fromDeck.isEmpty()) {
                    fromDeck.peekDeck().faceupCard(true);
                }
            } else {
                throw new Error('Invalid move');
            }
        } else if (fromDeck.nameDeck() === stockName && pileNames.includes(toDeck.nameDeck())) {
            // Logic for Stock to Pile
            const rankStockTop = fromDeck.peekDeck().rankCard();
            const rankPileTop = toDeck.isEmpty() ? 0 : toDeck.peekDeck().rankCard();
            const isKing = rankStockTop === 13;
            const canMove = rankPileTop === rankStockTop + 1;
            if (isKing || canMove) {
                const card = fromDeck.popDeck();
                card.faceupCard(true);
                toDeck.pushDeck(card);
                if (!fromDeck.isEmpty()) {
                    fromDeck.peekDeck().faceupCard(true);
                }
            } else {
                throw new Error('Invalid move');
            }
        } else if (pileNames.includes(fromDeck.nameDeck()) && suitNames.includes(toDeck.nameDeck())) {
            // Logic for Pile to Suit
            const rankPileTop = fromDeck.peekDeck().rankCard();
            const rankSuitTop = toDeck.isEmpty() ? 0 : toDeck.peekDeck().rankCard();
            const isAce = rankPileTop === 1;
            const canMove = rankPileTop === rankSuitTop + 1;
            if (isAce || canMove) {
                const card = fromDeck.popDeck();
                card.faceupCard(true);
                toDeck.pushDeck(card);
                if (!fromDeck.isEmpty()) {
                    fromDeck.peekDeck().faceupCard(true);
                }
            } else {
                throw new Error('Invalid move');
            }
        } else if (pileNames.includes(fromDeck.nameDeck())) {
            // Logic for Pile to Pile
            const hidden = "??";
            const isKing = 13;
            const relay = new Deck("relay_deck");
            while (!fromDeck.isEmpty() && fromDeck.peekDeck().toString() !== hidden) {
                relay.pushDeck(fromDeck.popDeck());
            }
            const isKingsThrone = relay.peekDeck().rankCard() === isKing && toDeck.isEmpty();
            const rankToPileTop = toDeck.isEmpty() ? 0 : toDeck.peekDeck().rankCard();
            let legal = false;
            while (!legal && !relay.isEmpty()) {
                const rankFromPileTop = relay.peekDeck().rankCard();
                legal = rankFromPileTop + 1 === rankToPileTop;
                if (!legal) {
                    fromDeck.pushDeck(relay.popDeck());
                }
            }
            if (isKingsThrone || legal) {
                while (!relay.isEmpty()) {
                    toDeck.pushDeck(relay.popDeck());
                }
                if (!fromDeck.isEmpty()) {
                    fromDeck.peekDeck().faceupCard(true);
                }
            } else {
                while (!relay.isEmpty()) {
                    fromDeck.pushDeck(relay.popDeck());
                }
                throw new Error('Invalid move');
            }
        } else {
            throw new Error('Invalid move');
        }
    }

    updateBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = ''; // Clear previous board
        const decks = [this.Stock, this.Discard, ...this.SUITS, ...this.PILES];
        decks.forEach(deck => {
            const div = document.createElement('div');
            div.className = 'deck';
            div.id = deck.nameDeck();
            div.innerHTML = deck.toString();
            div.addEventListener('click', () => this.handleDeckClick(deck));
            gameBoard.appendChild(div);
        });
    }

    handleDeckClick(deck) {
        console.log(`Deck clicked: ${deck.nameDeck()}`);
        // Implement logic for handling clicks on deck elements
    }
}

// Initialize game
const game = new Game();

// Handle user interactions
document.getElementById('reset-button').addEventListener('click', () => {
    game.reset();
    game.updateBoard();
    document.getElementById('status').innerText = 'Game reset';
});

document.getElementById('discard-button').addEventListener('click', () => {
    game.discard();
    game.updateBoard();
    document.getElementById('status').innerText = 'Discarded cards from stock';
});

document.getElementById('board-button').addEventListener('click', () => {
    game.board();
    game.updateBoard();
    document.getElementById('status').innerText = 'Board updated';
});

document.getElementById('cheat-button').addEventListener('click', () => {
    game.cheat();
    document.getElementById('status').innerText = 'Cheat mode activated';
});

document.getElementById('save-button').addEventListener('click', () => {
    game.save();
    document.getElementById('status').innerText = 'Game saved';
});

document.getElementById('load-button').addEventListener('click', () => {
    const data = localStorage.getItem('savedGame');
    if (data) {
        game.load(data);
        game.updateBoard();
        document.getElementById('status').innerText = 'Game loaded';
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
