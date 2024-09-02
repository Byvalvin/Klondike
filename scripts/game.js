function flipCoin() {
    // Generate a random number between 0 and 1
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    return result;
}

/**
 * Represents a Klondike Solitaire game.
 */
class Game {
    /**
     * Creates an instance of Game.
     */
    constructor(diff) {
        console.log("got diff", diff);
        this.gameDiff = diff.difficulty;
        this.bonusScore = diff.score;
        
        this.pileOrder = diff.pileOrdering;
        this.Npiles = parameterScores.numberOfPiles[diff.numberOfPiles].value;
        this.acesFirst = diff.suitOrdering==="random" ? flipCoin() : diff.suitOrdering==="acesFirst";
        this.timerCount = parameterScores.timed[diff.timed].value; //"none" is 0 which means will count up indefinitely

        this.timer = this.timerCount * 60; // to track the time remaining if timerCount is not 0
        this.timeInterval = null;
        this.timeUp = false;
        
        this.startMessage = 'Welcome to Klondike!';
        this.endMessage = 'Thank you for playing';
        this.gameOn = true;
        this.Stock = new Deck('Stock');
        this.Discard = new Deck('Discard');
        this.SUITS = ['Spades', 'Hearts', 'Diamonds', 'Clubs'].map(name => new Deck(name));
        this.PILES = Array.from({ length: this.Npiles }, (_, i) => new Deck(`Pile ${i + 1}`));
        this.selectedCards = null; // Track the currently selected cards
        this.maxCardValue = 13;


        // for scoring system
        this.score = 0;
        this.baseScore = difficulties.reduce((acc, { name, minScore, maxScore }) => {
            const averageScore = (minScore + maxScore) / 2;
            acc[name] = averageScore;
            return acc;
        }, {});
        this.finishedGame = false;

        // extra
        this.deckStatus = ['Spades', 'Hearts', 'Diamonds', 'Clubs'].reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {});
        
