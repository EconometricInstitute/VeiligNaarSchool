<template>
  <v-card>
    <SolverConfigPanel :autoSolve="true" />
    <v-alert v-if="solverState.state == 'error'" type="error">
      Er is een probleem met de invoer. <br /> {{solverState.progressMsg}}
    </v-alert>
    <v-alert v-if="solverState.state == 'running'" type="info">
      <template v-slot:prepend>
        <v-progress-circular :value="solverState.progress" :indeterminate="solverState.indeterminate" class="progress" />
      </template>
      Er wordt op dit moment nog gezocht naar een betere verdeling. De onderstaande verdeling kan nog veranderen.<br />
      <span v-if="solutionQuality">
        De resterende overlap van de huidige verdeling is {{solutionQuality.cost}} van in totaal {{solutionQuality.total}} overlap.
      </span>
      <template v-if="solverState.progressMsg">
        <br />Voortgang van het zoekproces: {{solverState.progressMsg}}
      </template>
      <v-divider class="divide" />
      <v-btn color="error" @click="stop">Onderbreek</v-btn>
    </v-alert>
    <v-alert v-if="solverState.state == 'done' || solverState.state=='optimal'" type="success">
      <template v-slot:prepend>
        <v-icon class="progress">{{optimal ? 'mdi-trophy' : 'mdi-check'}}</v-icon>
      </template>
      Het zoeken is klaar. <br />
      <template v-if="solutionQuality">
        <span v-if="perfect">
          De gevonden verdeling heeft geen overlap. Dit is een <strong>perfecte verdeling</strong>.
        </span>
        <span v-else>
          De resterende overlap van de gevonden verdeling is {{solutionQuality.cost}} van in totaal {{solutionQuality.total}} overlap.
        </span>
        <br />
        <strong v-if="optimal && !perfect">Dit is de best mogelijke verdeling.</strong>
      </template>
    </v-alert>
    <v-divider />
    <v-tabs v-model="tab">
      <v-tabs-slider />
      <v-tab>Verdeling</v-tab>
      <v-tab>Tabel</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <SolutionList />
      </v-tab-item>
      <v-tab-item>
        <SolutionTable />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
  import { mapState } from 'vuex';

  import SolverConfigPanel from './SolverConfigPanel';
  import SolutionTable from './SolutionTable';
  import SolutionList from './SolutionList';

  export default {
    name: 'SolutionView',
    components: {
      SolverConfigPanel,
      SolutionTable,
      SolutionList
    },
    methods: {
      solve() {
        this.$store.dispatch('solve');
      },
      stop() {
        this.$store.dispatch('stop');
      }
    },
    data: () => ({
      tab: 0
    }),
    computed: {
      ...mapState(['solverState','solutionQuality']),
      perfect() {
        return this.solutionQuality && this.solutionQuality.honored == this.solutionQuality.total;
      },
      optimal() {
        return this.solverState.state == 'optimal'
            || (this.solverState.state == 'done' && this.perfect);
      }

    },
  }
</script>

<style scoped>
.progress {
  margin-right: 2em;
}
.divide {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>
