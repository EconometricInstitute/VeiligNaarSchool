// TODO: make this count_combinations?
function compute_combinations(sizes) {
    let n = sizes.reduce((a,b) => a+b, 0);
    let nCombs = 1.0;
    for(let i = 0; i < sizes.length; i++)
    {
        for(let j = 1; j <= sizes.length; j++)
        {
            nCombs *= n;
            nCombs /= j;
            n--;
        }
    }
    return nCombs;
}

function dummy_solver(sizes) {
    console.log(sizes);
    const result = [];
    let cur = 0;
    for (const size of sizes) {
        for (let i=0; i < size; i++) {
            result.push(cur);
        }
        cur++;
    }
    return result;
}

function compute_conflicts(solution, matrix) {
    let cost = 0;
    let total = 0;
    let conflicts = [];
    for (let row=0; row < matrix.length; row++) {
        for (let col=row+1; col < matrix.length; col++) {
            const entry = matrix[row][col];
            total += entry;
            if (entry > 0 && solution[row] != solution[col]) {
                cost += entry;
                conflicts.push({class1: row, class2: col, costs: entry});
            }
        }
    }
    return {cost, honored: total-cost, total, conflicts};
}

function compute_groupview(groups) {
    const result = [];
    for (const [index, group] of groups.entries()) {
      if (group.split == 1) {
        result.push({...group, originalIndex: index, copy: 1});
      }
      else {
        for (let i=0; i < group.split; i++) {
          //const postfix = ' ('+(i+1)+'/'+group.split+')';
          const postfix = ' ('+(i+1)+')';
          result.push({...group,
                        short: group.short + postfix,
                        full: group.full + postfix,
                        originalIndex: index,
                        copy: (i+1)});
        }
      }
    }
    return result;
}


function get_url_param(param) {
    if (window && window.location && window.location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }
    return undefined;
  }

export default {dummy_solver,
                compute_conflicts,
                compute_combinations,
                compute_groupview,
                get_url_param};