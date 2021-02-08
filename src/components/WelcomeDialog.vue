<template>
  <v-dialog v-model="visible" max-width="60em">
    <v-card>
    <v-card-title>Verspreid naar school</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            Deze tool kan een verdeling maken van klassen over tijdsloten, zodat we verspreid naar school kunnen. 
            Dit wordt zo goed mogelijk gedaan, zodat zoveel mogelijk ouders hun kinderen op hetzelfde tijdstip
            naar school kunnen brengen.
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            Alle berekeningen worden in uw web-browser uitgevoerd. Er wordt geen gevoelige informatie over het internet gestuurd.
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            Deze tool is een initiatief van Paul Bouman, Twan Dollevoet, Wilco van den Heuvel en Remy Spliet, onderzoekers aan
            Erasmus Universiteit Rotterdam.
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn href="https://www.eur.nl" target="_blank"><v-icon>mdi-book</v-icon> Handleiding</v-btn>
            <v-btn class="mg-left" href="https://www.youtube.com" target="_blank"><v-icon>mdi-youtube</v-icon>Uitleg Videos</v-btn>
            <v-btn class="mg-left" href="https://www.ese.eur.nl" target="_blank"><v-icon>mdi-school</v-icon>Over ESE</v-btn>
            <v-btn class="mg-left" href="https://github.com/EconometricInstitute/VerspreidNaarSchool" target="_blank"><v-icon>mdi-github</v-icon>Broncode</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-divider />
    <v-card-actions >
      <v-spacer />
      <v-btn color="primary" @click="close">Begin</v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>

<script>
  const show_default = window.localStorage['hideWelcome'] ? false : true;

  export default {
    name: 'WelcomeDialog',
    methods: {
      show() {
        this.visible = true;
      },
      close() {
        this.visible = false;
        window.localStorage['hideWelcome'] = true;
      }
    },
    data: () => ({
      visible: show_default
    })
  }
</script>
<style scoped>
.mg-left {
  margin-left: 0.8em;
}
</style>