import utils from './utils.js';
//import solve_enumerator from './enumerator';
import solve_localsearch from './localsearch';

function progressCallback(current, total) {
    if (current && total) {
        const ratio = current / total;
        postMessage({type: 'progress', payload: {state: 'running', progress: ratio, progressMsg: 'Berekenen: '+current+' / '+total}});
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
    let sol = utils.dummy_solver(data.sizes);
    callbacks.solution(sol);
    progressCallback(0,1);
    setTimeout(() => {
        sol = solve_localsearch(data.matrix, data.sizes).bestDivision;
        callbacks.solution(sol);
        finishCallback();
    }, 1500);
    

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