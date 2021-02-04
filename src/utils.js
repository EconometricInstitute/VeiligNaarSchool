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
    let conflicts = [];
    for (let row=0; row < matrix.length; row++) {
        for (let col=row+1; col < matrix.length; col++) {
            const entry = matrix[row][col];
            if (entry > 0 && solution[row] != solution[col]) {
                cost += entry;
                conflicts.push({class1: row, class2: col, costs: entry});
            }
        }
    }
    return {cost, conflicts};
}

export default {dummy_solver, compute_conflicts};