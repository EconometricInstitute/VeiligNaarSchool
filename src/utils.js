function compute_combinations(sizes) {
    let n = sizes.reduce((a,b) => a+b, 0);
    let nCombs = 1.0;
    for(let i = 0; i < sizes.length; i++)
    {
        for(let j = 1; j <= sizes.length; j++)
        {
            nCombs *= n;
            nCombs /= j;
            n--;
        }
    }
    return nCombs;
}

function dummy_solver(sizes) {
    console.log(sizes);
    const result = [];
    let cur = 0;
    for (const size of sizes) {
        for (let i=0; i < size; i++) {
            result.push(cur);
        }
        cur++;
    }
    return result;
}

function compute_conflicts(solution, matrix) {
    let cost = 0;
    let total = 0;
    let conflicts = [];
    for (let row=0; row < matrix.length; row++) {
        for (let col=row+1; col < matrix.length; col++) {
            const entry = matrix[row][col];
            total += entry;
            if (entry > 0 && solution[row] != solution[col]) {
                cost += entry;
                conflicts.push({class1: row, class2: col, costs: entry});
            }
        }
    }
    return {cost, honored: total-cost, total, conflicts};
}

export default {dummy_solver, compute_conflicts, compute_combinations};