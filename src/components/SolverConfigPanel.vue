<template>
  <v-card class="space-under" outlined elevation="2">
    <v-card-text>
      <v-container>
        <v-row>
          <v-col><h3>Instelling</h3></v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field label="Aantal Tijdsloten" :value="timeslots" @input="setSlots" type="number" :min="maxSplit" />
          </v-col>
          <v-col cols="6">
            <v-text-field label="Maximum aantal groepen per tijdslot" :value="maxPerGroup" @input="setMax" type="number" min="1" />
          </v-col>
        </v-row>
        <v-row>
          <v-col><h4>Namen van Tijdsloten</h4></v-col>
        </v-row>
        <v-row>
          <v-col v-for="ts in timeslots" :key="ts">
            <v-text-field :value="timeslotNames[ts-1]" @input="val => setName(ts-1, val)" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <template v-if="!autoSolve">
      <v-divider />
      <v-card-actions >
        <v-btn color="primary" :disabled="solverState.state == 'running' || solverState.state == 'error'" @click="solve">Bereken</v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name: 'SolverConfigPanel',
    props: ['autoSolve'],
    methods: {
      setSlots(val) {
        this.$store.commit('setSlots', val);
        this.$emit('change')
        if (this.autoSolve) {
          this.solve();
        }
      },
      setMax(val) {
        this.$store.commit('setMaxGroups', val);
        this.$emit('çhange');
        if (this.autoSolve) {
          this.solve();
        }
      },
      solve() {
        this.$store.dispatch('solve');
      },
      setName(index, name) {
        this.$store.commit('updateSlotName', {index, name});
      }
    },
    computed: {
      ...mapState(['timeslots', 'maxPerGroup', 'solverState', 'maxSplit', 'timeslotNames']),
    }
  }
</script>
<style scoped>
.space-under {
  margin-bottom: 0.75em;
}
.mw-10 {
  min-width: 10em;
}
</style>
