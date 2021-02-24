<template>
  <v-card>
      <v-card outlined elevation="2" class="slot">
        <v-card-title>
          
        </v-card-title>
        <v-card-text>
          <v-list>
            <template v-for="(grp,idx) of solutionGroupLists">
                <v-subheader v-if="maxSplit > 1" :key="'h'+idx"><v-icon class="icon">mdi-account-multiple</v-icon> {{grp.group.full}}</v-subheader>
                <v-list-item-group :key="'i'+idx">
                  <v-list-item v-for="(sg,idx2) of grp.subgroups" :key="idx+'-'+idx2">
                    <v-list-item-content>
                      <v-list-item-title>{{sg.subgroup.full}} - {{sg.timeslot}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
            </template>
          </v-list>
        </v-card-text>
      </v-card>
  </v-card>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';

  export default {
    name: 'SolutionClassList',
    computed: {
      ...mapState(['maxSplit']),
      ...mapGetters(['solutionGroupLists']),
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