        this.initializeGame();
    }

    // Function to count the number of complete suit decks
    countCompleteDecks() {
        // Use filter to find all complete decks and then count them
        return this.SUITS.filter(deck => deck.sizeDeck() === this.maxCardValue).length;
    }

    resetScoreDisplay(){
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.innerText = `Score: ${0}`;
        }
    }
    
    /**
     * Updates the score display on the page.
     */
    updateScoreDisplay() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.innerText = `Score: ${this.score}`;
        }

        const classScoreStart = 'score-play';
        const classScoreEnd = 'score-final';
        switch(this.gameOn){
            case false:
                scoreElement.classList.remove(classScoreStart);
                scoreElement.classList.add(classScoreEnd);
                break;
            case true:
                scoreElement.classList.remove(classScoreEnd);
                scoreElement.classList.add(classScoreStart);
                break;
            default:
                scoreElement.classList.remove(classScoreEnd);
                scoreElement.classList.add(classScoreStart);
            
        }
    }
    
    updateGameScore(from, to){
        console.log("uGS",from,to);
        if(this.SUITS.includes(to)){ // stock to suit, pile to suit
            this.score += to.sizeDeck();
            if(to.sizeDeck()===this.maxCardValue){
                if(!this.timeUp){
                    this.score *= (this.countCompleteDecks()+1);  
                }else{
                    this.score += (this.countCompleteDecks()+1);  
                }
                
            }
        }else if(this.SUITS.includes(to)){ // suit to pile
            console.log("score loss");
            this.score -= (from.sizeDeck()+1);
            if(from.sizeDeck()+1 === this.maxCardValue){
                if(!this.timeUp){
                    this.score /= (this.countCompleteDecks()+1);
                }else{
                    this.score -= (this.countCompleteDecks()+1);
                }
            }
        }  
        this.updateScoreDisplay(); // Update the UI with the new score
    }

    updateGameScoreFinal(){
        if(this.finshedGame && !this.timeUp){
            // full bonus
            this.score += this.bonusScore
            if(this.timerCount){ // there is a countdown timer
                this.score *= (1+(this.timer/this.timerCount))
            }else{
                this.score = this.timer <= 600 ? this.score + this.timer/60 : this.score;
            }
        }else if (this.finishedGame && this.timeUp){
            // half bonus
            this.score += this.bonusScore/2
        }
        this.updateScoreDisplay(); // Update the UI with the new score
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

        if (this.timerCount === 0) {
            this.startTimer();
        } else {
            this.startCountdownTimer();
        }

        // start score
        this.score = this.baseScore[this.gameDiff] || 0;
        this.updateScoreDisplay();
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
        this.stopTimer(); // Ensure timer is stopped when game ends
        document.getElementById('status').innerText = message;
        //this.resetScoreDisplay();
        //this.initializeGame();
        this.updateScoreDisplay()
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
                const [deckNameFirst, ...cardStrings] = line.split(' ');
                let deckName = deckNameFirst;
                if(deckName==='Pile'){
                    const pileNumber = cardStrings.shift();
                    deckName = `${deckNameFirst} ${pileNumber}`;
                }
                const deck = new Deck(deckName);
                cardStrings.forEach(cardString => {
                    if(cardString){
                        const cardRank = cardString[0];
                        const cardSuit = cardString[1];
                        const cardState = cardString[2];
                        const card = new Card(cardSuit, cardRank);
                        card.faceupCard(cardState === '+');
                        deck.pushDeck(card);
                    }

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
        console.log("score: ", this.score);
        const [fromDeck, toDeck] = this.moveCheck(fromDeckName, toDeckName, deckCards);

        if (this.canMove(fromDeck, toDeck, deckCards.peekDeck())) {
            toDeck.pushDeck(deckCards.popDeck());
            console.log("From1",fromDeck);
            this.updateGameScore(fromDeck, toDeck); // update score
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
        console.log("score: ", this.score);
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
            if(this.acesFirst){
                while (!deckCards.isEmpty() && deckCards.peekDeck().rankCard() <= stopValue) {
                    moveableCards.unshift(deckCards.popDeck());
                }
            }else{
                while (!deckCards.isEmpty() && deckCards.peekDeck().rankCard() >= stopValue) {
                    moveableCards.unshift(deckCards.popDeck());
                }
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

    areSameColor(card1, card2) {
        // Define the color groups
        const sameColor = {
            's': 'black', 
            'c': 'black', 
            'h': 'red', 
            'd': 'red'
        };
        // Check if both cards are of the same color
        return sameColor[card1.suit] === sameColor[card2.suit];
    }
    satisfyPileOrder(card, toDeck){
        switch(this.pileOrder){
            case "altColor": return toDeck.isEmpty() ? true : !this.areSameColor(card, toDeck.peekDeck());
            case "sameColor": return toDeck.isEmpty() ? true : this.areSameColor(card, toDeck.peekDeck());
            default: return true; // none
        }
    }

    canMoveStockToSuit(toDeck, card) {
        const rankSuitTop = toDeck.isEmpty() ? 0 : toDeck.peekDeck().rankCard();
        return (
            this.acesFirst ? 
                (card.rankCard() === rankSuitTop + 1 || card.rankCard() === 1) 
                : 
                (card.rankCard() === rankSuitTop - 1 || card.rankCard() === this.maxCardValue)
        ) && card.suitCard() === toDeck.nameDeck();
    }
    canMovePileToSuit(fromDeck, toDeck, card) {
        const rankPileTop = card.rankCard();
        const rankSuitTop = toDeck.isEmpty() ? 0 : toDeck.peekDeck().rankCard();
        return (
            this.acesFirst ?
                (rankPileTop === rankSuitTop + 1 || rankPileTop === 1)
                :
                (rankPileTop === rankSuitTop - 1 || rankPileTop === this.maxCardValue)
        ) && card.suitCard() === toDeck.nameDeck();
    }
    
    canMoveStockToPile(toDeck, card) {
        const rankPileTop = toDeck.isEmpty() ? (this.acesFirst ? this.maxCardValue : 1) : toDeck.peekDeck().rankCard();
        return (
            this.acesFirst ?
            (card.rankCard() + 1 === rankPileTop || card.rankCard() === this.maxCardValue && toDeck.isEmpty())
            :
            (card.rankCard() - 1 === rankPileTop || card.rankCard() === 1 && toDeck.isEmpty())
        ) && this.satisfyPileOrder(card, toDeck);
    }
    canMovePileToPile(fromDeck, toDeck, card) {
        const rankPileTop = card.rankCard();
        const rankTargetPileTop = toDeck.isEmpty() ? (this.acesFirst ? this.maxCardValue : 1) : toDeck.peekDeck().rankCard();
        return (
            this.acesFirst ? 
            (rankPileTop + 1 === rankTargetPileTop || rankPileTop === this.maxCardValue && toDeck.isEmpty()) 
            : 
            (rankPileTop - 1 === rankTargetPileTop || rankPileTop === 1 && toDeck.isEmpty())
        ) && this.satisfyPileOrder(card, toDeck);
    }
    canMoveSuitToPile(fromDeck, toDeck, card) {
        const rankSuitTop = card.rankCard();
        const rankPileTop = toDeck.isEmpty() ? (this.acesFirst ? this.maxCardValue : 1) : toDeck.peekDeck().rankCard();
        return (
            this.acesFirst ?
            (rankSuitTop + 1 === rankPileTop || rankSuitTop === this.maxCardValue && toDeck.isEmpty())
            :
            (rankSuitTop - 1 === rankPileTop || rankSuitTop === 1 && toDeck.isEmpty())
        ) && this.satisfyPileOrder(card, toDeck);
    }


    formatTime(seconds) {
        // Display in MM:SS format
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }    
    startTimer() {
        // Ensure no previous timer is running
        this.stopTimer();
        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.timer += 1;
            this.updateTimerDisplay();
        }, 1000); // Update every second
    }
    startCountdownTimer() {
        // Ensure no previous timer is running
        this.stopTimer();
        const now = Date.now();
        const endTime = now + this.timerCount * 60 * 1000; // Duration in milliseconds
    
        this.timerInterval = setInterval(() => {
            const remainingTime = endTime - Date.now();
    
            if (remainingTime <= 0) {
                clearInterval(this.timerInterval); // Stop the timer
                this.timer = 0;
                this.updateTimerDisplay();
                
                // Handle game end if needed
                this.timeUp = true;
                this.updateGameScoreFinal();
                this.done('Time is up!');
            } else {
                this.timer = Math.floor(remainingTime / 1000); // Update timer in seconds
                this.updateTimerDisplay();
            }
        }, 1000); // Update every second
    }
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    resetTimer() {
        this.stopTimer();
        if (this.timerCount === 0) {
            this.startTimer();
        } else {
            this.startCountdownTimer();
        }
    }
    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.innerText = this.formatTime(this.timer);
        }
    }


    /**
     * Checks if the game has been won.
     * @returns {boolean} - True if all suit decks have 13 cards, false otherwise.
     */
    checkWin() {
        return this.SUITS.every(deck => deck.sizeDeck() === this.maxCardValue);
    }

    // deck finality
    updateDeckStatus(){
        this.SUITS.forEach((suitDeck)=>{
            if(suitDeck.sizeDeck()===this.maxCardValue){
                this.deckStatus[suitDeck.nameDeck()] = true;
            }
        });      
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

        // update deck extra
        this.updateDeckStatus();

        // Append decks to containers
        topContainer.appendChild(this.createDeckDiv(this.Stock));
        topContainer.appendChild(this.createDeckDiv(this.Discard));
        this.SUITS.forEach(suitDeck => suitContainer.appendChild(this.createDeckDiv(suitDeck)));
        this.PILES.forEach(pileDeck => pileContainer.appendChild(this.createDeckDiv(pileDeck)));

        // Append containers to game board
        gameBoard.appendChild(topContainer);
        gameBoard.appendChild(suitContainer);
        gameBoard.appendChild(pileContainer);

        // Update timer display if visible
        if (this.timer) {
            this.updateTimerDisplay();
        }
        
        // Check for win condition
        if (this.checkWin()) {
            this.finishedGame = true;
            this.gameOn = false;
            this.updateGameScoreFinal();
            this.done('Congratulations! You won the game!');
            console.log("final score: ",this.score);
        }
        
    }


    createDeckDiv(deck) {
        const deckDiv = document.createElement('div');
        deckDiv.className = 'deck';
        deckDiv.id = deck.nameDeck();
        deckDiv.draggable = false; // Disable default drag behavior

        const isSuit = ['Spades', 'Hearts', 'Diamonds', 'Clubs'].includes(deck.nameDeck());
        const isPile = deck.nameDeck().split(" ")[0] === "Pile";
        
        // Add button and specific classes for Stock and Discard Decks
        if(deck === this.Stock || deck === this.Discard){
            // Create a button for Stock and Discard decks
            const button = document.createElement('button');
            button.className = 'deck-button';
            button.innerText = deck.nameDeck();
            
            if (deck === this.Stock) {
                button.addEventListener('click', (event) => {
                    event.stopPropagation(); // Stop the click event from bubbling up to the deckDiv
                    this.reset();
                });
                deckDiv.classList.add('stock-deck');
                button.classList.add('stock-button');
                
            } else {
                button.addEventListener('click', (event) => {
                    event.stopPropagation(); // Stop the click event from bubbling up to the deckDiv
                    this.discard();
                });
                deckDiv.classList.add('discard-deck');
                button.classList.add('discard-button');
            }
            deckDiv.appendChild(button);
        } else{
            if(isSuit && this.deckStatus[deck.nameDeck()]){
                //Create and add deck symbol
                const suitDeckBack = document.createElement('div');
                suitDeckBack.className = 'deck-symbol';
                const deckSymbol = deck.peekDeck().symbolCard();
                suitDeckBack.innerText = `${deckSymbol}`;
                deckDiv.appendChild(suitDeckBack);
            }else{
                // Create and add the label
                const label = document.createElement('div');
                label.className = 'deck-label';
                label.innerText = deck.nameDeck();
                deckDiv.appendChild(label);
            }
        }

        
                
        // Add the deck content
        const content = document.createElement('div');
        content.className = 'deck-content';
        if(isSuit){
            deckDiv.classList.add(this.deckStatus[deck.nameDeck()] ? 'deck-close':'deck-open');
            deckDiv.classList.remove(this.deckStatus[deck.nameDeck()] ? 'deck-open':'deck-close');
            if(this.deckStatus[deck.nameDeck()]){
                content.classList.add('hidden');
            }else{
                content.classList.remove('hidden');
            }
        }

        if(isPile){
            deckDiv.classList.add('deck-pile');
        }
        
        
        // Add card elements
        const cards = deck.getCardsList().reverse();
        cards.forEach(card => {
            const cardElement = card.createCardElement();
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

    handleDeckHighlight(deck){
        // Highlight the clicked deck
        const deckDiv = document.getElementById(deck.nameDeck());
        deckDiv.classList.add('clicked');
    
        // Reset the highlighting after a short delay
        setTimeout(() => {
            deckDiv.classList.remove('clicked');
        }, 300);
    }

    handleDeckClick(deck) {
        const deckName = deck.nameDeck();
        if(['Spades', 'Hearts', 'Diamonds', 'Clubs'].includes(deckName) && this.deckStatus[deckName]){
            this.deckStatus[deckName] = false;
        }
        this.handleDeckHighlight(deck);
        if (this.selectedCards === null) {
                if (!deck.isEmpty() && deck !== this.Discard) {
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

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }
    handleDrop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData('application/json');
        const { deckName, cards } = JSON.parse(data);
        const fromDeck = [this.Stock, ...this.SUITS, ...this.PILES].find(deck => deck.nameDeck() === deckName);
    
        if (fromDeck) {
            const cardDeck = new Deck('temp');
            cards.forEach(cardData => {
                const card = new Card(cardData.suit, cardData.rank);
                card.faceupCard(cardData.faceUp);
                cardDeck.pushDeck(card);
            });
    
            const toDeckName = event.target.id;
            const toDeck = [...this.SUITS, ...this.PILES].find(deck => deck.nameDeck() === toDeckName);
            
            if (toDeck) {
                this.move(fromDeck.nameDeck(), toDeck.nameDeck(), cardDeck);
            }
        }
    }
    // Handle drag start
    handleDragStart(event, deck) {
        if (!deck.isEmpty()) {
            const cardsToDrag = deck.getCardsList().map(card => ({
                suit: card.suitCard(),
                rank: card.rankCard(),
                faceUp: card.isFaceup()
            }));
            event.dataTransfer.setData('application/json', JSON.stringify({
                deckName: deck.nameDeck(),
                cards: cardsToDrag
            }));
            event.dataTransfer.effectAllowed = 'move';
            this.startDrag(cardsToDrag, event); // Pass the cards to startDrag
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

