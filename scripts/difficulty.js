// Define difficulties and their score ranges
const difficulties = [
    { name: "Jack", minScore: 4, maxScore: 17 },
    { name: "King's Guard", minScore: 18, maxScore: 30 },
    { name: "Joker's Delight", minScore: 31, maxScore: 43 },
    { name: "Dead Man", minScore: 40, maxScore: 52 }
];

// Define parameter scores with weights for each value
const parameterScores = {
    pileOrdering: { none: { score: 1, weight: 1 }, altColor: { score: 13, weight: 3 }, sameColor: { score: 7, weight: 2 } },
    numberOfPiles: { three: { score: 13, weight: 1 }, four: { score: 7, weight: 2 }, seven: { score: 1, weight: 3 } },
    suitOrdering: { acesFirst: { score: 1, weight: 1 }, kingsFirst: { score: 7, weight: 2 } , random: { score: 11, weight: 3 }},
    timed: { none: { score: 1, weight: 1 }, tenMins: { score: 5, weight: 2 }, fiveMins: { score: 10, weight: 3 }, threeMins: { score: 15, weight: 4 } }
};

function extractLists(data) {
    // Helper function to get score values from an object
    const getScores = obj => Object.values(obj).map(item => item.score);
    
    // Extract lists from the provided object
    const l1 = getScores(data.pileOrdering);
    const l2 = getScores(data.numberOfPiles);
    const l3 = getScores(data.suitOrdering);
    const l4 = getScores(data.timed);
    
    return { l1, l2, l3, l4 };
}


function calculateSums(l1, l2, l3, l4) {
    const allSums = [];

    // Generate all possible sums
    l1.forEach(a => {
        l2.forEach(b => {
            l3.forEach(c => {
                l4.forEach(d => {
                    const sum = a + b + c + d;
                    allSums.push(sum);
                });
            });
        });
    });

    // Get unique sums by creating a Set from allSums
    const uniqueSums = [...new Set(allSums)];

    // Return both lists: one with duplicates and one with unique values
    return {
        allSums: allSums.sort((x, y) => x - y),
        uniqueSums: uniqueSums.sort((x, y) => x - y)
    };
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
const { l1, l2, l3, l4 } = extractLists(data);

// Print the lists
console.log('List 1:', l1); // Scores from pileOrdering
console.log('List 2:', l2); // Scores from numberOfPiles
console.log('List 3:', l3); // Scores from suitOrdering
console.log('List 4:', l4); // Scores from timed
const result = calculateSums(l1, l2, l3, l4);

console.log('All possible sums (with duplicates):', result.allSums);
console.log('Unique sums:', result.uniqueSums);


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
