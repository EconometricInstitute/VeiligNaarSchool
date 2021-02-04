<template>
  <v-card>
    <v-container align="start">
      <v-row align="start">
        <v-col cols="3">
          <v-text-field label="Aantal Tijdsloten" :value="timeslots" @input="setSlots" type="number" min="1" />
        </v-col>
      </v-row>
      <v-row align="start">
        <v-col cols="3">
          <v-text-field label="Maximum aantal groepen per tijdslot" :value="maxPerGroup" @input="setMax" type="number" min="1" />
        </v-col>
      </v-row>
      <v-row align="start">
        <v-col cols="3">
          <v-radio-group label="Focus van Verdeling" :value="maxFocus" @input="setFocus">
            <v-radio label="Maximaliseer Spreiding" :value="true" />
            <v-radio label="Minimaliseer Conflicten" :value="false" />
          </v-radio-group>
        </v-col>
        <v-spacer />
      </v-row>
      <v-row align="start">
        <v-col cols="6">
          <div>
            <h4>Huidige Verdeling</h4>
            <ul>
              <template v-for="div of divisionPairs">
                <li v-if="div[1] == 1" :key="div[0]">1 tijdslot met {{div[0]}} klassen</li>
                <li v-else :key="div[0]">{{div[1]}} tijdsloten met {{div[0]}} klassen</li>
              </template>
            </ul>
          </div>
        </v-col>
        <v-spacer />
      </v-row>
    </v-container>
    <v-card-actions>
      <v-btn color="primary" :disabled="running" @click="run">Bereken</v-btn>
      <v-progress-circular v-if="running" indeterminate label="running" />
    </v-card-actions>
  </v-card>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  //import solve_utils from '../utils';
  import solve_localsearch from '../localsearch';
  export default {
    name: 'SolverConfig',
    methods: {
      run() {
        // TODO: this should be asynchronous
        this.running = true;
        const solution = solve_localsearch(this.matrix, this.division);
        // const solution = solve_utils.dummy_solver(this.division);
        this.running = false;
        this.$store.commit('setSolution', solution.bestDivision);
        this.$store.dispatch('solve');
        this.$emit('next');
      },
      setSlots(val) {
        this.$store.commit('setSlots', val);
      },
      setMax(val) {
        this.$store.commit('setMaxGroups', val);
      },
      setFocus(val) {
        this.$store.commit('setMaxFocus', val);
      }
    },
    data: () => ({
      running: false
    }),
    computed: {
      ...mapState(['timeslots', 'maxPerGroup', 'maxFocus', 'matrix']),
      ...mapGetters(['division', 'divisionPairs'])
    }
  }
</script>
