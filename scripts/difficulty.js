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

// Function to get a random parameter value
function getRandomParamValue(params) {
    const keys = Object.keys(params);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return key;
}

// Function to get difficulty based on score
function getDifficulty(score) {
    return difficulties.find(difficulty => score >= difficulty.minScore && score <= difficulty.maxScore) || { name: 'Unknown', minScore: 0, maxScore: 0 };
}

// Function to generate a random difficulty score within a given range
function generateDifficultyScore(minScore, maxScore) {
    let score;
    let count = 1;
    do {
        const pileOrdering = getRandomParamValue(parameterScores.pileOrdering);
        const numberOfPiles = getRandomParamValue(parameterScores.numberOfPiles);
        const suitOrdering = getRandomParamValue(parameterScores.suitOrdering);
        const timed = getRandomParamValue(parameterScores.timed);

        console.log(count, pileOrdering, numberOfPiles, suitOrdering, timed);
        count+=1;

        score = parameterScores.pileOrdering[pileOrdering] +
                parameterScores.numberOfPiles[numberOfPiles] +
                parameterScores.suitOrdering[suitOrdering] +
                parameterScores.timed[timed];
    } while (score < minScore || score > maxScore);

    return { score, params: { pileOrdering, numberOfPiles, suitOrdering, timed } };
}

// Function to get difficulty parameters based on the difficulty name
function getDifficultyParams(name) {
    const difficulty = difficulties.find(difficulty => difficulty.name === name);
    if (difficulty) {
        const { score, params } = generateDifficultyScore(difficulty.minScore, difficulty.maxScore);
        return { ...params, difficulty: name, score };
    }
    return null;
}

