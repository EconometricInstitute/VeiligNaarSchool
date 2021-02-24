
import utils from '../utils.js';

const combinations = utils.combinations;
const compute_lb = utils.compute_lb;
const count_combinations = utils.count_combinations;
const count_equal_partitions = utils.count_equal_partitions;

function compute_histogram(parts) {
    const hist = {};
    for (const p of parts) {
        if (hist[p]) {
            hist[p]++;
        }
        else {
            hist[p] = 1;
        }
    }
    return hist;
}

function count_possibilities(parts) {
    const hist = compute_histogram(parts);
    let result = 1;
    let inequal = [];
    for (const [k,v] of Object.entries(hist)) {
        const size = Number.parseInt(k);
        const times = Number.parseInt(v);
        if (times > 1) {
            result *= count_equal_partitions(size*times, times);
        }
        inequal.push(size * times);
    }
    result *= count_combinations(inequal);
    return result;
}

function* enumerate(parts, remain) {
    const hist = compute_histogram(parts);
    const inequal = [];
    const equal = [];
    const m = [];
    for (const [k,v] of Object.entries(hist)) {
        const key = Number.parseInt(k);
        const val = Number.parseInt(v)
        if (val > 1) {
            equal.push(val*key);
            m.push(val);
        }
        else {
            inequal.push(key);
        }
    }
    const master = [...equal, ...inequal];
    for (const part of enumerate_inequal_parts(master, [...remain])) {
        if (equal.length == 0) {
            yield [part];
        }
        else {
            const head = part.slice(0, inequal.length);
            const tail_parts = part.slice(inequal.length);
            for (const tail of enumerate_equal_parts_lists(tail_parts, m)) {
                yield [...head, ...tail];
            }
        }
    }
}

function* enumerate_inequal_parts(parts, remain) {
    if (parts.length == 1) {
        yield [remain];
    }
    else {
        const m = parts.pop();
        for (const c of combinations(remain.length, m)) {
            const head = c.map(i => remain[i]);
            const sub = remain.filter((_,idx) => !c.includes(idx));
            for (const tail of enumerate_inequal_parts(parts, sub)) {
                yield [head, ...tail];
            }
        }
        parts.push(m);
    }
}

function* enumerate_equal_parts_lists(parts, key) {
    if (parts.length == 1) {
        for (const part of enumerate_equal_parts(key[0], parts[0])) {
            yield part;
        }
    }
    else {
        const parts_tail = parts.slice(1);
        const key_tail = key.slice(1);
        for (const part of enumerate_equal_parts(key[0], parts[0])) {
            for (const tail of enumerate_equal_parts_lists(parts_tail, key_tail)) {
                yield [...part, ...tail];
            }
        }
    }
}

function* enumerate_equal_parts(m, remain) {
    const k = Math.round(remain.length/m);
    if (m == 1 || remain.length == k) {
        yield [remain];
        return;
    }
    if (m*k != remain.length) {
        throw `Can not split ${remain.length} elements in ${m} parts of ${k} elements`;
    }
    if (k==1) {
        yield remain.map(e => [e]);
        return;
    }
    let first_element = remain[0];
    let sublist = remain.splice(1);
    for (const indices of combinations(sublist.length, k-1)) {
        const comb = indices.map(i => sublist[i]);
        const sub_remain = sublist.filter(e => !comb.includes(e));
        for (const tail of enumerate_equal_parts(m-1, sub_remain)) {
            yield [[first_element, ...comb], ...tail];
        }
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
    if (solverService) {
        solverService.bound(lb);
    }
    const cost_fn = matrix_to_cost_fn(matrix);
    let best = undefined;
    const n = parts.reduce((a,b) => parseInt(a)+parseInt(b), 0);
    const remain = [...Array(n).keys()];
    // TODO: count combinations is wrong here
    const total = count_possibilities(parts);
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
     name: 'Total Enumeration (avoid symmetry)',
     run: minimize,
     eligable
};