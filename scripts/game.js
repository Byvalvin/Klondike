class Game {
    constructor() {
        this.startMessage = 'Welcome to Klondike!';
        this.endMessage = 'Thank you for playing';
        this.gameOn = true;
        this.Stock = new Deck('Stock');
        this.Discard = new Deck('Discard');
        this.SUITS = ['Spades', 'Hearts', 'Diamonds', 'Clubs'].map(name => new Deck(name));
        this.PILES = Array.from({ length: 7 }, (_, i) => new Deck(`Pile ${i + 1}`));
        this.selectedCards = null; // Track the currently selected cards
        this.maxCardValue = 13;
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

    moveCheck(fromDeckName, toDeckName, deckCards) {
        const fromDeck = [this.Stock, ...this.SUITS, ...this.PILES].find(deck => deck.nameDeck() === fromDeckName);
        const toDeck = [...this.SUITS, ...this.PILES].find(deck => deck.nameDeck() === toDeckName);

        if (!fromDeck || !toDeck) {
            throw new Error('Invalid deck names');
        }
        if (!deckCards) {
            throw new Error('No card(s) to move');
        }
        deckCards.allFaceup(); // Ensure all cards in deckCards are face up

        return [fromDeck, toDeck];
    }

    move(fromDeckName, toDeckName, deckCards) { // Move to non-pile
        const [fromDeck, toDeck] = this.moveCheck(fromDeckName, toDeckName, deckCards);

        if (this.canMove(fromDeck, toDeck, deckCards.peekDeck())) {
            toDeck.pushDeck(deckCards.popDeck());
        } else {
            throw new Error('Invalid move');
        }

        // Flip next hidden card or return remaining cards if any exist
        if (!fromDeck.isEmpty() && deckCards.isEmpty()) {
            fromDeck.peekDeck().faceupCard(true);
        } else {
            fromDeck.addDeck(deckCards);
        }
        this.updateBoard();
    }

    pileMove(fromDeckName, toDeckName, deckCards) {
        const [fromDeck, toDeck] = this.moveCheck(fromDeckName, toDeckName, deckCards);

        const reverseDeck = deckCards.getReverseDeck();
        let stopValue = null;
        while (!reverseDeck.isEmpty() && stopValue === null) {
            if (this.canMovePileToPile(fromDeck, toDeck, reverseDeck.peekDeck())) {
                stopValue = reverseDeck.peekDeck().rankCard();
            } else {
                reverseDeck.popDeck();
            }
        }

        // Get only the cards that can move, leave the rest in deckCards
        if (stopValue !== null) {
            const moveableCards = [];
            while (!deckCards.isEmpty() && deckCards.peekDeck().rankCard() <= stopValue) {
                moveableCards.unshift(deckCards.popDeck());
            }
            toDeck.updateDeck(moveableCards);
        } else {
            throw new Error('Invalid move');
        }

        // Show next hidden card or return remaining cards to fromDeck
        if (!fromDeck.isEmpty() && deckCards.isEmpty()) {
            fromDeck.peekDeck().faceupCard(true);
        } else {
            fromDeck.addDeck(deckCards);
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
                return this.canMovePileToSuit(fromDeck, toDeck, card);
            }
            if (this.PILES.map(d => d.nameDeck()).includes(toName)) {
                return this.canMovePileToPile(fromDeck, toDeck, card);
            }
        }
        if (this.SUITS.map(d => d.nameDeck()).includes(fromName) && this.PILES.map(d => d.nameDeck()).includes(toName)) {
            return this.canMoveSuitToPile(fromDeck, toDeck, card);
        }
        return false;
    }

    canMoveStockToSuit(toDeck, card) {
        const rankSuitTop = toDeck.isEmpty() ? 0 : toDeck.peekDeck().rankCard();
        return (card.rankCard() === rankSuitTop + 1 || card.rankCard() === 1) && card.suitCard() === toDeck.nameDeck();
    }

    canMoveStockToPile(toDeck, card) {
        const rankPileTop = toDeck.isEmpty() ? 13 : toDeck.peekDeck().rankCard();
        return card.rankCard() + 1 === rankPileTop || card.rankCard() === 13 && toDeck.isEmpty();
    }

    canMovePileToSuit(fromDeck, toDeck, card) {
        const rankPileTop = card.rankCard();
        const rankSuitTop = toDeck.isEmpty() ? 0 : toDeck.peekDeck().rankCard();
        return (rankPileTop === rankSuitTop + 1 || rankPileTop === 1) && card.suitCard() === toDeck.nameDeck();
    }

    canMovePileToPile(fromDeck, toDeck, card) {
        const rankPileTop = card.rankCard();
        const rankTargetPileTop = toDeck.isEmpty() ? 13 : toDeck.peekDeck().rankCard();
        return rankPileTop + 1 === rankTargetPileTop || rankPileTop === 13 && toDeck.isEmpty();
    }

    canMoveSuitToPile(fromDeck, toDeck, card) {
        const rankSuitTop = card.rankCard();
        const rankPileTop = toDeck.isEmpty() ? 13 : toDeck.peekDeck().rankCard();
        return rankSuitTop + 1 === rankPileTop || rankSuitTop === 13 && toDeck.isEmpty();
    }

    updateBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = ''; // Clear previous board

        // Create a container for stock and discard
        const topContainer = document.createElement('div');
        topContainer.className = 'top-container';

        const stockDiv = this.createDeckDiv(this.Stock);
        const discardDiv = this.createDeckDiv(this.Discard);

        // Append stock and discard to top container
        topContainer.appendChild(stockDiv);
        topContainer.appendChild(discardDiv);
        gameBoard.appendChild(topContainer);

        // Create a container for suits
        const suitContainer = document.createElement('div');
        suitContainer.className = 'suit-container';

        // Append suits
        this.SUITS.forEach(suitDeck => {
            const suitDiv = this.createDeckDiv(suitDeck);
            suitContainer.appendChild(suitDiv);
        });
        gameBoard.appendChild(suitContainer);

        // Create a container for piles
        const pileContainer = document.createElement('div');
        pileContainer.className = 'pile-container';

        // Append piles
        this.PILES.forEach(pileDeck => {
            const pileDiv = this.createDeckDiv(pileDeck);
            pileContainer.appendChild(pileDiv);
        });
        gameBoard.appendChild(pileContainer);
    }

    createDeckDiv(deck) {
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

        return deckDiv;
    }

    handleDeckClick(deck) {
        if (this.selectedCards === null) {
            if (!deck.isEmpty()) {
                this.selectedCards = new Deck("Selected");
                if (deck.nameDeck().split(" ")[0] === "Pile") {
                    const orderedCards = [];
                    while (!deck.isEmpty() && deck.peekDeck().isFaceup()) {
                        orderedCards.unshift(deck.popDeck());
                    }
                    this.selectedCards.setDeck(orderedCards);
                } else {
                    this.selectedCards.pushDeck(deck.popDeck());
                }
                this.selectedCards.peekDeck().originalDeck = deck; // Store original deck for move back if needed
                this.updateBoard(); // Update board to reflect changes
            }
        } else {
            try {
                if (deck.nameDeck().split(" ")[0] === "Pile") {
                    this.pileMove(this.selectedCards.peekDeck().originalDeck.nameDeck(), deck.nameDeck(), this.selectedCards);
                } else {
                    this.move(this.selectedCards.peekDeck().originalDeck.nameDeck(), deck.nameDeck(), this.selectedCards);
                }
                this.selectedCards = null;
            } catch (error) {
                console.error(error.message);
                if (this.selectedCards) {
                    this.selectedCards.peekDeck().originalDeck.addDeck(this.selectedCards); // Add cards back to original
                    this.selectedCards = null;
                }
            }
            this.updateBoard(); // Update board to reflect changes
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

