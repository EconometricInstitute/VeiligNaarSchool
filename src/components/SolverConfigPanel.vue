<template>
  <v-card class="space-under" outlined elevation="2">
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <h3>Instelling</h3>
            <v-alert type="info" v-if="parseInt(maxSplit) > 1">
              Het is niet mogelijk het aantal tijdslots aan te passen bij het splitsen van klassen.
            </v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field :disabled="parseInt(maxSplit) > 1" label="Aantal Tijdsloten" :value="timeslots" @input="setSlots" type="number" :min="maxSplit" />
          </v-col>
          <v-col cols="6">
            <v-text-field :disabled="parseInt(maxSplit) > 1" label="Maximum aantal groepen per tijdslot" :value="maxPerGroup" @input="setMax" type="number" min="1" />
          </v-col>
        </v-row>
        <v-row>
          <v-col><h4>Namen van Tijdsloten</h4></v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="d-flex flex-row flex-wrap" style="padding: 5px;">
            <v-text-field v-for="ts in timeslots" :key="ts" class="flex-grow-0" style="margin: 5px;"  :value="timeslotNames[ts-1]" @input="val => setName(ts-1, val)" />
            </div>
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
