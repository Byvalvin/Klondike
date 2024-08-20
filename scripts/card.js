/**
 * Represents a playing card.
 */
class Card {
    /**
     * Creates an instance of Card.
     * @param {string} suit - The suit of the card ('s', 'h', 'd', 'c').
     * @param {string} rank - The rank of the card ('A', '2', '3', ..., 'K').
     */
    constructor(suit, rank) {
        this.suit = suit.toLowerCase();
        this.rank = rank;
        this.visible = true;
    }

    /**
     * Returns the numerical ranking of the card.
     * @returns {number} - The rank of the card.
     */
    rankCard() {
        const ranking = {
            'K': 13, 'Q': 12, 'J': 11, 'T': 10, '9': 9, '8': 8,
            '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2, 'A': 1
        };
        return ranking[this.rank];
    }

    /**
     * Returns the name of the suit.
     * @returns {string} - The name of the suit.
     */
    suitCard() {
        const suits = {
            's': 'Spades', 'h': 'Hearts', 'd': 'Diamonds', 'c': 'Clubs'
        };
        return suits[this.suit] || 'Unknown Suit';
    }

    /**
     * Sets the card to face up or face down.
     * @param {boolean} visible - True if the card should be face up, false if face down.
     */
    faceupCard(visible) {
        this.visible = visible;
    }

    /**
     * Checks if the card is face up.
     * @returns {boolean} - True if the card is face up, false otherwise.
     */
    isFaceup() {
        return this.visible;
    }

    /**
     * Returns a string representation of the card.
     * @returns {string} - The string representation of the card.
     */
    toString() {
        return this.visible ? `${this.rank}${this.suit}` : '??';
    }

    /**
     * Returns a JSON representation of the card.
     * @returns {string} - The JSON representation of the card.
     */
    toJSON() {
        return `${this.rank}${this.suit}${this.visible ? '+' : '-'}`;
    }
}
