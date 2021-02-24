import utils from '../utils.js';

//const combinations = utils.combinations;
const compute_lb = utils.compute_lb;
//const count_combinations = utils.count_combinations;

function* enumerateSets(n, lst=[]) {
    //console.log(n, lst);
    if (n == 0) {
        yield lst;
        return;
    }
    lst.push(1);
    for (const set of enumerateSets(n-1, lst)) {
        yield set;
    }
    lst.pop();
    lst.push(0);
    for (const set of enumerateSets(n-1, lst)) {
        yield set;
    }
    lst.pop();
}

function* enumerateSplit(n, k) {
    //console.log(n, k);
    if (n < k) {
        throw `n(=${n}) should be greater or equal to k(=${k})`;
    }
    if (k==0) {
        yield Array(n).fill(0);
        return;
    }
    if (n==k) {
        yield Array(n).fill(1);
        return;
    }
    const lhs = [];
    for (let i=0; i <= n-k; i++) {
        lhs.push(1);
        for (const rhs of enumerateSplit(n-i-1, k-1)) {
            yield [...lhs, ...rhs];
        }
        lhs[i] = 0;
    }
}

function merge(split, nonsplit, groups) {
    const result = [];
    let splitIdx = 0;
    let nonsplitIdx = 0;
    for (let i=0; i < groups.length; ) {
        const grp = groups[i];
        if (grp.split == 1) {
            result.push(nonsplit[nonsplitIdx++]);
            i++;
        }
        else if (grp.split == 2) {
            const ts = split[splitIdx++];
            result.push(ts, 1-ts);
            i += 2;
        }
        else {
            throw 'Groups with split other than 1 or 2 are not supported';
        }
    }
    return result;
}

function instance_to_cost_fn(instance) {
    const matrix = instance.matrix;
    return (p) => {
        let result = 0;
        for (let i=0; i < matrix.length; i++) {
            for (let j=i+1; j < matrix.length; j++) {
                if (p[i] != p[j]) {
                    result += matrix[i][j];
                }
            }
        }
        return result;
    };
}

function countSplit(groups) {
    const set = new Set();
    for (const grp of groups) {
        if (grp.split == 2) {
            set.add(grp.originalIndex);
        }
    }
    return set.size;
}

function factorial(n) {
    let result = 1;
    for (let i=2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function binomial(n, k) {
    return factorial(n) / (factorial(k) * factorial(n-k));
}

function minimize(instance, solverService, ub=Number.POSITIVE_INFINITY, cb_rate=25000, eps=1e-6) {
    const groups = instance.groups;
    const parts = instance.parts;
    const matrix = instance.matrix;
    if (parts.length != 2) {
        throw 'Only instances with two timeslots are supported';
    }
    const cost_fn = instance_to_cost_fn(instance);
    const lb = compute_lb(matrix);
    if (solverService) {
        solverService.bound(lb);
    }
    let best = undefined;
    const split = countSplit(groups);
    const nonsplit = groups.length - 2*split; 
    const min = Math.min(parts[0], parts[1]);
    const rem = min-split;
    const total = Math.pow(2, split) * binomial(nonsplit, rem);
    let count = 0;
    for (const splitSlots of enumerateSets(split)) {
        for (const nonsplitSlots of enumerateSplit(nonsplit, rem)) {
            if (solverService && count % cb_rate == 0) {
                solverService.progress(count, total);
            }
            const sol = merge(splitSlots, nonsplitSlots, groups);
            const cost = cost_fn(sol);
            if (cost < ub) {
                ub = cost;
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
    }
    if (solverService) {
        solverService.finish(true);
    }
    return best;
}

function eligable(instance) {
    return instance.parts.length == 2;
}

export default {
    name: 'Total Enumeration (2-slot specific)',
    run: minimize,
    eligable
};
