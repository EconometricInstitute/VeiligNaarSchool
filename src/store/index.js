import Vue from 'vue'
import Vuex from 'vuex'

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

export default new Vuex.Store({
  state: {
    groups: [],
    numGroups: 0,
    matrix: initMatrix(0),
    timeslots: 2,
    maxPerGroup: computeMax(0, 2),
    maxFocus: true,
    solution: null
  },
  mutations: {
    setGroups(state, payload) {
      state.groups = [...payload];
      state.numGroups = payload.length;
      state.maxPerGroup = computeMax(payload.length, state.timeslots);
      // TODO: it could be nicer to trim/extend the current matrix...?
      state.matrix = initMatrix(payload.length);
      state.solution = null;
      console.log(state);
    },
    setOverlap(state, payload) {
      const overlap = parseInt(payload.value);
      console.log('Setting overlap', payload);
      Vue.set(state.matrix[payload.row], payload.col, overlap);
      Vue.set(state.matrix[payload.col], payload.row, overlap);
      state.solution = null;
      console.log(state.matrix);
    },
    setSlots(state, payload) {
      state.timeslots = payload;
      state.maxPerGroup = computeMax(state.numGroups, payload);
      state.solution = null;
    },
    setMaxGroups(state, payload) {
      state.maxPerGroup = payload;
      state.timeslots = computeMax(state.numGroups, payload);
      state.solution = null;
    },
    setMaxFocus(state, payload) {
      state.maxFocus = payload;
      state.solution = null;
    },
    setSolution(state, payload) {
      state.solution = payload;
    }
   },
  actions: {
 },
  modules: {
  },
  getters: {
    division: (state) => {
      const result = [];
      if (state.numGroups % state.timeslots == 0) {
        console.log('Case 1');
        for (let i=0; i < state.timeslots; i++) {
          result.push(state.maxPerGroup);
        }
      }
      else if (state.maxFocus) {
        console.log('Case 2');
        const large = state.numGroups % state.timeslots;
        for (let i=0; i < large; i++) {
          result.push(state.maxPerGroup);
        }
        for (let i=0; i < state.timeslots - large; i++) {
          result.push(state.maxPerGroup - 1);
        }
      }
      else {
        console.log('Case 3');
        let cur = state.numGroups;
        while (cur > state.maxPerGroup) {
          result.push(state.maxPerGroup);
          cur -= state.maxPerGroup;
        }
        result.push(cur);
      }
      console.log(result);
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
