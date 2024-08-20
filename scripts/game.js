/**
 * Represents a Klondike Solitaire game.
 */
class Game {
    /**
     * Creates an instance of Game.
     */
    constructor() {
        this.startMessage = 'Welcome to Klondike!';
        this.endMessage = 'Thank you for playing';
        this.gameOn = true;
        this.Stock = new Deck('Stock');
        this.Discard = new Deck('Discard');
        this.SUITS = ['Spades', 'Hearts', 'Diamonds', 'Clubs'].map(name => new Deck(name));
        this.Npiles = 4;
        this.PILES = Array.from({ length: this.Npiles }, (_, i) => new Deck(`Pile ${i + 1}`));
        this.selectedCards = null; // Track the currently selected cards
        this.maxCardValue = 13;
        this.initializeGame();
    }

    /**
     * Initializes the game by creating and shuffling the deck, and dealing cards.
     */
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

    /**
     * Creates a standard deck of 52 cards.
     * @returns {Deck} - The created deck.
     */
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

    /**
     * Resets the game by shuffling the discard pile back into the stock.
     * @throws {Error} - Throws an error if the stock is not empty.
     */
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

    /**
     * Moves cards from the stock to the discard pile.
     * @throws {Error} - Throws an error if the stock is empty.
     */
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

    /**
     * Displays the current state of the game board.
     */
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

    /**
     * Displays the current state of the game in JSON format.
     */
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

    /**
     * Checks if the game is in a valid state.
     * @returns {boolean} - True if the game state is valid, false otherwise.
     */
    isValidState() {
        return this.Stock && this.Discard && this.SUITS.length > 0 && this.PILES.length > 0;
    }

    /**
     * Ends the game with a message.
     * @param {string} message - The message to display.
     */
    done(message) {
        this.gameOn = false;
        console.log(message);
    }

    /**
     * Loads a saved game state from a string.
     * @param {string} data - The string containing the saved game state.
     */
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

    /**
     * Saves the current game state to local storage.
     */
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

    /**
     * Checks if a move between decks is valid.
     * @param {string} fromDeckName - The name of the source deck.
     * @param {string} toDeckName - The name of the target deck.
     * @param {Deck} deckCards - The cards to move.
     * @returns {[Deck, Deck]} - The source and target decks.
     * @throws {Error} - Throws an error if the move is invalid.
     */
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

    /**
     * Moves cards from one deck to another.
     * @param {string} fromDeckName - The name of the source deck.
     * @param {string} toDeckName - The name of the target deck.
     * @param {Deck} deckCards - The cards to move.
     * @throws {Error} - Throws an error if the move is invalid.
     */
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

    /**
     * Moves a pile of cards to another pile.
     * @param {string} fromDeckName - The name of the source pile.
     * @param {string} toDeckName - The name of the target pile.
     * @param {Deck} deckCards - The cards to move.
     * @throws {Error} - Throws an error if the move is invalid.
     */
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

    /**
     * Checks if a move between decks is valid.
     * @param {Deck} fromDeck - The source deck.
     * @param {Deck} toDeck - The target deck.
     * @param {Card} card - The card to move.
     * @returns {boolean} - True if the move is valid, false otherwise.
     */
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

    /**
     * Updates the game board's display.
     */
    updateBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = ''; // Clear previous board

        // Create containers
        const topContainer = this.createContainer('top-container');
        const suitContainer = this.createContainer('suit-container');
        const pileContainer = this.createContainer('pile-container');

        // Append decks to containers
        topContainer.appendChild(this.createDeckDiv(this.Stock));
        topContainer.appendChild(this.createDeckDiv(this.Discard));
        this.SUITS.forEach(suitDeck => suitContainer.appendChild(this.createDeckDiv(suitDeck)));
        this.PILES.forEach(pileDeck => pileContainer.appendChild(this.createDeckDiv(pileDeck)));

