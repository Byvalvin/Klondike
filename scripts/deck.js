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
        let currentCard = this.peekDeck();
        while (currentCard) {
            visibleCards.push(currentCard);
            if (this.cards.length > 1) {
                this.popDeck(); // Remove the card from the deck
                currentCard = this.peekDeck(); // Peek the next card
            } else {
                break;
            }
        }
        return visibleCards;
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

    addDeck(deck){
        const currCards = this.cards;
        this.cards = this.cards.concat(deck.cards);
        console.log(`add ${this.name} ${currCards} + ${deck.cards} = ${this.cards}`);
    }

    updateDeck(cardsToAdd){
        const currCards = this.cards;
        this.cards = this.cards.concat(cardsToAdd);
        console.log(`update ${this.name}: ${currCards} + ${cardsToAdd} = ${this.cards}`);
    }

    setDeck(cardsToSet){
        this.cards = cardsToSet;
    }

    getReverseDeck(){
        const rev = new Deck(`reverse-${this.name}`);
        rev.setDeck(this.cards.reverse());
        return rev;
    }

    allFaceup(){
        this.cards.forEach((card)=>{card.faceupCard(true);});
    }

    allFacedown(){
        this.cards.forEach((card)=>{card.faceupCard(false);});
    }
    
}
