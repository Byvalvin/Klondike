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
    const pileOrdering = getRandomParamValue(parameterScores.pileOrdering);
    const numberOfPiles = getRandomParamValue(parameterScores.numberOfPiles);
    const suitOrdering = getRandomParamValue(parameterScores.suitOrdering);
    const timed = getRandomParamValue(parameterScores.timed);

    return parameterScores.pileOrdering[pileOrdering] +
           parameterScores.numberOfPiles[numberOfPiles] +
           parameterScores.suitOrdering[suitOrdering] +
           parameterScores.timed[timed];
}

// Function to get difficulty based on score
function getDifficulty(score) {
    return difficulties.find(difficulty => score >= difficulty.minScore && score <= difficulty.maxScore) || { name: 'Unknown', minScore: 0, maxScore: 0 };
}

function getDifficultyParams(name){
    return {name:name, pileOrder:"none", npile:"four", suitOrder:"acesFirst" timed:"none", status:"default working"};
}
