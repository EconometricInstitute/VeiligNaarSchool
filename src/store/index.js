import Vue from 'vue'
import Vuex from 'vuex'

import utils from '../utils';
import { PREFIX } from '../parameters';

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

export default new Vuex.Store({
  state: {
    groups: generateGroups(8),
    numGroups: 8,
    matrix: initMatrix(8),
    timeslots: 3,
    maxPerGroup: computeMax(8, 3),
    solution: null,
    solutionQuality: null,
    worker: null,
    solverState: {state: 'empty', progress: 0, progressMsg: ''}
  },
  mutations: {
    setGroups(state, payload) {
      state.groups = [...payload];
      const n = computeNumGroups(payload);
      state.numGroups = n;
      state.maxPerGroup = computeMax(n, state.timeslots);
      // TODO: it could be nicer to trim/extend the current matrix...?
      state.matrix = initMatrix(n);
      clearSolution(state);
    },
    addGroup(state, payload) {
      state.groups.push(payload);
      const n = computeNumGroups(state.groups);
      state.numGroups = n;
      state.maxPerGroup = computeMax(n, state.timeslots);
      expandMatrix(state.matrix, payload.split);
      clearSolution(state);
    },
    deleteGroup(state, payload) {
      const split = this.groups[payload].split;
      state.groups.splice(payload, split);
      const n = computeNumGroups(state.groups);
      state.numGroups = n;
      state.maxPerGroup = computeMax(n, state.timeslots);
      resizeMatrix(state.matrix, payload, split)
      clearSolution(state);
    },
    updateGroupName(state, payload) {
      state.groups[payload.index] = payload.group;
    },
    updateGroupSplit(state, payload) {
      const grp = state.groups[payload.index];
      const splitDiff = payload.split - grp.split;
      if (splitDiff != 0) {
        resizeMatrix(state.matrix, payload.index, splitDiff);
      }
      Vue.set(grp, 'split', payload.split);
      const n = computeNumGroups(state.groups);
      state.numGroups = n;
      state.maxPerGroup = computeMax(n, state.timeslots);
    },
    setMatrix(state, payload) {
      Vue.set(state, 'matrix', payload);
      clearSolution(state);
    },
    setOverlap(state, payload) {
      const overlap = parseInt(payload.value);
      Vue.set(state.matrix[payload.row], payload.col, overlap);
      Vue.set(state.matrix[payload.col], payload.row, overlap);
      clearSolution(state);
    },
    setSlots(state, payload) {
      clearSolution(state);
      const timeslots = parseInt(payload);
      if (!Number.isInteger(timeslots) || timeslots < 1) {
        Vue.set(state, 'solverState', {state: 'error', progressMsg: 'Het aantal tijdsloten moet een geheel getal groter dan nul zijn'});
      }
      else {
        state.timeslots = timeslots;
        state.maxPerGroup = computeMax(state.numGroups, payload);
      }
    },
    setMaxGroups(state, payload) {
      clearSolution(state);
      const maxGroups = parseInt(payload);
      if (!Number.isInteger(maxGroups) || maxGroups < 1) {
        Vue.set(state, 'solverState', {state: 'error', progressMsg: 'Het maximum aantal groepen moet een geheel getal groter dan nul zijn'});
      }
      else {
        state.maxPerGroup = maxGroups;
        state.timeslots = computeMax(state.numGroups, maxGroups);
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
      commit('clearSolution');
      console.log(state.timeslots, state.maxPerGroup);
      console.log(!Number.isInteger(state.timeslots), !Number.isInteger(state.maxPerGroup)
      , state.timeslots < 1 , state.maxPerGroup < 1
      , state.timeslots * state.maxPerGroup < state.groupCount);
      if (!Number.isInteger(state.timeslots) || !Number.isInteger(state.maxPerGroup)
        || state.timeslots < 1 || state.maxPerGroup < 1
        || state.timeslots * state.maxPerGroup < state.groupCount) {
          commit('setProgress',{state: 'error', progressMsg: 'Het is niet mogelijk om met deze instellingen een verdeling te berekenen. Repareer de instellingen.'});
      }
      const worker = new Worker('../algorithms.js', { type: 'module' });
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
      const instance = {matrix: getters.solveMatrix, sizes: getters.division};
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
      const result = [];
      for (const [index, group] of state.groups.entries()) {
        if (group.split == 1) {
          result.push({...group, originalIndex: index, copy: 1});
        }
        else {
          for (let i=0; i < group.split; i++) {
            const postfix = ' ('+(i+1)+'/'+group.split+')';
            result.push({...group,
                          short: group.short + postfix,
                          full: group.full + postfix,
                          originalIndex: index,
                          copy: 2});
          }
        }
      }
      return result;
    },
    solutionLists: (state, getters) => {
      const result = [];
      if (state.solution) {
        for (let i=0; i < state.timeslots; i++) {
          result.push([]);
        }
        for (let i=0; i < state.solution.length; i++) {
          const slot = state.solution[i];
          result[slot].push(getters.groupView[i]);
        }
      }
      return result;
    }
  }
})