        // Append containers to game board
        gameBoard.appendChild(topContainer);
        gameBoard.appendChild(suitContainer);
        gameBoard.appendChild(pileContainer);
    }

    createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        
        if (card.isFaceup()) {
            const rankAndSuitSymbol = card.toStringSymbol(); // Use method to get suit symbol
            const className = `card-symbol ${card.suit}`;
            cardElement.innerHTML = `
                <div class="${className}">${rankAndSuitSymbol}</div>
            `;
        } else {
            cardElement.classList.add('face-down');
            cardElement.innerHTML = ''; // Face-down cards have no text
        }
        
        return cardElement;
    }

 
    /*
    createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
    
        if (card.isFaceup()) {
            cardElement.innerText = card.toString();
        } else {
            cardElement.classList.add('face-down');
            cardElement.innerText = ''; // Face-down cards have no text
        }
    
        return cardElement;
    }
    */
    
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
    
        // Add card elements
        const cards = deck.getCardsList().reverse();
        cards.forEach(card => {
            const cardElement = this.createCardElement(card);
            content.appendChild(cardElement);
        });
    
        deckDiv.appendChild(content);
    
        // Add event listeners
        deckDiv.addEventListener('click', () => this.handleDeckClick(deck));
        deckDiv.addEventListener('dragstart', (event) => this.handleDragStart(event, deck));
        deckDiv.addEventListener('dragover', (event) => this.handleDragOver(event));
        deckDiv.addEventListener('drop', (event) => this.handleDrop(event, deck));
    
        return deckDiv;
    }

    /**
     * Creates a container div with a specified class name.
     * @param {string} className - The class name for the container.
     * @returns {HTMLElement} - The created container div.
     */
    createContainer(className) {
        const container = document.createElement('div');
        container.className = className;
        return container;
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

    /*
    handleDragStart(event, deckName, cardIndex) {
        event.dataTransfer.setData('text/plain', JSON.stringify({ deckName, cardIndex }));
        event.dataTransfer.effectAllowed = 'move';
    }
    */

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }


    handleDrop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        const { deckName, card } = JSON.parse(data);
        const fromDeck = [this.Stock, ...this.SUITS, ...this.PILES].find(deck => deck.nameDeck() === deckName);
        
        if (fromDeck) {
            const cardToMove = new Card(card[0], card[1]);
            cardToMove.faceupCard(card[2] === '+'); // Set card visibility
            
            const toDeckName = event.target.id;
            const toDeck = [...this.SUITS, ...this.PILES].find(deck => deck.nameDeck() === toDeckName);
            
            if (toDeck) {
                this.move(fromDeck.nameDeck(), toDeck.nameDeck(), new Deck('temp').pushDeck(cardToMove));
            }
        }
    }


    // Handle drag start
    handleDragStart(event, deck) {
        if (!deck.isEmpty()) {
            const card = deck.peekDeck();
            event.dataTransfer.setData('text/plain', JSON.stringify({
                deckName: deck.nameDeck(),
                card: card.toJSON() // Serialize card for drag
            }));
            event.dataTransfer.effectAllowed = 'move';
            this.startDrag(card, event); // Start dragging visual
        }
    }


    // Start dragging visual
    startDrag(card, event) {
        const dragCardElement = this.createCardElement(card);
        dragCardElement.style.position = 'absolute';
        dragCardElement.style.zIndex = 1000;
        dragCardElement.style.pointerEvents = 'none'; // Make it non-interactive during drag
        document.body.appendChild(dragCardElement);
    
        const moveCard = (e) => {
            dragCardElement.style.left = e.pageX + 'px';
            dragCardElement.style.top = e.pageY + 'px';
        };
    
        const stopDrag = () => {
            document.body.removeChild(dragCardElement);
            document.removeEventListener('mousemove', moveCard);
            document.removeEventListener('mouseup', stopDrag);
        };
    
        document.addEventListener('mousemove', moveCard);
        document.addEventListener('mouseup', stopDrag);
    }    
}

