<template>
  <v-card class="space-under" outlined elevation="2">
    <v-card-title>Instellingen</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field label="Aantal Tijdsloten" :value="timeslots" @input="setSlots" type="number" min="1" />
          </v-col>
          <v-col cols="6">
            <v-text-field label="Maximum aantal groepen per tijdslot" :value="maxPerGroup" @input="setMax" type="number" min="1" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <template v-if="!autoSolve && solverState.state == 'empty'">
      <v-divider />
      <v-card-actions >
        <v-btn color="primary" @click="solve">Bereken</v-btn>
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
      }
    },
    computed: {
      ...mapState(['timeslots', 'maxPerGroup', 'solverState']),
    }
  }
</script>
<style scoped>
.space-under {
  margin-bottom: 0.75em;
}
</style>
