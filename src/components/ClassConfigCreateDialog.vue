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
            te vullen. U kunt de namen van de groepen nog wijzigen na afloop.
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-checkbox v-model="merge" label="Combineer lege jaargangen" />
            Met deze optie worden jaargangen met nul klassen gecombineerd met de lagere jaren. Als u bijvoorbeeld
            een gecombineerde jaargang 1/2 heeft met drie klassen, vult u 3 in bij groep 1, en 0 bij groep 2.
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
    props: ['defaultSplit'],
    methods: {
      show() {
        this.visible = true;
      },
      close() {
        this.visible = false;
      },
      create() {
        let groups = [];
        if (this.merge) {
          let buffer = [];
          for (let i=0; i < this.years; i++) {
            const y = this.years - i;
            buffer.push(y);
            const count = this.counts[y-1];
            if (count != 0) {
              const name = buffer.reverse().join('/');
              if (count == 1) {
                groups.push({short: name, full: PREFIX+name, split: this.defaultSplit});
              }
              else {
                for (let j=0; j < count; j++) {
                  const short = name + label(count - j - 1);
                  groups.push({short, full: PREFIX+short, split: this.defaultSplit});
                }
              }
              buffer = [];
            }
          }
          groups = groups.reverse();
        }
        else {
          for (let i=0; i < this.years; i++) {
            const count = parseInt(this.counts[i]);
            if (Number.isInteger(count) && count > 0 ) {
              if (count == 1) {
                  const short = ''+(i+1);
                  groups.push({short, full: PREFIX+short, split: this.defaultSplit});
              }
              else {
                for (let j=0; j < count; j++) {
                  const short = ''+(i+1)+label(j);
                  groups.push({short, full: PREFIX+short, split: this.defaultSplit});
                }
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
      merge: true,
      prefix: PREFIX,
      counts: Array(NUMBER_OF_YEARS).fill(1)
    }),
    created() {
      this.counts[1] = 0;
    }
  }
</script>
<style scoped>
.mw-8 {
  min-width: 8em;
}
</style>