<template>
  <v-card>
      <v-card outlined elevation="2" class="slot" v-for="(ts,idx) of solutionLists" :key="idx">
        <v-card-title>
          <v-icon class="icon">mdi-clock</v-icon> Tijdslot {{idx+1}}
        </v-card-title>
        <v-card-text>
        <v-chip draggable class="group" v-for="(grp,idx2) of ts"
           :key="idx+'-'+idx2">{{grp.full}}</v-chip>
        </v-card-text>
      </v-card>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'SolutionList',
    computed: {
      ...mapGetters(['solutionLists']),
    }
  }
</script>

<style scoped>
.slot {
  margin-top: 1em;
  margin-bottom: 1em;
}
.icon {
  margin-right: 0.5em;
}
.group {
  margin-right: 1em;
}
</style>
