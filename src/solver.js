class SolverService {
    constructor(algorithms, objective, validate, minimize=true, logging=true, reportGap=15000) {
        this.algorithms = algorithms;
        this.currentAlgorithm = null;
        this.logging = logging;
        this.minimize = minimize;
        this.objective = objective;
        this.validate = validate;
        this.reportGap = reportGap;
    }

    progress(current, total) {
        if (current && total) {
            const ratio = current / total;
            const format = (100 * ratio).toFixed(1)+'% ('+current+' uit '+total+' mogelijkheden bekeken)';
            postMessage({type: 'progress', payload: {state: 'running', progress: ratio, current, total, progressMsg: format, indeterminate: true, algorithm: this.currentAlgorithm}});
        }
        else {
            postMessage({type: 'progress', payload: {state: 'running', progress: 0, progressMsg: 'Berekenen...', indeterminate: true, algorithm: this.currentAlgorithm}});
        }
        this.reportLine(true);
    }

    finish(optimal) {
        if (optimal) {
            postMessage({type: 'progress', payload: {state: 'optimal', progress: 1, progressMsg: 'Best mogelijke gevonden.', algorithm: this.currentAlgorithm}});
            this.optimal = true;
        }
        else {
            postMessage({type: 'progress', payload: {state: 'done', progress: 1, progressMsg: 'Klaar.', algorithm: this.currentAlgorithm}});
        }
        this.reportLine(true);
    }

    bound(bound) {
        if (this.minimize) {
            this.lowerBound = Math.max(this.lowerBound, bound);
        }
        else {
            this.upperBound = Math.min(this.upperBound, bound);
        }
    }

    solution(solution) {
        if (solution.includes(undefined)) {
            console.log('Solution contains undefined', solution);
            console.trace();
        }
        const instance = this.currentInstance;
        const minimize = this.minimize;
        if (this.validate && !this.validate(solution, instance)) {
            this.warn(`Algorithm ${this.currentAlgorithm} produced an invalid solution. It was rejected.`, solution, instance);
            return;
        }
        if (this.objective) {
            const objVal = this.objective(solution, instance);
            if (!this.bestValue || (minimize && objVal < this.bestValue) || (!minimize && objVal > this.bestValue)) {
                this.bestValue = objVal;
                this.bestSolution = solution;
                if (minimize) {
                    this.upperBound = objVal;
                }
                else {
                    this.lowerBound = objVal;
                }
                // TODO: perform optimality detection?
            }
        }
        postMessage({type: 'solution', payload: solution, algorithm: this.currentAlgorithm});
    }

    reset() {
        this.currentInstance = null;
        this.bestSolution = null;
        this.bestValue = null;
        this.lowerBound = Number.NEGATIVE_INFINITY;
        this.upperBound = Number.POSITIVE_INFINITY;
        this.optimal = false;
    }

    log(...msg) {
        if (this.logging) {
            console.log('%c[SolverService]','font-weight: bold; background-color: #cccccc',...msg);
        }
    }

    warn(...msg) {
        if (this.logging) {
            console.warn('%c[SolverService]%c WARNING','font-weight: bold; background-color: #cccccc', 'font-weight: bolder; color: orange;', msg);
        }
    }

    justify(val, postfix='', decimals=6, justify=24) {
        if (typeof val == 'number') {
            return (val.toFixed(decimals)+postfix).padEnd(justify, ' ');
        }
        if (typeof val == 'undefined' || val == null) {
            return ''.padEnd(justify, ' ');
        }
        return (''+val+postfix).padEnd(justify, ' ');
    }

    relativeGap() {
        const bound = this.minimize ? this.lowerBound : this.upperBound;
        if (bound) {
            return Math.abs(bound - this.bestValue)/(1e-10 + Math.abs(this.bestValue));
        }
        return Number.POSITIVE_INFINITY;
    }

    reportHead() {
        if (this.logging) {
            const timeHead = this.justify('Runtime (seconds)')
            const objHead = this.justify('Objective');
            const lbHead = this.justify('Lower Bound');
            const ubHead = this.justify('Upper Bound');
            const gapHead = this.justify('Relative Gap');
            this.log(timeHead+objHead+lbHead+ubHead+gapHead);
        }
    }

    reportLine(enforceGap=false) {
        if (enforceGap && this.lastReport && Date.now() - this.lastReport <= this.reportGap) {
            return;
        }
        if (this.logging) {
            const timeStr = this.justify((Date.now()-this.startTime)/1000);
            const objStr = this.justify(this.bestValue);
            const lbStr = this.justify(this.lowerBound);
            const ubStr = this.justify(this.upperBound);   
            const gap = 100 * this.relativeGap();
            const gapStr = this.justify(100*gap, '%');
            this.log(timeStr+objStr+lbStr+ubStr+gapStr);
            this.lastReport = Date.now();
        }
    }

    solve(instance) {
        this.log('------ START SOLVING ------');
        this.log('Received instance for solving', instance);
        this.reset();
        this.currentInstance = instance;
        for (let algorithm of this.algorithms) {
            this.startTime = Date.now();
            if (algorithm.eligable && !algorithm.eligable(instance)) {
                this.log(`Skipping algorithm ${algorithm.name} as it is not suitable for this instance.`);
                continue;
            }
            this.currentAlgorithm = algorithm.name;
            this.log(`Running algorithm ${algorithm.name}`);
            this.reportHead();
            this.progress();
            try {
                algorithm.run(instance, this);
                const end = Date.now();
                const seconds = (end-this.startTime)/1000;
                this.reportLine();
                this.log(`Algorithm ${algorithm.name} finished running after ${seconds} seconds`);
                this.currentAlgorithm = null;
                this.startTime = null;
                if (this.optimal) {
                    this.log(`Optimal solution found. No more algorithms will be executed`)
                    this.log('------ END SOLVING ------');
                    return;
                }
            }
            catch (err) {
                this.warn(`Algorithm ${algorithm.name} did not run successfully. ${err.name} - ${err.message}`);
                this.warn(err);
            }
        }
        this.log('No more algorithms to run, but no (proven) optimal solution was found.')
        this.log('------  END SOLVING  ------');
    }
}

export default SolverService;