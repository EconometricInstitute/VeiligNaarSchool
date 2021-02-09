// Based on https://github.com/exromany/combinations-generator
function* combinations(n, k) {
    const keys = Array(k).fill(-1);
    let index = 0;
    while (index >= 0) {
        if (keys[index] < n - (k - index)) {
            for (let key=keys[index] - index + 1; index < k; index++) {
                keys[index] = key + index;
            }
            yield keys;
        }
        else {
            index--;
        }
    }
}

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

function count_combinations(parts) {
    let result = 1;
    let n = parts.reduce((a,b) => parseInt(a)+parseInt(b), 0);
    for(let i = 0; i < parts.length; i++)
    {
        for(let j = 1; j <= parts[i]; j++)
        {
            result *= n;
            result /= j;
            n--;
        }
    }
    return result;
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

function minimize(parts, cost_fn, callbacks, bound, cb_rate) {
    if (bound === undefined) {
        bound = Number.POSITIVE_INFINITY;
    }
    if (cb_rate == undefined) {
        cb_rate = 25000;
    }
    let best = undefined;
    console.log(parts);
    const n = parts.reduce((a,b) => parseInt(a)+parseInt(b), 0);
    const remain = [...Array(n).keys()];
    const total = count_combinations(parts);
    let count = 0;
    for (const p of enumerate(parts, remain)) {
        if (callbacks && count % cb_rate == 0) {
            callbacks.progress(count, total);
        }
        const cost = cost_fn(p);
        if (cost < bound) {
            bound = cost;
            const sol = toSolution(p, n);
            if (callbacks) {
                callbacks.solution(sol);
            }
            best = sol;
        }
        count++;
    }
    if (callbacks) {
        callbacks.finish(true);
    }
    return best;
}

function test() {
    const matrix = [[0,1,0,1,0,1,1,1,1,0,0,1,1,0,1,0,1,0],
                    [1,0,1,0,1,0,1,1,1,0,0,1,1,0,0,0,1,0],
                    [0,1,0,1,1,0,1,0,1,0,0,1,1,0,0,1,0,0],
                    [1,0,1,0,1,1,0,0,0,0,1,0,1,0,1,1,0,1],
                    [0,1,1,1,0,0,1,0,1,0,0,1,1,0,1,1,0,0],
                    [1,0,0,1,0,0,1,1,1,0,0,0,1,1,0,1,1,1],
                    [1,1,1,0,1,1,0,1,1,0,0,0,1,0,0,0,0,0],
                    [1,1,0,0,0,1,1,0,1,0,1,1,0,1,0,0,0,1],
                    [1,1,1,0,1,1,1,1,0,0,1,0,0,0,1,1,1,1],
                    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1],
                    [0,0,0,1,0,0,0,1,1,0,0,1,0,0,0,0,1,0],
                    [1,1,1,0,1,0,0,1,0,0,1,0,1,0,1,0,1,1],
                    [1,1,1,1,1,1,1,0,0,1,0,1,0,0,0,0,1,1],
                    [0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,1],
                    [1,0,0,1,1,0,0,0,1,1,0,1,0,0,0,0,0,0],
                    [0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0],
                    [1,1,0,0,0,1,0,0,1,0,1,1,1,0,0,0,0,1],
                    [0,0,0,1,0,1,0,1,1,1,0,1,1,1,0,0,1,0]];
    const sizes = [5,5,4,4];
    const cost_fn = matrix_to_cost_fn(matrix);
    const callbacks = {progress: console.log,
                       finish: console.log,
                       solution: console.log};
    let tic = Date.now();
    //let best = solve_enumerator(matrix, sizes, ub, nCombs);
    minimize(sizes, cost_fn, callbacks);
    let toc = Date.now();
    console.log((toc - tic + 0.0) / 1000 + " seconds");
}

//test();

export default {minimize, matrix_to_cost_fn, test};