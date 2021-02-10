<template>
  <v-container fluid>
    <v-stepper v-model="step" vertical non-linear>
      <v-stepper-step editable :complete="step > 1" step="1">Invoeren Klassen</v-stepper-step>
      <v-stepper-content step="1">
        <ClassConfig v-if="step==1" @next="step++" ref="classConfig"/>
      </v-stepper-content>
      <v-stepper-step :complete="step > 2" :editable="step > 2" step="2">Invoeren Overlap</v-stepper-step>
      <v-stepper-content step="2">
        <Overlap v-if="step==2" @next="step++" />
      </v-stepper-content>
      <!--
      <v-stepper-step :complete="step > 3" :editable="step > 3" step="3">Berekenen Verdeling</v-stepper-step>
      <v-stepper-content step="3">
        <SolverConfig @next="step++" />
      </v-stepper-content>
      -->
      <v-stepper-step step="3">Maak Verdeling</v-stepper-step>
      <v-stepper-content step="3">
        <SolutionView v-if="step==3"/>
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script>
  import ClassConfig from './ClassConfig';
  import Overlap from './Overlap';
  //import SolverConfig from './SolverConfig';
  import SolutionView from './SolutionView';

  export default {
    name: 'Main',
    components: {
      ClassConfig,
      Overlap,
      //SolverConfig,
      SolutionView
    },
    methods: {
      jumpToStep(v) {
        this.step = v;
      },
      signalImport() {
        this.$refs.classConfig.signalImport();
      }
    },
    data: () => ({
      step: 1
    }),
  }
</script>
