class Deck {
    constructor(name) {
        this.cards = [];
        this.name = name;
    }

    nameDeck() {
        return this.name;
    }

    sizeDeck() {
        return this.cards.length;
    }

    isEmpty() {
        return this.sizeDeck() === 0;
    }

    peekDeck() {
        if (this.isEmpty()) {
            throw new Error('Deck is empty');
        }
        return this.cards[this.cards.length - 1];
    }

    pushDeck(card) {
        if (!(card instanceof Card)) {
            throw new TypeError(`${card} is not a Card`);
        }
        this.cards.push(card);
    }

    popDeck() {
        if (this.isEmpty()) {
            throw new Error('Deck is empty');
        }
        return this.cards.pop();
    }

    getVisibleCards() {
        const visibleCards = [];
        while (!this.isEmpty() && this.peekDeck().isFaceup()) {
            visibleCards.push(this.popDeck());
        }
        return visibleCards;
    }

    getCardsList() {
        return this.cards;
    }

    toString() {
        return ` [ ${this.cards.map(card => card.toString()).reverse().join(' ')} ]`;
    }

    toJSON() {
        return this.cards.map(card => card.toJSON()).join(' ');
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    addDeck(deck) {
        if (!(deck instanceof Deck)) {
            throw new TypeError('Argument must be an instance of Deck');
        }
        this.cards = this.cards.concat(deck.cards);
    }

    updateDeck(cardsToAdd) {
        if (!Array.isArray(cardsToAdd) || !cardsToAdd.every(card => card instanceof Card)) {
            throw new TypeError('cardsToAdd must be an array of Card instances');
        }
        this.cards = this.cards.concat(cardsToAdd);
    }

    setDeck(cardsToSet) {
        if (!Array.isArray(cardsToSet) || !cardsToSet.every(card => card instanceof Card)) {
            throw new TypeError('cardsToSet must be an array of Card instances');
        }
        this.cards = cardsToSet;
    }

    getReverseDeck() {
        const rev = new Deck(`reverse-${this.name}`);
        rev.setDeck(this.cards.slice().reverse()); // Create a copy and reverse it
        return rev;
    }

    allFaceup() {
        this.cards.forEach(card => card.faceupCard(true));
    }

    allFacedown() {
        this.cards.forEach(card => card.faceupCard(false));
    }
}

