import Vue from 'vue'
import Vuex from 'vuex'

import utils from '../utils';
import { PREFIX, TS_PREFIX } from '../parameters';

Vue.use(Vuex)

function initMatrix(groupCount) {
  const matrix = [];
  for (let i=0; i < groupCount; i++) {
    const row = [];
    for (let j=0; j < groupCount; j++) {
      row.push(0);
    }
    matrix.push(row);
  }
  return matrix;
}

function computeMax(groups, div) {
  return Math.ceil(groups / div);
}

function clearSolution(state) {
  state.solution = null;
  state.solutionQuality = null;
  if (state.worker != null) {
    state.worker.terminate();
    state.worker = null;
  }
  state.solverState = {state: 'empty', progress: 0, progressMsg: ''};
}

function generateGroups(count) {
  const result = [];
  for (let i=1; i <= count; i++) {
    result.push({short: ''+i, full: PREFIX+i, split: 1});
  }
  return result;
}

function computeNumGroups(groups) {
  let result = 0;
  for (const grp of groups) {
    if (Number.isInteger(grp.split)) {
      result += grp.split;
    }
    else {
      result++;
    }
  }
  return result;
}

function expandMatrix(matrix, count) {
  resizeMatrix(matrix, matrix.length, count);
}

function resizeMatrix(matrix, index, count) {
  const n = matrix.length + count;
  if (count > 0) {
    for (const row of matrix) {
      const ins = [];
      for (let s=0; s < count; s++) {
        ins.push(0);
      }
      row.splice(index, 0, ...ins)
    }
    const newRows = [];
    for (let s=0; s < count; s++) {
      const newRow = [];
      for (let i=0; i < n; i++) {
        newRow.push(0);
      }
      newRows.push(newRow);
    }
    matrix.splice(index, 0, ...newRows);
  }
  else if (count < 0){
    matrix.splice(index, -count);
    for (const row of matrix) {
      row.splice(index, -count);
    }
  }
}

function prepareMatrix(matrix, groupView) {
  const result = [];
  for (let i=0; i < groupView.length; i++) {
    const row = [];
    for (let j=0; j < groupView.length; j++) {
      if (groupView[i].originalIndex == groupView[j].originalIndex) {
        //row.push(Number.NEGATIVE_INFINITY);
        row.push(-1e7);
      }
      else {
        row.push(matrix[i][j]);
      }
    }
    result.push(row);
  }
  return result;
}

function maxSplit(groups) {
  let max = 1;
  for (const grp of groups) {
    if (grp.split && Number.isInteger(grp.split)) {
      max = Math.max(max, grp.split);
    }
  }
  return max;
}

function computeMatrixIndex(idx, groups) {
  let result = 0;
  for (let i=0; i < idx; i++) {
    result += groups[i].split;
  }
  return result;
}

function computeSlotNames(count) {
  const result = [];
  for (let i=1; i <= count; i++) {
    result.push(TS_PREFIX+i);
  }
  return result;
}

function updateGroupSize(state) {
  const n = computeNumGroups(state.groups);
  state.numGroups = n;
  state.maxPerGroup = computeMax(n, state.timeslots);
  state.maxSplit = maxSplit(state.groups);
  state.timeslots = Math.max(state.timeslots, state.maxSplit);
  return n;
}

