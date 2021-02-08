<template>
  <v-dialog v-model="visible" max-width="50em">
    <v-card>
    <v-card-title>Snel aanmaken</v-card-title>
    <v-card-text>
      <v-alert type="warning">Dit verwijdert alle bestaande data, inclusief het overlaptabel!</v-alert>
      <v-container>
        <v-row>
          <v-col>
            Vul in hoeveel klassen voor elke jaargang moeten worden aangemaakt. Het is ook mogelijk om 0 in
            te vullen. U kunt na deze stap de namen van klassen nog aanpassen.
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="year in years" :key="year">
            <v-text-field class="mw-8" :label="prefix+year" v-model="counts[year-1]" :min="0" :max="26" type="number" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-divider />
    <v-card-actions >
      <v-spacer />
      <v-btn color="primary" @click="create">Aanmaken</v-btn>
      <v-btn color="error" @click="close">Annuleer</v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>

<script>
  import {PREFIX, NUMBER_OF_YEARS} from '../parameters';

  function label(i) {
    return String.fromCharCode(65+i);
  }

  export default {
    name: 'ClassConfigCreateDialog',
    methods: {
      show() {
        this.visible = true;
      },
      close() {
        this.visible = false;
      },
      create() {
        const groups = [];
        for (let i=0; i < this.years; i++) {
          const count = parseInt(this.counts[i]);
          if (Number.isInteger(count) && count > 0 ) {
            if (count == 1) {
                const short = ''+(i+1);
                groups.push({short, full: PREFIX+short, split: 1});
            }
            else {
              for (let j=0; j < count; j++) {
                const short = ''+(i+1)+label(j);
                groups.push({short, full: PREFIX+short, split: 1});
              }
            }
          }
        }
        this.$store.commit('setGroups', groups);
        this.visible = false;
      }
    },
    data: () => ({
      visible: false,
      years: NUMBER_OF_YEARS,
      prefix: PREFIX,
      counts: Array(NUMBER_OF_YEARS).fill(1)
    }),
  }
</script>
<style scoped>
.mw-8 {
  min-width: 8em;
}
</style>