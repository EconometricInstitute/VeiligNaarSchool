import Vue from 'vue'
import Vuex from 'vuex'
import utils from '../utils';

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

export default new Vuex.Store({
  state: {
    groups: [],
    numGroups: 0,
    matrix: initMatrix(0),
    timeslots: 2,
    maxPerGroup: computeMax(0, 2),
    solution: null,
    solutionQuality: null,
    worker: null,
    solverState: {state: 'empty', progress: 0, progressMsg: ''}
  },
  mutations: {
    setGroups(state, payload) {
      state.groups = [...payload];
      state.numGroups = payload.length;
      state.maxPerGroup = computeMax(payload.length, state.timeslots);
      // TODO: it could be nicer to trim/extend the current matrix...?
      state.matrix = initMatrix(payload.length);
      clearSolution(state);
    },
    setOverlap(state, payload) {
      const overlap = parseInt(payload.value);
      Vue.set(state.matrix[payload.row], payload.col, overlap);
      Vue.set(state.matrix[payload.col], payload.row, overlap);
      clearSolution(state);
    },
    setSlots(state, payload) {
      state.timeslots = payload;
      state.maxPerGroup = computeMax(state.numGroups, payload);
      clearSolution(state);
    },
    setMaxGroups(state, payload) {
      state.maxPerGroup = payload;
      state.timeslots = computeMax(state.numGroups, payload);
      clearSolution(state);
    },
    setSolution(state, payload) {
      state.solution = payload;
      state.solutionQuality = utils.compute_conflicts(payload, state.matrix);
    },
    updateSolution(state, payload) {
      const quality = utils.compute_conflicts(payload, state.matrix);
      if (!state.solution || state.solutionQuality.cost > quality.cost) {
        state.solution = payload;
        state.solutionQuality = quality;
      }
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
    solve({commit, state, getters}) {
      const worker = new Worker('../algorithms.js', { type: 'module' });
      worker.onmessage = event => {
        const data = event.data;
        const type = data.type;
        const payload = data.payload;
        if (type == 'solution') {
          commit('updateSolution', payload);
        }
        else if (type == 'progress') {
          commit('setProgress', payload);
        }
        else {
          console.log('Unknown message received', data);
        }
      }
      commit('setWorker', worker);
      const instance = {matrix: state.matrix, sizes: getters.division};
      worker.postMessage(instance);
    },
    stop({commit}) {
      commit('setWorker', null);
      commit('setProgress', {state: 'done', progress: 1, progressMsg: 'Gestopt door gebruiker', optimal: false});
    }
  },
  modules: {
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


      /*
      if (state.numGroups % state.timeslots == 0) {
        for (let i=0; i < state.timeslots; i++) {
          result.push(state.maxPerGroup);
        }
      }
      else if (state.maxFocus) {
        const large = state.numGroups % state.timeslots;
        for (let i=0; i < large; i++) {
          result.push(state.maxPerGroup);
        }
        for (let i=0; i < state.timeslots - large; i++) {
          result.push(state.maxPerGroup - 1);
        }
      }
      else {
        let cur = state.numGroups;
        while (cur > state.maxPerGroup) {
          result.push(state.maxPerGroup);
          cur -= state.maxPerGroup;
        }
        result.push(cur);
      }
      */
      return result;
    },
    divisionPairs: (state) => {
      if (state.numGroups % state.timeslots == 0) {
        return [[state.maxPerGroup, state.timeslots]];
      }
      if (state.maxFocus) {
        const large = state.numGroups % state.timeslots;
        return [[state.maxPerGroup, large], [state.maxPerGroup-1, state.timeslots-large]];
      }
      return [[state.maxPerGroup, state.timeslots-1], [state.numGroups % state.maxPerGroup, 1]];
    },
    solutionLists: (state) => {
      const result = [];
      if (state.solution) {
        for (let i=0; i < state.timeslots; i++) {
          result.push([]);
        }
        for (let i=0; i < state.solution.length; i++) {
          const slot = state.solution[i];
          result[slot].push(state.groups[i]);
        }
      }
      return result;
    }
  }
})
