<template>
  <v-card>
    <v-alert type="info">
      In deze stap kunt u de tijdsloten aanpassen en wordt een verdeling berekend.
      U kunt de gevonden verdeling bekijken of exporteren naar een Excel bestand.
    </v-alert>
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
        <v-divider style="margin-top: 0.75em; margin-bottom: 0.75em;" />
        <v-btn color="primary" @click="exportSolution">Exporteer Verdeling</v-btn>
      </template>
    </v-alert>
    <v-divider />
    <v-tabs v-model="tab">
      <v-tabs-slider />
      <v-tab>Tijdsloten</v-tab>
      <v-tab>Klassen</v-tab>
      <v-tab>Tabel</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <SolutionTimeslotList />
      </v-tab-item>
      <v-tab-item>
        <SolutionClassList />
      </v-tab-item>
      <v-tab-item>
        <SolutionTable />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
  import { mapState, mapGetters } from 'vuex';
  import xlsx_io from '../xlsx_io';

  import SolverConfigPanel from './SolverConfigPanel';
  import SolutionTable from './SolutionTable';
  import SolutionClassList from './SolutionClassList';
  import SolutionTimeslotList from './SolutionTimeslotList';

  export default {
    name: 'SolutionView',
    components: {
      SolverConfigPanel,
      SolutionTable,
      SolutionClassList,
      SolutionTimeslotList
    },
    methods: {
      solve() {
        this.$store.dispatch('solve');
      },
      stop() {
        this.$store.dispatch('stop');
      },
      exportSolution() {
        xlsx_io.writeSolution(this.groupView, this.solution, this.timeslotNames, 'verdeling.xlsx');
      }
    },
    data: () => ({
      tab: 0
    }),
    computed: {
      ...mapState(['solverState','solutionQuality', 'solution', 'timeslotNames']),
      ...mapGetters(['groupView']),
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