export default new Vuex.Store({
  state: {
    groups: generateGroups(8),
    groupBuffer: [],
    numGroups: 8,
    maxSplit: 1,
    matrix: initMatrix(8),
    timeslots: 3,
    timeslotNames: computeSlotNames(3),
    maxPerGroup: computeMax(8, 3),
    solution: null,
    solutionQuality: null,
    worker: null,
    solverState: {state: 'empty', progress: 0, progressMsg: ''},
    advanced: utils.get_url_param('advanced') ? true : false
  },
  mutations: {
    setGroups(state, payload) {
      clearSolution(state);
      state.groups = [...payload];
      const n = updateGroupSize(state)
      // TODO: it could be nicer to trim/extend the current matrix...?
      state.matrix = initMatrix(n);
    },
    addGroup(state, payload) {
      clearSolution(state);
      state.groups.push(payload);
      updateGroupSize(state)
      expandMatrix(state.matrix, payload.split);
    },
    deleteGroup(state, payload) {
      clearSolution(state);
      const split = state.groups[payload].split;
      const splitIdx = computeMatrixIndex(payload, state.groups);
      state.groups.splice(payload, 1);
      updateGroupSize(state)
      resizeMatrix(state.matrix, splitIdx, split)
    },
    incrementGroups(state, payload) {
      if (state.groupBuffer.length > 0) {
        state.groups.push(state.groupBuffer.pop());
      }
      else {
        const n = state.groups.length+1;
        state.groups.push({short: ''+n, full: PREFIX+n, split: payload});
      }
      updateGroupSize(state);
      expandMatrix(state.matrix, payload);
    },
    decrementGroups(state) {
      const groups = state.groups;
      if (groups.length > 0) {
        const currentSplit = groups[groups.length-1].split;
        state.groupBuffer.push(state.groups.pop());
        updateGroupSize(state);
        resizeMatrix(state.matrix.length-currentSplit, -currentSplit);
      }      
    },
    updateGroupName(state, payload) {
      const grp = state.groups[payload.index];
      grp.short = payload.name;
      grp.full = PREFIX + payload.name;
    },
    updateGroupSplit(state, payload) {
      clearSolution(state);
      const grp = state.groups[payload.index];
      const splitDiff = payload.split - grp.split;
      if (splitDiff == 0) {
        return;
      }
      const idx = computeMatrixIndex(payload.index, state.groups);
      if (splitDiff != 0) {
        resizeMatrix(state.matrix, idx, splitDiff);
      }
      Vue.set(grp, 'split', payload.split);
      const n = computeNumGroups(state.groups);
      state.numGroups = n;
      state.maxPerGroup = computeMax(n, state.timeslots);
      state.maxSplit = maxSplit(state.groups);
      state.timeslots = Math.max(state.timeslots, state.maxSplit);
    },
    setMatrix(state, payload) {
      clearSolution(state);
      Vue.set(state, 'matrix', payload);
    },
    setOverlap(state, payload) {
      clearSolution(state);
      const overlap = parseInt(payload.value);
      Vue.set(state.matrix[payload.row], payload.col, overlap);
      Vue.set(state.matrix[payload.col], payload.row, overlap);
    },
    setSlots(state, payload) {
      clearSolution(state);
      const timeslots = parseInt(payload);
      if (!Number.isInteger(timeslots) || timeslots < state.maxSplit) {
        Vue.set(state, 'solverState', {state: 'error', progressMsg: 'Het aantal tijdsloten moet een geheel getal zijn dat tenminste '+state.maxSplit+' is'});
      }
      else {
        state.timeslots = timeslots;
        state.timeslotNames = computeSlotNames(timeslots);
        state.maxPerGroup = computeMax(state.numGroups, payload);
      }
    },
    updateSlotName(state, payload) {
      Vue.set(state.timeslotNames, payload.index, payload.name);
    },
    setMaxGroups(state, payload) {
      clearSolution(state);
      const maxGroups = parseInt(payload);
      if (!Number.isInteger(maxGroups) || maxGroups < state.maxSplit) {
        Vue.set(state, 'solverState', {state: 'error', progressMsg: 'Het aantal tijdsloten moet een geheel getal zijn dat tenminste '+state.maxSplit+' is'});
      }
      else {
        state.maxPerGroup = maxGroups;
        state.timeslots = computeMax(state.numGroups, maxGroups);
        state.timeslotNames = computeSlotNames(state.timeslots);
      }
    },
    clearSolution(state) {
      clearSolution(state);
    },
    setSolution(state, payload) {
      state.solution = payload;
      state.solutionQuality = utils.compute_conflicts(payload, state.matrix);
    },
    setWorker(state, worker) {
      if (state.worker) {
        state.worker.terminate();
      }
      state.worker = worker;
    },
    setProgress(state, payload) {
      Vue.set(state, 'solverState', payload);
      //state.solverState = payload;
      //console.log(payload);
    },
    setAdvanced(state, payload) {
      state.advanced = payload;
    }
   },
  actions: {
    updateSolution({commit, state, getters}, payload) {
      if (!state.solution) {
        commit('setSolution', payload);
        return;
      }
      const oldQuality = utils.compute_conflicts(state.solution, getters.solveMatrix);
      const quality = utils.compute_conflicts(payload, getters.solveMatrix);
      if (oldQuality.cost > quality.cost) {
        commit('setSolution', payload);
      }
    },
    solve({commit, state, getters, dispatch}) {
      if (!Number.isInteger(state.timeslots) || !Number.isInteger(state.maxPerGroup)
      || state.timeslots < state.maxSplit || state.maxPerGroup < 1
      || state.timeslots * state.maxPerGroup < state.groupCount) {
        commit('setProgress',{state: 'error', progressMsg: 'Het is niet mogelijk om met deze instellingen een verdeling te berekenen. Repareer de instellingen.'});
        return;
      }
      if (state.solverState && state.solverState.state == 'error') {
        return;
      }
      commit('clearSolution');
      //console.log(!Number.isInteger(state.timeslots) , !Number.isInteger(state.maxPerGroup)
      //, state.timeslots < state.maxSplit , state.maxPerGroup < 1
      //, state.timeslots * state.maxPerGroup < state.groupCount);

      //const worker = new Worker('../algorithms.js', { type: 'module' });
      const worker = new Worker('../solver-worker.js', { type: 'module' });
      worker.onmessage = event => {
        const data = event.data;
        const type = data.type;
        const payload = data.payload;
        if (type == 'solution') {
          dispatch('updateSolution', payload);
        }
        else if (type == 'progress') {
          commit('setProgress', payload);
        }
        else {
          console.log('Unknown message received', data);
        }
      }
      commit('setWorker', worker);
      const instance = {matrix: getters.solveMatrix,
                        parts: getters.division,
                        advanced: state.advanced,
                        groups: getters.groupView};
      worker.postMessage(instance);
    },
    stop({commit}) {
      commit('setWorker', null);
      commit('setProgress', {state: 'done', progress: 1, progressMsg: 'Gestopt door gebruiker', optimal: false});
    }
  },
  getters: {
    division: (state) => {
      // TODO: simplify
      const result = [];
      //Compute the group size of the large groups
      const largeGroupSize = Math.ceil(state.numGroups / state.timeslots);
      let smallGroupSize = largeGroupSize - 1;
      if (state.numGroups % state.timeslots == 0) {
        smallGroupSize = largeGroupSize;
      }
      //Compute the number of large groups
      const numberOfLargeGroups = state.numGroups % state.timeslots;
      const numberOfSmallGroups = state.timeslots - numberOfLargeGroups;
      for (let i=0; i < numberOfLargeGroups; i++) {
        result.push(largeGroupSize);
      }
      for (let i=0; i < numberOfSmallGroups; i++) {
        result.push(smallGroupSize);
      }
      return result;
    },
    solveMatrix: (state, getters) => {
      return prepareMatrix(state.matrix, getters.groupView);
    },
    groupView: (state) => {
      return utils.compute_groupview(state.groups);
    },
    solutionLists: (state, getters) => {
      if (state.solution && state.solution.length != getters.groupView.length) {
        console.log('Strange...', state.solution, getters.groupView);
        console.log(getters);
        return [];
      }
      const result = [];
      if (state.solution) {
        for (let i=0; i < state.timeslots; i++) {
          result.push([]);
        }
        for (let i=0; i < state.solution.length; i++) {
          const slot = state.solution[i];
          if (!result[slot]) {
            console.log('Strange...', result, slot, state.solution, i);
            continue;
          }
          result[slot].push(getters.groupView[i]);
        }
      }
      return result;
    },
    solutionGroupLists: (state, getters) => {
      const result = [];
      if (state.solution) {
        for (const group of state.groups) {
          result.push({group, subgroups: []});
        }
        for (let i=0; i < state.solution.length; i++) {
          const subgroup = getters.groupView[i];
          const timeslot = state.timeslotNames[state.solution[i]];
          result[subgroup.originalIndex].subgroups.push({subgroup, timeslot});
        }
      }
      return result;
    }
  }
})
