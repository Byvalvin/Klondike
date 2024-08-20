/**
 * Represents a deck of cards.
 */
class Deck {
    /**
     * Creates an instance of Deck.
     * @param {string} name - The name of the deck.
     */
    constructor(name) {
        this.cards = [];
        this.name = name;
    }

    /**
     * Returns the name of the deck.
     * @returns {string} - The name of the deck.
     */
    nameDeck() {
        return this.name;
    }

    /**
     * Returns the number of cards in the deck.
     * @returns {number} - The number of cards in the deck.
     */
    sizeDeck() {
        return this.cards.length;
    }

    /**
     * Checks if the deck is empty.
     * @returns {boolean} - True if the deck is empty, false otherwise.
     */
    isEmpty() {
        return this.sizeDeck() === 0;
    }

    /**
     * Peeks at the top card of the deck without removing it.
     * @returns {Card} - The top card of the deck.
     * @throws {Error} - Throws an error if the deck is empty.
     */
    peekDeck() {
        if (this.isEmpty()) {
            throw new Error('Deck is empty');
        }
        return this.cards[this.cards.length - 1];
    }

    /**
     * Adds a card to the top of the deck.
     * @param {Card} card - The card to add.
     * @throws {TypeError} - Throws an error if the argument is not a Card instance.
     */
    pushDeck(card) {
        if (!(card instanceof Card)) {
            throw new TypeError('Argument must be an instance of Card');
        }
        this.cards.push(card);
    }

    /**
     * Removes and returns the top card of the deck.
     * @returns {Card} - The removed card.
     * @throws {Error} - Throws an error if the deck is empty.
     */
    popDeck() {
        if (this.isEmpty()) {
            throw new Error('Deck is empty');
        }
        return this.cards.pop();
    }

    /**
     * Returns all face-up cards from the deck.
     * @returns {Card[]} - An array of face-up cards.
     */
    getVisibleCards() {
        const visibleCards = [];
        while (!this.isEmpty() && this.peekDeck().isFaceup()) {
            visibleCards.push(this.popDeck());
        }
        return visibleCards;
    }

    /**
     * Returns a copy of the deck's cards.
     * @returns {Card[]} - A copy of the deck's cards.
     */
    getCardsList() {
        return this.cards.slice();
    }

    /**
     * Returns a string representation of the deck.
     * @returns {string} - The string representation of the deck.
     */
    toString() {
        return ` [ ${this.cards.map(card => card.toString()).reverse().join(' ')} ]`;
    }

    /**
     * Returns a JSON representation of the deck.
     * @returns {string} - The JSON representation of the deck.
     */
    toJSON() {
        return this.cards.map(card => card.toJSON()).join(' ');
    }

    /**
     * Shuffles the deck using the Fisher-Yates algorithm.
     */
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    /**
     * Adds all cards from another deck to this deck.
     * @param {Deck} deck - The deck to add cards from.
     * @throws {TypeError} - Throws an error if the argument is not a Deck instance.
     */
    addDeck(deck) {
        if (!(deck instanceof Deck)) {
            throw new TypeError('Argument must be an instance of Deck');
        }
        this.cards = this.cards.concat(deck.cards);
    }

    /**
     * Adds an array of cards to the deck.
     * @param {Card[]} cardsToAdd - The cards to add.
     * @throws {TypeError} - Throws an error if the argument is not an array of Card instances.
     */
    updateDeck(cardsToAdd) {
        if (!Array.isArray(cardsToAdd) || !cardsToAdd.every(card => card instanceof Card)) {
            throw new TypeError('Argument must be an array of Card instances');
        }
        this.cards = this.cards.concat(cardsToAdd);
    }

    /**
     * Sets the deck to a specific array of cards.
     * @param {Card[]} cardsToSet - The array of cards to set the deck to.
     * @throws {TypeError} - Throws an error if the argument is not an array of Card instances.
     */
    setDeck(cardsToSet) {
        if (!Array.isArray(cardsToSet) || !cardsToSet.every(card => card instanceof Card)) {
            throw new TypeError('Argument must be an array of Card instances');
        }
        this.cards = cardsToSet;
    }

    /**
     * Creates a new deck with the cards reversed.
     * @returns {Deck} - A new deck with the cards reversed.
     */
    getReverseDeck() {
        const rev = new Deck(`reverse-${this.name}`);
        rev.setDeck(this.cards.slice().reverse()); // Create a copy and reverse it
        return rev;
    }

    /**
     * Sets all cards in the deck to face-up.
     */
    allFaceup() {
        this.cards.forEach(card => card.faceupCard(true));
    }

    /**
     * Sets all cards in the deck to face-down.
     */
    allFacedown() {
        this.cards.forEach(card => card.faceupCard(false));
    }
}


