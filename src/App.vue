<template>
  <v-app>
    <v-app-bar
      app
      color="#ffd500"
    >
      <div class="d-flex align-center">
        <v-img
          alt="Erasmus School of Economics"
          class="shrink mr-2"
          contain
          src="./assets/ese-logo-text.png"
          transition="scale-transition"
          width="60"
          @click="clickAdvanced"
        />
        Verspreid naar School
      </div>

      <v-spacer></v-spacer>
      <v-btn class="space" color="primary" @click="importData">Importeer</v-btn>
      <v-btn class="space" color="primary" @click="welcome">Help</v-btn>
    </v-app-bar>

    <v-main>
      <Main ref="main"/>
      <WelcomeDialog ref="welcome"/>
              <input type="file" style="display: none" ref="importFile"
                accept=".xlsx" @change="processFile" />
      <v-snackbar :app="true" :top="true" v-model="snackbar">De geadvanceerde modus is nu {{advanced ? 'geactiveerd' : 'gedeactiveerd'}}</v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';

import Main from './components/Main';
import WelcomeDialog from './components/WelcomeDialog';
import XLSX from 'xlsx';
import xlsx_io from './xlsx_io';

const CLICK_TIMES = 5;

export default {
  name: 'App',

  components: {
    Main,
    WelcomeDialog
  },
  methods: {
    welcome() {
      this.$refs.welcome.show();
    },
    importData() {
      this.$refs.importFile.click();
    },
    clickAdvanced() {
      this.advancedCountdown--;
      if (this.advancedCountdown == 0) {
        this.snackbar = true;
        this.$store.commit('setAdvanced', !this.advanced);
        this.advancedCountdown = CLICK_TIMES;
      }
    },
    processFile(ev) {
        if (ev.target.files[0]) {
          const file = ev.target.files[0];
          const reader = new FileReader();
          reader.onload = (ev2) => {
            const data = new Uint8Array(ev2.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            try {
              const process = xlsx_io.readSheet(workbook);
              console.log(process);
              this.$store.commit('setGroups', process.groups);
              this.$store.commit('setMatrix', process.matrix);
              this.$refs.main.jumpToStep(2);
              this.$refs.main.signalImport();
            }
            catch (err) {
              console.log(err);
            }
          };
          reader.readAsArrayBuffer(file);
          this.$refs.importFile.value = null;
      }
    }
  },
  data: () => ({
    advancedCountdown: CLICK_TIMES,
    snackbar: false
  }),
  computed: {
    ...mapState(['advanced'])
  }
};
</script>
<style scoped>
.space {
  margin-left: 0.75em;
}
</style>