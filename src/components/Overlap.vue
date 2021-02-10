<template>
  <v-card>
    <v-alert type="info">
      In deze stap geeft u aan hoeveel overlap er is tussen de ouders/verzorgers 
      van kinderen in paren van klassen. 
      De overlap geeft aan hoe vervelend het is als een paar van klassen op verschillende tijden wordt gepland.
      <br />
      Voorbeeld: als zes kinderen in groep 5 een broertje of zusje hebben in groep 3, vul dan 6 in voor het paar
      groep 5 en groep 3.
    </v-alert>
    <OverlapTable />
    <v-card-actions>
      <v-btn color="primary" @click="next">Volgende</v-btn>
      <v-btn color="primary" @click="exportData">Exporteer</v-btn>
      <v-btn @click="randomize" v-if="advanced">Randomize</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { PREFIX } from '../parameters'
  import { mapState, mapGetters } from 'vuex';
  import xlsx_io from '../xlsx_io';
  import OverlapTable from './OverlapTable';

  export default {
    name: 'Overlap',
    components: {
      OverlapTable
    },
    methods: {
      next() {
        this.$store.dispatch('solve');
        this.$emit('next');
      },
      exportData() {
        xlsx_io.writeSheet(this.groupView, this.groups, this.matrix, 'overlap-sheet.xlsx');
      },
      randomize() {
        for(let i=0; i < this.groupView.length; i++) {
          for (let j=i+1; j < this.groupView.length; j++) {
            this.$store.commit('setOverlap', {row: i, col: j, value: Math.random() < 0.25 ? 1 : 0});
          }
        }
      }
    },
    data: () => ({
      PREFIX: PREFIX.trim()
    }),
    computed: {
      ...mapState(['matrix','groups','advanced']), ...mapGetters(['groupView'])
    }
  }
</script>
<style scoped>
.inputcell {
  min-width: 6em;
}
.upper {
  background-color: #deeaf6;
}
.lower {
  background-color: #fff2cc;
}
.sameClassCell {
  background-color: black;
}
.mw-10 {
  min-width: 10em;
}
</style>
