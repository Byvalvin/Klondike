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

    toString() {
        return ` [ ${this.cards.map(card => card.toString()).reverse().join(' ')} ]`;
    }

    toJSON() {
        // return ` [ ${this.cards.map(card => card.toJSON()).reverse().join(' ')} ]`
        return this.cards.map(card => `${card.rank}${card.suit}${card.faceUp ? '+' : '-'}`).join(' ');
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
}
