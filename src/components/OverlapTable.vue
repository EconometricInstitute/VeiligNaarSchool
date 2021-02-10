<template>
    <v-simple-table dense height="50vh">
      <thead>
        <tr>
          <th>{{PREFIX}}</th>
          <template v-for="g of groupView">
            <th :key="g.short">{{g.short}}</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="(g,row) in groupView">
          <tr :key="'r'+g.short" >
            <th class="mw-10" scope="row">{{g.short}}</th>
            <template v-for="(c,col) in groupView">
              <td v-if="g.originalIndex == c.originalIndex" :key="g.short+'-'+c.short" />
              <td v-else :key="g.short+'-'+c.short" class="inputcell" :class="{upper: col > row, lower: col < row}">
                <v-text-field type="number" v-if="col != row" min="0"
                  :class="{upper: col > row, lower: col < row}"
                  :value="matrix[row][col]" @input="val => setOverlap(row, col, val)" />
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </v-simple-table>
</template>

<script>
  import { PREFIX } from '../parameters'
  import { mapState, mapGetters } from 'vuex';

  export default {
    name: 'OverlapTable',
    methods: {
      setOverlap(row, col, value) {
        this.$store.commit('setOverlap', {row, col, value});
      },
    },
    data: () => ({
      PREFIX: PREFIX.trim()
    }),
    computed: {
      ...mapState(['matrix']), ...mapGetters(['groupView'])
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
