// Define difficulties and their score ranges
const difficulties = [
    { name: "Jack", minScore: 4, maxScore: 20 },
    { name: "King's Guard", minScore: 21, maxScore: 28 },
    { name: "Joker's Delight", minScore: 29, maxScore: 35 },
    { name: "Dead Man", minScore: 36, maxScore: 52 }
];

// Define parameter scores with weights for each value
const parameterScores = {
    pileOrdering: {
        none: { score: 1, weight: 1, value: 0 },
        altColor: { score: 13, weight: 3, value: 2 },
        sameColor: { score: 7, weight: 2, value: 1 }
    },
    numberOfPiles: {
        three: { score: 13, weight: 1, value: 3 },
        four: { score: 7, weight: 2, value: 4 },
        seven: { score: 1, weight: 3, value: 7 }
    },
    suitOrdering: {
        acesFirst: { score: 1, weight: 1, value: 0 },
        kingsFirst: { score: 7, weight: 2, value: 1 },
        random: { score: 11, weight: 3, value: 2 }
    },
    timed: {
        none: { score: 1, weight: 1, value: 0 },
        tenMins: { score: 5, weight: 2, value: 10 },
        fiveMins: { score: 10, weight: 3, value: 5 },
        threeMins: { score: 15, weight: 4, value: 3 }
    }
};

/**
 * Extracts score lists from the parameter scores.
 * @param {Object} data - The parameter scores object.
 * @returns {Object} - Object containing lists of scores.
 */
function extractLists(data) {
    const getScores = obj => Object.values(obj).map(item => item.score);
    return {
        l1: getScores(data.pileOrdering),
        l2: getScores(data.numberOfPiles),
        l3: getScores(data.suitOrdering),
        l4: getScores(data.timed)
    };
}

/**
 * Calculates all possible sums from the given lists.
 * @param {number[]} l1 - List of scores for pileOrdering.
 * @param {number[]} l2 - List of scores for numberOfPiles.
 * @param {number[]} l3 - List of scores for suitOrdering.
 * @param {number[]} l4 - List of scores for timed.
 * @returns {Object} - Object containing all sums and unique sums.
 */
function calculateSums(l1, l2, l3, l4) {
    const allSums = [];

    l1.forEach(a => {
        l2.forEach(b => {
            l3.forEach(c => {
                l4.forEach(d => {
                    allSums.push(a + b + c + d);
                });
            });
        });
    });

    return {
        allSums: [...new Set(allSums)].sort((x, y) => x - y),
        uniqueSums: [...new Set(allSums)].sort((x, y) => x - y)
    };
}

/**
 * Gets a weighted random parameter value.
 * @param {Object} params - The parameter scores object.
 * @returns {number} - The randomly selected score.
 */
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

/**
 * Generates a difficulty score within a given range.
 * @param {number} minScore - The minimum score for the difficulty.
 * @param {number} maxScore - The maximum score for the difficulty.
 * @returns {Object} - Object containing the score and parameter names.
 */
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

    const getParamName = (params, score) => Object.keys(params).find(key => params[key].score === score);

    return {
        score,
        params: {
            pileOrdering: getParamName(parameterScores.pileOrdering, pileOrdering),
            numberOfPiles: getParamName(parameterScores.numberOfPiles, numberOfPiles),
            suitOrdering: getParamName(parameterScores.suitOrdering, suitOrdering),
            timed: getParamName(parameterScores.timed, timed)
        }
    };
}

/**
 * Gets difficulty parameters based on the difficulty name.
 * @param {string} name - The name of the difficulty.
 * @returns {Object|null} - The difficulty parameters or null if not found.
 */
function getDifficultyParams(name) {
    const difficulty = difficulties.find(difficulty => difficulty.name === name);
    if (difficulty) {
        const { score, params } = generateDifficultyScore(difficulty.minScore, difficulty.maxScore);
        return { ...params, difficulty: name, score };
    }
    return null;
}



// Example usage:
/*
const l1 = [1, 7, 13];
const l2 = [1, 7, 13];
const l3 = [1, 7, 11];
const l4 = [1, 5, 10, 15];

const result = calculateSums(l1, l2, l3, l4);

console.log('All possible sums (with duplicates):', result.allSums);
console.log('Unique sums:', result.uniqueSums);
*/


/*
The unique sums are:
{4,8,10,13,14,16,18,19,20,22,23,24,25,26,28,30,31,32,34,36,37,38,40,41,42,43,46,47,48,52}
[4,8,13,18,10,14,19,24,14,18,23,28,16,20,25,30,20,24,29,34,22,26,31,36,26,30,35,40,28,32,37,42,34,38,43,48,38,42,47,52]
[4,8,10,13,14,14,16,18,18,19,  20,20,22,23,24,24,25,26,26,28,28, 30,30,31,32,34,34,36,37,38,38, 40,41,42,42,43,46,47,48,52]

*/

// Extract lists
const { l1, l2, l3, l4 } = extractLists(parameterScores);

// Print the lists
console.log('List 1:', l1); // Scores from pileOrdering
console.log('List 2:', l2); // Scores from numberOfPiles
console.log('List 3:', l3); // Scores from suitOrdering
console.log('List 4:', l4); // Scores from timed
const result = calculateSums(l1, l2, l3, l4);

console.log('All possible sums (with duplicates):', result.allSums);
console.log('Unique sums:', result.uniqueSums);
