// TODO: make this count_combinations?
function count_combinations(parts) {
    let result = 1;
    let n = parts.reduce((a,b) => parseInt(a)+parseInt(b), 0);
    for(let i = 0; i < parts.length; i++)
    {
        for(let j = 1; j <= parts[i]; j++)
        {
            result *= n;
            result /= j;
            n--;
        }
    }
    return result;
}

function* combinations(n, k) {
    // Based on https://github.com/exromany/combinations-generator, but heavily modified
    const keys = Array(k).fill(-1);
    let i = 0;
    while (i >= 0) {
        if (keys[i] < n - (k - i)) {
            for (let key=keys[i] - i + 1; i < k; i++) {
                keys[i] = key + i;
            }
            yield keys;
        }
        else {
            i--;
        }
    }
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

function compute_lb(matrix) {
    let result = 0;
    for (let i=0; i < matrix.length; i++) {
        for (let j=i+1; j < matrix.length; j++) {
            const entry = matrix[i][j];
            if (entry < 0) {
                result += matrix[i][j]
            }
        }
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
                compute_lb,
                compute_conflicts,
                count_combinations,
                combinations,
                compute_groupview,
                get_url_param};