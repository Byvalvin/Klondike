class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
        this.faceUp = false;
    }

    setFaceUp(isFaceUp) {
        this.faceUp = isFaceUp;
    }

    toString() {
        return this.faceUp ? `${this.rank}${this.suit}` : "??";
    }
}

class Deck {
    constructor(name) {
        this.name = name;
        this.cards = [];
    }

    nameDeck() {
        return this.name;
    }

    sizeDeck() {
        return this.cards.length;
    }

    pushDeck(card) {
        this.cards.push(card);
    }

    popDeck() {
        return this.cards.pop();
    }

    peekDeck() {
        return this.cards[this.cards.length - 1];
    }

    isemptyDeck() {
        return this.cards.length === 0;
    }

    toString() {
        return this.cards.map(card => card.toString()).join(' ');
    }
}

let stock = new Deck("Stock");
let discard = new Deck("Discard");
let suits = [new Deck("Spades"), new Deck("Hearts"), new Deck("Diamonds"), new Deck("Clubs")];
let piles = Array.from({ length: 7 }, (_, i) => new Deck(`Pile ${i + 1}`));

function commentText(commands) {
    let comment = `${commands.shift().charAt(0).toUpperCase() + commands.shift().slice(1)}: ${commands.join(' ')}`;
    console.log(comment);
}

function resetGame() {
    if (stock.sizeDeck() === 0) {
        console.error("Stock Not Empty");
        return;
    }
    let relay = new Deck("Relay Deck");
    while (!discard.isemptyDeck()) {
        relay.pushDeck(discard.popDeck());
    }
    while (!relay.isemptyDeck()) {
        let card = relay.popDeck();
        card.setFaceUp(false);
        stock.pushDeck(card);
    }
    if (!stock.isemptyDeck()) {
        stock.peekDeck().setFaceUp(true);
    }
}

function discardCards() {
    if (stock.isemptyDeck()) {
        console.error("Stock Empty");
        return;
    }
    let max = 3;
    let moves = Math.min(max, stock.sizeDeck());
    for (let n = 0; n < moves; n++) {
        let card = stock.popDeck();
        card.setFaceUp(false);
        discard.pushDeck(card);
    }
    if (!stock.isemptyDeck()) {
        stock.peekDeck().setFaceUp(true);
    }
}

function displayBoard() {
    console.log("Stock:", stock.toString());
    console.log("Discard:", discard.toString());
    suits.forEach(suit => console.log(suit.nameDeck() + ":", suit.toString()));
    piles.forEach(pile => console.log(pile.nameDeck() + ":", pile.toString()));
}

function cheat() {
    displayBoard();
}

function endGame() {
    console.log("Game Over");
}

window.onload = () => {
    // Initialize the game or load a saved game state
    // Example:
  stock.pushDeck(new Card('Spades', 'A'));
  displayBoard();
};
