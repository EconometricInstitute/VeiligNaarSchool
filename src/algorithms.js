//import utils from './utils.js';
//import solve_enumerator from './enumerator';
import solve_localsearch from './localsearch';
import enumerate from './enumerate2';

function progressCallback(current, total) {
    if (current && total) {
        const ratio = current / total;
        const format = (100 * ratio).toFixed(1)+'% ('+current+' uit '+total+' mogelijkheden bekeken)';
        postMessage({type: 'progress', payload: {state: 'running', progress: ratio, progressMsg: format, indeterminate: true}});
    }
    else {
        postMessage({type: 'progress', payload: {state: 'running', progress: 0, progressMsg: 'Berekenen...', indeterminate: true}});
    }
}

function finishCallback(optimal) {
    if (optimal) {
        console.log('Optimal!!');
        postMessage({type: 'progress', payload: {state: 'optimal', progress: 1, progressMsg: 'Best mogelijke gevonden.'}});
    }
    else {
        postMessage({type: 'progress', payload: {state: 'done', progress: 1, progressMsg: 'Klaar.'}});
    }
}

function solutionCallback(solution) {
    postMessage({type: 'solution', payload: solution});
}

const callbacks = {
    progress: progressCallback,
    finish: finishCallback,
    solution: solutionCallback
};

addEventListener('message', event => {
    const data = event.data;
    //let sol = utils.dummy_solver(data.sizes);
    //callbacks.solution(sol);
    progressCallback(0,1);

    if (data.advanced) {
        let sol = solve_localsearch(data.matrix, data.sizes).bestDivision;
        callbacks.solution(sol);
        console.log(sol);
        finishCallback();
    
        if (data.advanced) {
            const cost_fn = enumerate.matrix_to_cost_fn(data.matrix);
            sol = enumerate.minimize(data.sizes, cost_fn, callbacks);
            console.log(sol);
            finishCallback(true);
        }    
    }
    else {
        setTimeout(() => {
            let sol = solve_localsearch(data.matrix, data.sizes).bestDivision;
            callbacks.solution(sol);
            finishCallback();
        }, 1500);
    }

    

    /*
    const nCombs = utils.compute_combinations(data.sizes);
    const quality = utils.compute_conflicts(sol, data.matrix);
    if (quality.cost > 0) {
        console.log('Running Enumerator');
        const ub = quality.honored;
        //solve_enumerator(data.matrix, data.sizes, ub, nCombs, callbacks);
        console.log('Enumerator done.');
    } 
    */   
    //finishCallback(true);
});