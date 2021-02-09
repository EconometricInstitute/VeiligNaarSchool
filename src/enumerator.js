
/* ******************** *
 * Enumerator functions *
 * ******************** */

function solve_enumerator(matrix, sizes, upperBound, nCombs, callbacks)
{
    const state = {
        bestCosts: upperBound,
        currentCosts: [],
        currentSolution: [],
        count: 0,
        updateInterval: nCombs / 100 + 1,
        nCombs,
        sizes
    }

    // Initialize some parameters
    let nClasses = 0;
    for(let i = 0; i < sizes.length; i++)
    {
        nClasses += sizes[i];
        state.currentCosts.push(0);
        //state.currentSolution.push(null);
    }
        
    // Create an array with classes and an empty combination
    const classes = [...Array(nClasses).keys()];
    const combination = [];
    
    //console.log(state);
    go(0, sizes[0], 0, classes, combination, matrix, state, callbacks);
    //console.log(state);
    //console.log("Best costs obtained: " + state.bestCosts);
    //console.log(state.count + " partitions have been considered");
    //console.log(state.bestSolution);
    return state;
}

function go(offset, k, group, classes, combination, matrix, state, callbacks) 
{
    //console.log(k, classes, combination);
    if (k == 0) 
    {
        evaluate(group, classes, combination, matrix, state, callbacks);
        return;
    }
    for (let i = offset; i <= classes.length - k; ++i) 
    {
        combination.push(classes[i]);
        go(i+1, k-1, group, classes, combination, matrix, state, callbacks);
        //delete combination[combination.length - 1];
        combination.splice(combination.length-1, 1);
    }
}

function evaluate(group, classes, combination, matrix, state, callbacks) 
{	
    const nClasses = classes.length;
    const sizes = state.sizes;
    // I aim to find the set classes - combination, but this is not trivial. I use a boolean array for that,
    // which might be inefficient.
    const present = Array(nClasses).fill(false);
    for(let i = 0 ; i < nClasses; i++)
    {
        present[i] = false;
    }
    // We first determine classes
    for(let i = 0 ; i < classes.length; i++)
    {
        present[classes[i]] = true;
    }
    // We then subtract combination. At the same time, we compute the costs of this group.
    let costs = 0;
    for(let i = 0 ; i < combination.length; i++)
    {
        present[combination[i]] = false;
        for(let j = i + 1; j < combination.length; j++)
        {
            try {
                const x = combination[i];
            const y = combination[j];
            costs += matrix[x][y];
            }
            catch(err) {
                console.log(err);
                console.log(combination, i);
                break;
            }
        }
    }
    // Set the costs of this group
    state.currentCosts[group] = costs;
    state.currentSolution[group] = combination;
    
    // nextClasses = classes - combination
    const nextClasses = Array(classes.length - sizes[group]);
    let index = 0;
    for(let i = 0 ; i < nClasses; i++)
    {
        if(present[i])
        {
            nextClasses[index] = i;
            index++;
        }
}
    // If any classes are left, optimize them.
    if(nextClasses.length > 0)
    {
        go(0, sizes[group + 1], group + 1, nextClasses, [], matrix, state, callbacks);
    }
    // Otherwise, compute the costs and check whether a better solution has been found.
    else
    {
        state.count++;
        if(state.count % state.updateInterval == 0)
        {
            //console.log(state.count / state.updateInterval + " percent of the options has been considered.");
            callbacks.progress(state.count, state.numCombs);
        }
        
        let thisCosts = 0;
        for(let i = 0; i < sizes.length; i++)
        {
            thisCosts += state.currentCosts[i];
        }
        if(thisCosts > state.bestCosts)
        {
            console.log(state.currentSolution);
            state.bestCosts = thisCosts;
            state.bestSolution = [];
            for(const sol of state.currentSolution) 
            {
                const newGroup = [];
                for(const i of sol)
                {
                    newGroup.push(i);
                }
                state.bestSolution.push(newGroup);
            }
            callbacks.solution(state.bestSolution);
        }
    }
}

// function test() {
//     const matrix = [[0,1,0,1,0,1,1,1,1,0,0,1,1,0,1,0,1,0],
//                     [1,0,1,0,1,0,1,1,1,0,0,1,1,0,0,0,1,0],
//                     [0,1,0,1,1,0,1,0,1,0,0,1,1,0,0,1,0,0],
//                     [1,0,1,0,1,1,0,0,0,0,1,0,1,0,1,1,0,1],
//                     [0,1,1,1,0,0,1,0,1,0,0,1,1,0,1,1,0,0],
//                     [1,0,0,1,0,0,1,1,1,0,0,0,1,1,0,1,1,1],
//                     [1,1,1,0,1,1,0,1,1,0,0,0,1,0,0,0,0,0],
//                     [1,1,0,0,0,1,1,0,1,0,1,1,0,1,0,0,0,1],
//                     [1,1,1,0,1,1,1,1,0,0,1,0,0,0,1,1,1,1],
//                     [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1],
//                     [0,0,0,1,0,0,0,1,1,0,0,1,0,0,0,0,1,0],
//                     [1,1,1,0,1,0,0,1,0,0,1,0,1,0,1,0,1,1],
//                     [1,1,1,1,1,1,1,0,0,1,0,1,0,0,0,0,1,1],
//                     [0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,1],
//                     [1,0,0,1,1,0,0,0,1,1,0,1,0,0,0,0,0,0],
//                     [0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0],
//                     [1,1,0,0,0,1,0,0,1,0,1,1,1,0,0,0,0,1],
//                     [0,0,0,1,0,1,0,1,1,1,0,1,1,1,0,0,1,0]];
//     const sizes = [5,5,4,4];
//     const ub = 28;
//     const nCombs = 771891120;
//     let tic = Date.now();
//     let best = solve_enumerator(matrix, sizes, ub, nCombs);
//     let toc = Date.now();
//     console.log((toc - tic + 0.0) / 1000 + " seconds");
//     console.log(best);
// }

export default solve_enumerator;