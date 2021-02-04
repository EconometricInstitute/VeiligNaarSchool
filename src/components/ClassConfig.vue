<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="2">
          <v-text-field type="number" min="0" :value="groupNames.length"
            @input="setGroups" label="Aantal klassen" />
        </v-col>
        <v-col cols="2">
          <v-btn color="primary" @click="addGroup">Voeg klas toe</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" v-for="(g,idx) in groupNames" :key="idx">
          <v-text-field :prefix="prefix" v-model="groupNames[idx]"
            append-outer-icon="mdi-delete" @click:append-outer.stop="remove(idx)"/>
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-btn color="primary" @click="next">Volgende</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { PREFIX } from '../parameters';

  export default {
    name: 'ClassConfig',
    methods: {
      next() {
        this.$store.commit('setGroups', this.groupData);
        this.$emit('next');
      },
      remove(idx) {
        this.groupNames.splice(idx,1);
      },
      setGroups(count) {
        let cur = this.groupNames.length;
        if (cur > count) {
          this.groupNames.splice(count - cur, cur - count);
        }
        while (cur < count) {
          this.addGroup();
          cur++;
        }
      },
      addGroup() {
        this.groupNames.push(''+(this.groupNames.length+1));
      }
    },
    data: () => ({
      prefix: PREFIX,
      groupNames: [...Array(8).keys()].map(i => ''+(i+1))
    }),
    computed: {
      groupData() {
        const names = [...this.groupNames];
        console.log(names);
        const prefix = this.prefix.trim();
        const result = [];
        for (const n of names) {
          const short = n.trim();
          const full = prefix + ' ' + short;
          result.push({short, full});
        }
        return result;
      }
    }
  }
</script>
