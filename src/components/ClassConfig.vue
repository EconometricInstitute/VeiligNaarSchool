<template>
  <v-card>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-alert type="info">
            In deze stap geeft u aan hoeveel klassen uw school heeft en hoe de klassen heten.
<!--            Als u klassen wilt splitsen over verschillende dagen, dient u de optie "Splits klassen" aan te zetten.
            Als u gehele klassen wilt verdelen over verschillende starttijden laat u deze optie uit staan.            
          -->
          </v-alert>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex flex-col">
              <v-text-field type="number" min="1" :max="max_size" :value="groups.length"
                @input="setGroups" label="Aantal klassen" style="max-width: 12em;"/>
              <v-toolbar dense flat class="flex-grow-0">
                <v-toolbar-items>
                  <v-btn small color="secondary" @click="quickTool">Snel Aanmaken</v-btn>
                </v-toolbar-items>
              </v-toolbar>

              <v-checkbox :label="splitBox.length > 2 ? ('Splits klassen'+(splitAll ? ' in:' : '')) : 'Splits klassen'" v-model="splitAll" @change="val => setSplitAll(val)"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="error != null">
          <v-alert type="error">{{error}}</v-alert>
        </v-col>
      </v-row>
 <!--     <v-row class="scroll-row"> -->
      <v-row>
        <v-col class="d-flex flex-row flex-wrap">
          <div v-for="(g,idx) in groups" :key="idx" style="padding: 5px;">
            <v-card class="d-flex flex-row" style="padding: 0 5px 0 5px;">
                <v-text-field style="width: 12em" label="Naam" :prefix="prefix" :value="g.short" @input="val => updateNaam(idx,val)">
                  <template v-slot:append-outer>
                    <v-icon @click.stop="remove(idx)">mdi-delete</v-icon>
                  </template>
                </v-text-field>
                <v-select v-if="splitAll" style="width: 5em" :label="splitBox.length != 2 ? 'Splits in' : 'Splitsen?'" :items="splitBox" :value="g.split" @change="val => updateSplit(idx, val)" />
            </v-card>
<!--
          <v-card>
          <v-container>
            <v-row>
              <v-col>
              </v-col>
              <v-col v-if="splitAll">
              </v-col>
            </v-row>
          </v-container>
          </v-card>
-->
          <!--
          <v-list >
            <template v-for="(g,idx) in groups">
              <v-list-item :key="idx">
                <v-list-item-content>
                  <v-text-field class="mw-16" label="Naam" :prefix="prefix" :value="g.short" @input="val => updateNaam(idx,val)" />
                </v-list-item-content>
                <template v-if="splitAll">
                  &nbsp;
                  <v-list-item-content class="maxw-8" >
                    <v-select label="Splits in" class="mw-6" :items="splitBox" :value="g.split" @change="val => updateSplit(idx, val)" />
                  </v-list-item-content>
                </template>
                <v-list-item-action>
                  <v-icon @click.stop="remove(idx)">mdi-delete</v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
          -->
          </div>
        </v-col>
      </v-row>
    </v-container>
    <ClassConfigCreateDialog ref="dialog" :defaultSplit="lastSplit" />
    <v-card-actions>
      <v-btn color="primary" :disabled="error != null" @click="next">Volgende</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { mapState } from 'vuex';
  import { PREFIX } from '../parameters';
  import ClassConfigCreateDialog from './ClassConfigCreateDialog';

  const MAX_SIZE = 60;
  const MAX_SPLIT = 2;

  export default {
    name: 'ClassConfig',
    components: {
      ClassConfigCreateDialog
    },
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
      quickTool() {
        this.$refs.dialog.show();
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
          if (count > 1) {
            this.$store.commit('setSlots', count);
          }
          else {
            this.$store.commit('setSlots', 3);
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
        if (MAX_SPLIT == 2){
          return [{value: 2, text: 'Ja'}, {value: 1, text: 'Nee'}];
        }
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
.mw-8 {
  min-width: 8em;
}
.mw-12 {
  min-width: 12em;
}
.mw-16 {
  min-width: 16em;
}
.mw-10 {
  min-width: 10em;
}
.big {
  min-width: 19em;
}
.small {
  min-width: 12em;
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
