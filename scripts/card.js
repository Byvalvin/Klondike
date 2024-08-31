/**
 * Represents a playing card.
 */
class Card {
    /**
     * Card rank values.
     */
    static ranking = {
        'K': 13, 'Q': 12, 'J': 11, 'T': 10, '9': 9, '8': 8,
        '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2, 'A': 1
    };

    /**
     * Card suits and their symbols.
     */
    static suits = {
        's': 'Spades', 'h': 'Hearts', 'd': 'Diamonds', 'c': 'Clubs'
    };

    static symbols = {
        's': '♠', // Spades
        'h': '♥', // Hearts
        'd': '♦', // Diamonds
        'c': '♣'  // Clubs
    };

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
        return Card.ranking[this.rank] || 0; // Returns 0 if rank is invalid
    }

    /**
     * Returns the name of the suit.
     * @returns {string} - The name of the suit.
     */
    suitCard() {
        return Card.suits[this.suit] || 'Unknown Suit';
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
     * Returns a string representation of the card with suit symbol.
     * @returns {string} - The string representation with suit symbol.
     */
    toStringSymbol() {
        return this.visible ? `${this.rank}${Card.symbols[this.suit]}` : '??';
    }

    /**
     * Returns a JSON representation of the card.
     * @returns {string} - The JSON representation of the card.
     */
    toJSON() {
        return `${this.rank}${this.suit}${this.visible ? '+' : '-'}`;
    }

    createCardElement() {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        
        if (this.visible) {
            const rankAndSuitSymbol = this.toStringSymbol(); // Use method to get suit symbol
            const className = `card-symbol ${this.suit}`;
            cardElement.innerHTML = `
                <div class="${className}">${rankAndSuitSymbol}</div>
            `;
        } else {
            cardElement.classList.add('face-down');
            cardElement.innerHTML = ''; // Face-down cards have no text
        }
        
        return cardElement;
    }
}

