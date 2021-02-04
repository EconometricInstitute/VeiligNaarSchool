<template>
  <v-card>
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
  import SolutionTable from './SolutionTable';
  import SolutionList from './SolutionList';

  export default {
    name: 'SolutionView',
    components: {
      SolutionTable,
      SolutionList
    },
    data: () => ({
      tab: 0
    })
  }
</script>

<style scoped>
.solutionCell {
  text-align: center;
}
.conflict {
  background-color: red;
  font-weight: bold;
}
.resolved {
  color: green;
  font-size: 100%;
}
</style>
