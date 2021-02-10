<template>
  <div>
    <v-pagination v-model="page" :length="pages" />
    <v-card v-for="{item, index} of currentGroups" :key="index">
      <div class="d-flex flex-row flex-wrap" style="overflow-x: auto; overflow-y: hidden">
                <div style="width: 6em">
                  {{item.short}}
                </div>
              <template v-for="(colGrp, col) of groupView">
                <div class="cellWrap" :key="index+'-'+col" :class="{upper: col > index, lower: col < index}">
                <v-text-field style="height: 3em;" v-if="item.originalIndex != colGrp.originalIndex" outlined
                        dense
                        type="number" min="0"
                        :label="colGrp.short"           
                        :value="matrix[index][col]" @input="val => setOverlap(index, col, val)"
                        />
                </div>                    
              </template>
            </div>
    </v-card>

  </div>
  <!--
  <v-virtual-scroll :items="groupView" height="320" item-height="64">
    <template v-slot:default="{ item, index }">
      <v-card style="height: 64px" flat>
        <div class="d-flex flex-row flex-wrap" style="overflow-x: auto; overflow-y: hidden">
          <div style="width: 6em">
            {{item.short}}
          </div>
          <template v-for="(colGrp, col) of groupView">
            <div class="cellWrap" :key="index+'-'+col" :class="{upper: col > index, lower: col < index}">
            <v-text-field style="height: 3em;" v-if="item.originalIndex != colGrp.originalIndex" outlined
                    dense
                    type="number" min="0"
                    :label="colGrp.short"
                    
                    :value="matrix[index][col]" @input="val => setOverlap(index, col, val)"
                    />
            </div>                    
          </template>
        </div>
      </v-card>
    </template>
  </v-virtual-scroll>
  -->
  <!--
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
  -->
</template>

<script>
  import { PREFIX } from '../parameters'
  import { mapState, mapGetters } from 'vuex';

  export default {
    name: 'OverlapVirtual',
    methods: {
      setOverlap(row, col, value) {
        this.$store.commit('setOverlap', {row, col, value});
      },
    },
    data: () => ({
      PREFIX: PREFIX.trim(),
      page: 1,
    }),
    computed: {
      ...mapState(['matrix']), ...mapGetters(['groupView']),
      currentGroups() {
        const result = [];
        const p = this.page-1;
        const ipp = this.itemsPerPage;
        const n = this.groupView.length;
        for (let i=p*ipp; i < Math.min(n, (p+1)*ipp); i++) {
          result.push({index: i, item: this.groupView[i]});
        }
        return result;
      },
      itemsPerPage() {
        return Math.max(1, Math.round(5*8/this.groupView.length));
      },
      pages() {
        return Math.ceil(this.groupView.length/this.itemsPerPage);
      }
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
.cellWrap {
  padding-top: 0.5em;
  width: 5em;
}

</style>
