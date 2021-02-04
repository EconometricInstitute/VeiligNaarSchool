import solve_enumerator from './enumerator';
import solve_localsearch from './localsearch';
import { Random, MersenneTwister19937 }  from 'random-js';

function main()
{
    const sizes = [5,5,4,4];
    // Define the instance

    let nClasses = 0;
    for(let i = 0; i < sizes.length; i++)
    {
        nClasses += sizes[i];
    }
            
    let rand = new Random(MersenneTwister19937.seed(19051983));
    let matrix = [];
    for (let i=0; i < nClasses; i++) {
        matrix.push(Array(nClasses));
    }
    
    let total = 0;
    for(let i = 0; i < nClasses; i++)
    {
        for(let j = i + 1; j < nClasses; j++)
        {
            matrix[i][j] = rand.integer(0,1);
            total += matrix[i][j];
            matrix[j][i] = matrix[i][j];
        }
        matrix[i][i] = 0;
    }
    console.log("total number of connections: " + total);
    console.log(matrix);

    // Compute the number of combinations
    let nCombs = 1.0;
    let n = nClasses;
    for(let i = 0; i < sizes.length; i++)
    {
        for(let j = 1; j <= sizes.[i]; j++)
        {
            nCombs *= n;
            nCombs /= j;
            n--;
        }
    }
    console.log(nCombs + " combinations");
    
    let tic = Date.now();
    let best = solve_localsearch(matrix, sizes);
    let toc = Date.now();
    console.log((toc - tic + 0.0) / 1000 + " seconds");
    
    tic = Date.now();
    const sol = solve_enumerator(matrix, sizes, best, nCombs);
    console.log(sol);
    toc = Date.now();
    console.log((toc - tic + 0.0) / 1000 + " seconds");
}

export default main;