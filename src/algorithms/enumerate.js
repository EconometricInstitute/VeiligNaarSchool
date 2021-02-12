import utils from '../utils.js';

const combinations = utils.combinations;
const compute_lb = utils.compute_lb;
const count_combinations = utils.count_combinations;

function* enumerate(parts, remain) {
    if (parts.length == 1) {
        yield [remain];
    }
    else {
        const m = parts.pop();
        for (const c of combinations(remain.length, m)) {
            const head = c.map(i => remain[i]);
            const sub = remain.filter((_,idx) => !c.includes(idx));
            for (const tail of enumerate(parts, sub)) {
                yield [head, ...tail];
            }
        }
        parts.push(m);
    }
}

function toSolution(split, n) {
    const result = Array(n);
    for (const [p,i] of split.entries()) {
        for (const j of i) {
            result[j] = p;
        }
    }
    return result;
}

function matrix_to_cost_fn(matrix) {
    return (p) => {
        let result = 0;
        for (const part of p) {
            for (let i=0; i < part.length; i++) {
                for (let j=i+1; j < part.length; j++) {
                    result += matrix[i][j];
                }
            }
        }
        return result;
    };
}

function minimize(instance, solverService, ub=Number.POSITIVE_INFINITY, cb_rate=25000, eps=1e-6) {
    const parts = [...instance.parts];
    const matrix = instance.matrix;
    const lb = compute_lb(matrix);
    const cost_fn = matrix_to_cost_fn(matrix);
    let best = undefined;
    const n = parts.reduce((a,b) => parseInt(a)+parseInt(b), 0);
    const remain = [...Array(n).keys()];
    const total = count_combinations(parts);
    let count = 0;
    for (const p of enumerate(parts, remain)) {
        if (solverService && count % cb_rate == 0) {
            solverService.progress(count, total);
        }
        const cost = cost_fn(p);
        if (cost < ub) {
            ub = cost;
            const sol = toSolution(p, n);
            if (solverService) {
                solverService.solution(sol);
            }
            best = sol;
            if (Math.abs(cost - lb) <= eps) {
                // Optimal solution found, so we can stop;
                break;
            }
        }
        count++;
    }
    if (solverService) {
        solverService.finish(true);
    }
    return best;
}

function eligable() {
    // This function accepts an instance and can be used to check if we should
    // run this algorithm for this instace. Currently it always returns true
    return true;
}

export default {
    name: 'Total Enumeration',
    run: minimize,
    eligable
};