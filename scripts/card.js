class Card {
    constructor(suit, rank) {
        this.suit = suit.toLowerCase();
        this.rank = rank;
        this.visible = true;
    }

    rankCard() {
        const ranking = {
            'K': 13, 'Q': 12, 'J': 11, 'T': 10, '9': 9, '8': 8,
            '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2, 'A': 1
        };
        return ranking[this.rank];
    }

    suitCard() {
        const suits = {
            's': 'Spades', 'h': 'Hearts', 'd': 'Diamonds', 'c': 'Clubs'
        };
        return suits[this.suit] || 'Unknown Suit';
    }

    faceupCard(visible) {
        this.visible = visible;
    }

    isFaceup() {
        return this.visible;
    }

    toString() {
        return this.visible ? `${this.rank}${this.suit}` : '??';
    }

    toJSON() {
        return `${this.rank}${this.suit}${this.visible ? '+' : '-'}`;
    }
}
