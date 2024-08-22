// Define parameter scores
const parameterScores = {
    pileOrdering: { none: 1, altColor: 5, sameColor: 3 },
    numberOfPiles: { three: 10, four: 5, seven: 1 },
    suitOrdering: { acesFirst: 1, kingsFirst: 2 },
    timed: { none: 1, tenMins: 3, fiveMins: 5, threeMins: 15 }
};

// Define difficulties and their score ranges
const difficulties = [
    { name: "King’s Guardian", minScore: 0, maxScore: 10 },
    { name: "The Ace", minScore: 11, maxScore: 20 },
    { name: "Queen of Hearts", minScore: 21, maxScore: 30 },
    { name: "Jack’s Challenge", minScore: 31, maxScore: 40 },
    { name: "Royal Flush", minScore: 41, maxScore: 45 },
    { name: "Diamond’s Gambit", minScore: 46, maxScore: 50 },
    { name: "The Spade’s Test", minScore: 51, maxScore: 52 }
];

// Function to get a random parameter value based on difficulty
function getRandomParamValue(params) {
    const keys = Object.keys(params);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return key;
}

// Function to generate a difficulty score
function generateDifficultyScore() {
    const pileOrdering = parameterScores.pileOrdering[getRandomParamValue(parameterScores.pileOrdering)];
    const numberOfPiles = parameterScores.numberOfPiles[getRandomParamValue(parameterScores.numberOfPiles)];
    const suitOrdering = parameterScores.suitOrdering[getRandomParamValue(parameterScores.suitOrdering)];
    const timed = parameterScores.timed[getRandomParamValue(parameterScores.timed)];

    return pileOrdering + numberOfPiles + suitOrdering + timed;
}

// Function to select difficulty based on score
function selectDifficulty(score) {
    return difficulties.find(difficulty => score >= difficulty.minScore && score <= difficulty.maxScore);
}

// Example usage
function setupGame(difficultyName) {
    // Generate game parameters
    const difficulty = difficulties.find(d => d.name === difficultyName);
    let gameScore;

    if (difficulty) {
        gameScore = generateDifficultyScore();
        if (gameScore < difficulty.minScore || gameScore > difficulty.maxScore) {
            console.error('Generated score does not match the selected difficulty');
            return;
        }
        // Setup game based on difficulty parameters
        console.log(`Setting up game with difficulty: ${difficultyName}`);
    } else {
        console.error('Difficulty not found');
    }
}

// Example function call
setupGame("Royal Flush");
