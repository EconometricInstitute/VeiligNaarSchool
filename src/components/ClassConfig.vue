<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col>
          <v-text-field type="number" min="1" :max="max_size" :value="groups.length"
            @input="setGroups" label="Aantal klassen" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-toolbar dense flat>
            <v-toolbar-items>
              <v-btn small color="primary" @click="addGroup">Voeg klas toe</v-btn>
              <v-card flat>
                <v-card-text>
                  <v-checkbox :label="'Splits klassen'+(splitAll ? ' in:' : '')" v-model="splitAll" @change="val => setSplitAll(val)"/>
                </v-card-text>
              </v-card>
            </v-toolbar-items>
            <template v-if="splitAll">
              <v-toolbar-items style="margin-left: 1em; margin-right: 1em;">
                <v-btn v-for="spl in splitBox" :key="spl.value" small @click="()=>massSplit(spl.value)">{{spl.value == '1' ? spl.text : spl.value}}</v-btn>
              </v-toolbar-items>
            </template>
            <v-spacer />
          </v-toolbar>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="error != null">
          <v-alert type="error">{{error}}</v-alert>
        </v-col>
      </v-row>
      <v-row class="scroll-row">
        <v-col>
          <v-list >
            <template v-for="(g,idx) in groups">
              <v-list-item :key="idx">
                <v-list-item-content>
                  <v-text-field class="mw-16" label="Naam" :prefix="prefix" :value="g.short" @input="val => updateNaam(idx,val)" />
                </v-list-item-content>
                <template v-if="splitAll">
                  &nbsp;
                  <v-list-item-content class="maxw-8" >
                    <!--
                    <v-text-field label="Splitsen in" type="number" min="1" :value="g.split" @input="val => updateSplit(idx,val)"/>
                    -->
                    <v-select label="Splits in" class="mw-6" :items="splitBox" :value="g.split" @change="val => updateSplit(idx, val)" />
                  </v-list-item-content>
                </template>
                <v-list-item-action>
                  <v-icon @click.stop="remove(idx)">mdi-delete</v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
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
  const MAX_SPLIT = 4;

  export default {
    name: 'ClassConfig',
    data: () => ({
      prefix: PREFIX,
      max_size: MAX_SIZE,
      error: null,      
      splitAll: false,
      lastSplit: 2
    }),
    methods: {
      next() {
        if (!this.splitAll) {
          this.massSplit(1, false);
        }
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
        this.$store.commit('addGroup', {short: ''+name, full: PREFIX+name, split: this.splitAll ? this.lastSplit : 1});
        this.error = null;
      },
      signalImport() {
        this.$nextTick(() => {
          this.splitAll = this.maxSplit > 1;
        });
      },
      setSplitAll(val) {
        this.splitAll = val;
        if (val) {
          this.massSplit(this.lastSplit, false);
        }
        else {
          this.massSplit(1, false);
        }
      },
      massSplit(val, update) {
        const count = parseInt(val);
        if (Number.isInteger(count) && count > 0) {
          if (update) {
            this.lastSplit = count;
          }
          for (const idx of this.groups.keys()) {
            this.updateSplit(idx, count);
          }
        }
      },
      updateNaam(idx, val) {
        this.$store.commit('updateGroupName', {index: idx, name: val});
      },
      updateSplit(idx, val) {
        const split = parseInt(val);
        if (Number.isInteger(split) && split > 0) {
          this.$store.commit('updateGroupSplit', {index: idx, split});
        }
      }
    },
    computed: {
      ...mapState(['groups', 'maxSplit']),
      splitBox() {
        const result = [{value: 1, text: 'Niet splitsen', disabled: false}];
        for (let i=2; i <= MAX_SPLIT; i++) {
          result.push({value: i, text: ''+i+' delen', disabled: false});
        }
        return result;
      }
    }
  }
</script>
<style scoped>
.mw-6 {
  min-width: 6em;
}
.mw-12 {
  min-width: 12em;
}
.mw-16 {
  min-width: 16em;
}
.maxw-8 {
  max-width: 8em;
}
.splitbox {
  /*margin-top: 12px; */
  margin-right: 1em;
  margin-left: 1em;
}
.scroll-row {
  height: 50vh;
  overflow-y: auto;
}
</style>
