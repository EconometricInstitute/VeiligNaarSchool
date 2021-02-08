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
        />
        Verspreid naar School
      </div>

      <v-spacer></v-spacer>
      <v-btn class="space" color="primary" @click="importData">Importeer</v-btn>
      <v-btn class="space" color="primary" @click="welcome">Over deze Applicatie</v-btn>
    </v-app-bar>

    <v-main>
      <Main ref="main"/>
      <WelcomeDialog ref="welcome"/>
              <input type="file" style="display: none" ref="importFile"
                accept=".xlsx" @change="processFile" />
    </v-main>
  </v-app>
</template>

<script>
import Main from './components/Main';
import WelcomeDialog from './components/WelcomeDialog';
import XLSX from 'xlsx';
import xlsx_io from './xlsx_io';

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
    //
  }),
};
</script>
<style scoped>
.space {
  margin-left: 0.75em;
}
</style>