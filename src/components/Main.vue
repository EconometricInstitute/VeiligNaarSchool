<template>
  <v-container fluid>
    <v-stepper v-model="step" vertical non-linear>
      <v-stepper-step editable :complete="step > 1" step="1">Invoeren Klassen</v-stepper-step>
      <v-stepper-content step="1">
        <ClassConfig @next="step++" />
      </v-stepper-content>
      <v-stepper-step :complete="step > 2" :editable="step > 2" step="2">Invoeren Overlap</v-stepper-step>
      <v-stepper-content step="2">
        <Overlap @next="step++" />
      </v-stepper-content>
      <v-stepper-step :complete="step > 3" :editable="step > 3" step="3">Berekenen Verdeling</v-stepper-step>
      <v-stepper-content step="3">
        <SolverConfig @next="step++" />
      </v-stepper-content>
      <v-stepper-step step="4">Bekijk Verdeling</v-stepper-step>
      <v-stepper-content step="4">
        <SolutionTable />
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script>
  import ClassConfig from './ClassConfig';
  import Overlap from './Overlap';
  import SolverConfig from './SolverConfig';
  import SolutionTable from './SolutionTable';

  export default {
    name: 'Main',
    components: {
      ClassConfig,
      Overlap,
      SolverConfig,
      SolutionTable
    },
    data: () => ({
      step: 1
    }),
  }
</script>
