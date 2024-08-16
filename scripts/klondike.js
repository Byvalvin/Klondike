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
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
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

// Create a new deck and shuffle it
function createDeck() {
    const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = new Deck('Full Deck');
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.pushDeck(new Card(suit, rank));
        }
    }
    deck.shuffle();
    return deck;
}

// Initialize the game state
function initializeGame() {
    let fullDeck = createDeck();

    // Initialize game components
    let stock = new Deck("Stock");
    let discard = new Deck("Discard");
    let suits = [new Deck("Spades"), new Deck("Hearts"), new Deck("Diamonds"), new Deck("Clubs")];
    let piles = Array.from({ length: 7 }, (_, i) => new Deck(`Pile ${i + 1}`));

    // Deal cards to the stock
    while (!fullDeck.isemptyDeck()) {
        stock.pushDeck(fullDeck.popDeck());
    }

    // Deal cards to piles
    for (let i = 0; i < piles.length; i++) {
        for (let j = 0; j <= i; j++) {
            let card = stock.popDeck();
            card.setFaceUp(j === i); // Only the last card is face up
            piles[i].pushDeck(card);
        }
    }

    // Deal a few cards to discard pile
    for (let i = 0; i < 3 && !stock.isemptyDeck(); i++) {
        discard.pushDeck(stock.popDeck());
    }

    // Face up top card in stock if any
    if (!stock.isemptyDeck()) {
        stock.peekDeck().setFaceUp(true);
    }

    // Display the initial state
    displayBoard(stock, discard, suits, piles);
}

// Display the current game state
function displayBoard(stock, discard, suits, piles) {
    document.getElementById('stock').innerText = stock.toString();
    document.getElementById('discard').innerText = discard.toString();
    
    let suitsHtml = suits.map(suit => `<div>${suit.nameDeck()}: ${suit.toString()}</div>`).join('');
    document.getElementById('suits').innerHTML = suitsHtml;

    let pilesHtml = piles.map(pile => `<div>${pile.nameDeck()}: ${pile.toString()}</div>`).join('');
    document.getElementById('piles').innerHTML = pilesHtml;
}

// Call initializeGame on page load
window.onload = () => {
    initializeGame();
};

