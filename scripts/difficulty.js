// Define difficulties and their score ranges
const difficulties = [
    { name: "Jack", minScore: 4, maxScore: 17 },
    { name: "King's Guard", minScore: 13, maxScore: 25 },
    { name: "Joker's Delight", minScore: 26, maxScore: 38 },
    { name: "Dead Man", minScore: 39, maxScore: 52 }
];

// Define parameter scores with weights for each value
const parameterScores = {
    pileOrdering: { none: { score: 1, weight: 1 }, altColor: { score: 13, weight: 3 }, sameColor: { score: 7, weight: 2 } },
    numberOfPiles: { three: { score: 13, weight: 1 }, four: { score: 7, weight: 2 }, seven: { score: 1, weight: 3 } },
    suitOrdering: { acesFirst: { score: 1, weight: 1 }, kingsFirst: { score: 7, weight: 2 } , random: { score: 11, weight: 3 }},
    timed: { none: { score: 1, weight: 1 }, tenMins: { score: 5, weight: 2 }, fiveMins: { score: 10, weight: 3 }, threeMins: { score: 15, weight: 4 } }
};

// Function to get a weighted random parameter value
function getWeightedRandomParamValue(params) {
    const values = Object.values(params);
    const totalWeight = values.reduce((sum, param) => sum + param.weight, 0);
    let random = Math.random() * totalWeight;
    for (const value of values) {
        if (random < value.weight) {
            return value.score;
        }
        random -= value.weight;
    }
}

// Function to generate a difficulty score within a given range
function generateDifficultyScore(minScore, maxScore) {
    let score;
    let pileOrdering, numberOfPiles, suitOrdering, timed;
    let count = 1;
    do {
        pileOrdering = getWeightedRandomParamValue(parameterScores.pileOrdering);
        numberOfPiles = getWeightedRandomParamValue(parameterScores.numberOfPiles);
        suitOrdering = getWeightedRandomParamValue(parameterScores.suitOrdering);
        timed = getWeightedRandomParamValue(parameterScores.timed);

        score = pileOrdering + numberOfPiles + suitOrdering + timed;
        console.log(count, pileOrdering, numberOfPiles, suitOrdering, timed);
        count += 1;

    } while (score < minScore || score > maxScore);

    // Convert scores to corresponding parameter names
    const pileOrderingName = Object.keys(parameterScores.pileOrdering).find(key => parameterScores.pileOrdering[key].score === pileOrdering);
    const numberOfPilesName = Object.keys(parameterScores.numberOfPiles).find(key => parameterScores.numberOfPiles[key].score === numberOfPiles);
    const suitOrderingName = Object.keys(parameterScores.suitOrdering).find(key => parameterScores.suitOrdering[key].score === suitOrdering);
    const timedName = Object.keys(parameterScores.timed).find(key => parameterScores.timed[key].score === timed);

    return {
        score,
        params: { pileOrdering: pileOrderingName, numberOfPiles: numberOfPilesName, suitOrdering: suitOrderingName, timed: timedName }
    };
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
