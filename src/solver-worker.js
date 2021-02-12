import SolverService from './solver';
import algorithms from './algorithms/index';

function objective(solution, instance) {
    let result = 0;
    const matrix = instance.matrix;
    for (let i=0; i < matrix.length; i++) {
        for (let j=i+1; j < matrix.length; j++) {
            if (solution[i] != solution[j]) {
                result += matrix[i][j];
            }
        }
    }
    return result;
}

function validate(solution, instance) {
    if (solution.length != instance.matrix.length) {
        return false;
    }
    const count = {};
    for (let i=0; i < solution.length; i++) {
        const ts = solution[i];
        if (count[ts]) {
            count[ts]++;
        }
        else {
            count[ts] = 1;
        }
    }
    let cmp = Array(instance.parts.length);
    for (let [index, size] of instance.parts.entries()) {
        cmp[index] = size;
    }
    cmp = cmp.sort()
    const cmp2 = instance.parts.sort();
    for (let i=0; i < cmp.length; i++) {
        if (cmp[i] != cmp2[i]) {
            return false;
        }
    }
    return true;
}

const service = new SolverService(algorithms, objective, validate);

addEventListener('message', event => {
    const instance = event.data;
    service.solve(instance);

    //let sol = utils.dummy_solver(data.sizes);
    //callbacks.solution(sol);
    // progressCallback(0,1);
    // let sol = solve_localsearch(data.matrix, data.sizes).bestDivision;
    // callbacks.solution(sol);
    // console.log(sol);
    // finishCallback();
    // const cost_fn = enumerate.matrix_to_cost_fn(data.matrix);
    // sol = enumerate.minimize(data.sizes, cost_fn, callbacks);
    // console.log(sol);
    // finishCallback(true);

    // Old timeout based code
    
    // setTimeout(() => {
    //     let sol = solve_localsearch(data.matrix, data.sizes).bestDivision;
    //     callbacks.solution(sol);
    //     finishCallback();
    // }, 1500);
});