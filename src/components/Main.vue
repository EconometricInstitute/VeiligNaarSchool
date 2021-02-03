<template>
  <v-container fluid>
    <v-stepper v-model="step" vertical>
      <v-stepper-step :complete="step > 1" step="1">Aantal Klassen</v-stepper-step>
      <v-stepper-content step="1">
        <ClassConfig @next="step++" />
      </v-stepper-content>
      <v-stepper-step :complete="step > 2" step="2">Gemeenschappelijke Ouders</v-stepper-step>
      <v-stepper-content step="2">
        <v-card>Step 2</v-card>
      </v-stepper-content>
      <v-stepper-step :complete="step > 3" step="3">Berekenen Oplossing</v-stepper-step>
      <v-stepper-content step="3">
        <v-card>Step 3</v-card>
      </v-stepper-content>
      <v-stepper-step step="4">Bekijken Oplossing</v-stepper-step>
      <v-stepper-content step="4">
        <v-card>Step 4</v-card>
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script>
  import ClassConfig from './ClassConfig';

  export default {
    name: 'Main',
    components: {
      ClassConfig
    },
    data: () => ({
      step: 1
    }),
  }
</script>
