import { Random, MersenneTwister19937 }  from 'random-js';

class MutableSolution {
    constructor(instance, cost_fn, seed=19051983) {
        this.instance = instance;
        this.cost_fn = cost_fn;
        if (instance.parts.length > 2) {
            throw 'Only instances with at most two timeslots are supported';
        }
        const split = {}, nonsplit = [];
        for (const [idx,group] of instance.groups.entries()) {
            if (group.split == 1) {
                nonsplit.push(idx);
            }
            else if (group.split == 2) {
                const oi = group.originalIndex;
                if (split[oi]) {
                    split[oi].push(idx);
                }
                else {
                    split[oi] = [idx];
                }
            }
            else {
                throw 'Only an instance with split at most two is supported';
            }
        }

        this.splitIndices = Object.values(split);
        this.nonSplitIndices = nonsplit;

        this.split = Array(this.splitIndices.length).fill(0);
        this.nonsplit = Array(nonsplit.length);
        this.nonsplitA = [];
        this.nonsplitASet = new Set();
        this.nonsplitB = [];
        this.nonsplitBSet = new Set();
        const pivot = instance.parts[0] - this.splitIndices.length;
        for (let i=0; i < nonsplit.length; i++) {
            const idx = nonsplit[i];
            if (i < pivot) {
                this.nonsplit[i] = 0;
                this.nonsplitA.push(idx);
                this.nonsplitASet.add(idx);
            }
            else {
                this.nonsplit[i] = 1;
                this.nonsplitB.push(idx);
                this.nonsplitBSet.add(idx);
            }
        }

        this.solutionArr = Array(this.instance.groups.length);
        for (let i=0; i < this.splitIndices.length; i++) {
            this.updateSplit(i);
        }
        for (const idx of this.nonSplitIndices){
            this.updateNonSplit(idx);
        }

        this.random = new Random(MersenneTwister19937.seed(seed));
    }

    updateSplit(i) {
        // Here split is an index in the list of split indices
        const idxA = this.splitIndices[i][0];
        const idxB = this.splitIndices[i][1];
        const flip = this.split[i] ? 1 : 0;
        this.solutionArr[idxA] = 1 - flip;
        this.solutionArr[idxB] = flip;
    }

    updateNonSplit(i) {
        // Here i is an index in the solution array
        if (this.nonsplitASet.has(i)) {
            this.solutionArr[i] = 0;
        }
        if (this.nonsplitBSet.has(i)) {
            this.solutionArr[i] = 1;
        }
    }

    solution() {
        return [...this.solutionArr];
    }

    objective() {
        return this.cost_fn(this.solutionArr);
    }

    flip(i) {
        // Here i is an index in the list of split indices
        if (this.split[i]) {
            this.split[i] = 0;
        }
        else {
            this.split[i] = 1;
        }
        this.updateSplit(i);
    }

    swap(i,j) {
        // Here i and j are indices in the lists of non-split indices
        const idxA = this.nonsplitA[i];
        const idxB = this.nonsplitB[j];
        this.nonsplitB[j] = idxA;
        this.nonsplitA[i] = idxB;
        this.nonsplitASet.delete(idxA);
        this.nonsplitASet.add(idxB);
        this.nonsplitBSet.delete(idxB);
        this.nonsplitBSet.add(idxA);
        this.updateNonSplit(idxA);
        this.updateNonSplit(idxB);
    }

    greedyStep() {
        let bestMove = null;
        let cur = this.objective();
        for (let i=0; i < this.split.length; i++) {
            this.flip(i);
            const newObj = this.objective();
            if (newObj < cur) {
                const j = i;
                bestMove = () => this.flip(j);
                cur = newObj;
            }
            this.flip(i);
        }
        for (let i=0; i < this.nonsplitA.length; i++) {
            for (let j=0; j < this.nonsplitB.length; j++) {
                this.swap(i, j);
                const newObj = this.objective();
                if (newObj < cur) {
                    const x = i;
                    const y = j;
                    bestMove = () => this.swap(x,y);
                }
                this.swap(i,j);
            }
        }
        if (bestMove != null) {
            bestMove();
        }
        return bestMove != null;
    }

    greedySearch(maxIters=1e6) {
        let iter = 0;
        while (this.greedyStep()) {
            iter++;
            if (iter > maxIters) {
                break;
            }
        }
        return this.solution();
    }

    randomize() {
        for (let i=0; i < this.split.length; i++) {
            if (this.random.bool()) {
                this.flip(i);
                this.updateSplit(i);
            }
        }
        const allSplit = [...this.nonsplitA, ...this.nonsplitB];
        this.random.shuffle(allSplit);
        this.nonsplitA = allSplit.slice(0, this.nonsplitA.length);
        this.nonsplitB = allSplit.slice(this.nonsplitA.length);
        this.nonsplitASet = new Set(this.nonsplitA);
        this.nonsplitBSet = new Set(this.nonsplitB);
        for (const idx of allSplit) {
            this.updateNonSplit(idx);
        }
    }

    randomizedSearch(iters=5000, maxItersGreedy=1e6) {
        this.greedySearch(maxItersGreedy);
        let bestObj = this.objective();
        let bestSol = this.solution();
        for (let i=0; i < iters; i++) {
            this.randomize();
            this.greedyStep(maxItersGreedy);
            const newObj = this.objective();
            if (newObj < bestObj) {
                bestObj = newObj;
                bestSol = this.solution();
            }
        }
        return bestSol;
    }
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

function solve(instance, solverService) {
    const cost = instance_to_cost_fn(instance);
    const ms = new MutableSolution(instance, cost);
    //ms.greedySearch();
    ms.randomizedSearch();
    const solution = ms.solution();
    solverService.solution(solution);
    solverService.finish();
    return solution;
}

function eligable(instance) {
    if (instance.parts.length > 2) {
        return false;
    }
    if (instance.groups.some(grp => grp.split > 2)) {
        return false;
    }
    return true;
}

export default {
    name: 'Split local search',
    run: solve,
    eligable
};