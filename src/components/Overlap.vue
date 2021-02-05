<template>
  <v-card>
    <v-simple-table dense height="50vh">
      <thead>
        <tr>
          <th>{{PREFIX}}</th>
          <template v-for="g of groups">
            <th :key="g.short">{{g.short}}</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="(g,row) in groups">
          <tr :key="'r'+g.short" >
            <th scope="row">{{g.short}}</th>
            <td v-for="(c,col) in groups" :key="g.short+'-'+c.short" class="inputcell" :class="{upper: col > row, lower: col < row}">
              <v-text-field type="number" v-if="col != row" min="0"
                :class="{upper: col > row, lower: col < row}"
                :value="matrix[row][col]" @input="val => setOverlap(row, col, val)" />
            </td>
          </tr>
        </template>
      </tbody>
    </v-simple-table>
    <v-card-actions>
      <v-btn color="primary" @click="next">Volgende</v-btn>
      <v-btn @click="randomize">Randomize</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { PREFIX } from '../parameters'
  import { mapState } from 'vuex';

  export default {
    name: 'Overlap',
    methods: {
      next() {
        this.$store.dispatch('solve');
        this.$emit('next');
      },
      setOverlap(row, col, value) {
        this.$store.commit('setOverlap', {row, col, value});
      },
      randomize() {
        for(let i=0; i < this.groups.length; i++) {
          for (let j=i+1; j < this.groups.length; j++) {
            this.$store.commit('setOverlap', {row: i, col: j, value: Math.random() < 0.25 ? 1 : 0});
          }
        }
      }
    },
    data: () => ({
      PREFIX: PREFIX.trim()
    }),
    computed: {
      ...mapState(['matrix', 'groups']),
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
</style>
