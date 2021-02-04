function solve_localsearch(matrix, sizes)
{
    // Initialize some parameters
    let nClasses = 0;
    for(let i = 0; i < sizes.length; i++)
    {
        nClasses += sizes[i];
    }
    
    const division = Array(nClasses);
    let index = 0;
    for(let i = 0; i < sizes.length; i++) 
    {
        for(let j = 0; j < sizes[i]; j++)
        {
            division[index] = i;
            index++;
        }
    }
    let bestDivision = Array(nClasses);
    copy(division, bestDivision);
    let currentCosts = computeCosts(division, sizes.length, matrix);
    console.log("New costs: " + currentCosts);
    
    let cont = true;
    while(cont)
    {
        cont = false;
        for(let i = 0; i < nClasses; i++)
        {
            // Reposition
            let currentGroup = division[i];
            for(let j = 0; j < sizes.length; j++)
            {
                if(sizes[currentGroup] > sizes[j]) 
                {
                    division[i] = j;
                    const newCosts = computeCosts(division, sizes.length, matrix);
                    if(newCosts > currentCosts)
                    {
                        console.log("New costs: " + newCosts);
                        currentCosts = newCosts;
                        copy(division, bestDivision);
                        cont = true;
                        sizes[currentGroup] = sizes[currentGroup] - 1;
                        sizes[j] = sizes[currentGroup] + 1;
                        
                    }
                    else
                    {
                        division[i] = currentGroup;
                    }
                }
            }
            
            // Swap
            for(let j = i + 1; j < nClasses; j++)
            {
                if(division[i] != division[j])
                {
                    let temp = division[i];
                    division[i] = division[j];
                    division[j] = temp;

                    let newCosts = computeCosts(division, sizes.length, matrix);
                    if(newCosts > currentCosts)
                    {
                        console.log("New costs: " + newCosts);
                        currentCosts = newCosts;
                        copy(division, bestDivision);
                        cont = true;
                        
                    }
                    else
                    {
                        temp = division[i];
                        division[i] = division[j];
                        division[j] = temp;	
                    }
                }	
            }
        }
    }
    console.log(bestDivision);
    return {currentCosts, bestDivision};
}

function copy(a, b)
{
    for(let i = 0; i < a.length; i++)
    {
        b[i] = a[i];
    }
}

function computeCosts(division, numberOfGroups, matrix) 
{
    let costs = 0;
    for(let i = 0; i < numberOfGroups; i++) 
    {
        const currentClass = [];
        for(let j = 0; j < division.length; j++)
        {
            if(division[j] == i)
            {
                currentClass.push(j);
            }
        }
        for(let j = 0; j < currentClass.length; j++)
        {
            for(let k = j + 1; k < currentClass.length; k++)
            {
                costs += matrix[currentClass[j]][currentClass[k]];
            }
        }
    }
    return costs;
}

export default solve_localsearch;