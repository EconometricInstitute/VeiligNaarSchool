<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="2">
          <v-text-field type="number" min="0" :max="max_size" :value="groups.length"
            @input="setGroups" label="Aantal klassen" />
        </v-col>
        <v-col cols="2">
          <v-btn color="primary" @click="addGroup">Voeg klas toe</v-btn>
        </v-col>
        <v-col cols="8" v-if="error != null">
          <v-alert type="error">{{error}}</v-alert>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" v-for="(g,idx) in groups" :key="idx">
          <v-text-field :prefix="prefix" :value="g.short" @input="val => update(idx,val)"
            append-outer-icon="mdi-delete" @click:append-outer.stop="remove(idx)"/>
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-btn color="primary" :disabled="error != null" @click="next">Volgende</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { mapState } from 'vuex';
  import { PREFIX } from '../parameters';

  const MAX_SIZE = 60;

  export default {
    name: 'ClassConfig',
    methods: {
      next() {
        this.$emit('next');
      },
      remove(idx) {
        //this.groupNames.splice(idx,1);
        this.$store.commit('deleteGroup', idx);
        this.error = null;
      },
      setGroups(count) {
        count = parseInt(count);
        if (!Number.isInteger(count) || count < 1 || count > MAX_SIZE) {
          this.error = 'Vul een geheel getal in tussen 1 en '+MAX_SIZE;
          return;
        }
        let cur = this.groups.length;
        while (cur > count) {
          this.remove(cur-1);
          cur--;
        }
        while (cur < count) {
          this.addGroup();
          cur++;
        }
        this.error = null;
      },
      addGroup() {
        //this.groupNames.push(''+(this.groupNames.length+1));
        const name = this.groups.length+1;
        this.$store.commit('addGroup', {short: ''+name, full: PREFIX+name});
        this.error = null;
      },
      update(idx, val) {
        this.$store.commit('updateGroup', {index: idx, group: {short: val, full: PREFIX+val}});
      }
    },
    data: () => ({
      prefix: PREFIX,
      max_size: MAX_SIZE,
      error: null,
    }),
    computed: {
      ...mapState(['groups'])
    }
  }
</script>
