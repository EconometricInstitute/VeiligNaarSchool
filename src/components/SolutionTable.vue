<template>
  <v-card>
    <v-simple-table dense v-if="solution != null">
      <thead>
        <tr>
          <th></th>
          <template v-for="(g,idx) of groups">
            <th :key="g.short" :style="{color: colors[idx]}">{{g.short}} (Tijdslot {{solution[idx]}})</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="(g,row) in groups">
          <tr :key="'r'+g.short">
            <th scope="row" :style="{color: colors[row]}">{{g.short}} (Tijdslot {{solution[row]}})</th>
            <td v-for="(c,col) in groups" :key="g.short+'-'+c.short" :class="{solutionCell: true, conflict: conflict[row][col]}">
              <span v-if="matrix[row][col] > 0">{{matrix[row][col]}}</span>
            </td>
          </tr>
        </template>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
  import { mapState } from 'vuex';

  const colorList = ['#4363d8', '#f58231', '#808080',
                     '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
                     '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
                     '#aaffc3', '#808000', '#ffd8b1']

  export default {
    name: 'SolutionTable',
    data: () => ({
      colorList
    }),
    computed: {
      ...mapState(['matrix', 'solution', 'groups']),
      conflict() {
        const result = [];
        if (this.matrix && this.solution) {
          for (let row=0; row < this.matrix.length; row++) {
            result.push(this.matrix[row].map((_,col) => this.matrix[row][col] > 0 && this.solution[row] != this.solution[col]));
          }
        }
        return result;
      },
      colors() {
        const result = [];
        if (this.solution) {
          for (let i=0; i < this.solution.length; i++) {
            const slot = this.solution[i];
            const color = this.colorList[slot % this.colorList.length];
            result.push(color);
          }
        }
        return result;
      }
    }
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
