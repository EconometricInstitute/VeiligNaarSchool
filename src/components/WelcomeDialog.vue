<template>
  <v-dialog v-model="visible" max-width="60em" overlay-color="#ffd500" overlay-opacity="1">
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
            Alle berekeningen worden in uw eigen web-browser uitgevoerd. Er is geen gevoelige informatie nodig en de tool
            stuurt geen ingevulde gegevens over het internet.
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            Deze tool is een initiatief van
            <a href="https://www.eur.nl/people/paul-bouman" target="_blank">Paul Bouman</a>,
            <a href="https://www.eur.nl/people/twan-dollevoet" target="_blank">Twan Dollevoet</a>,
            <a href="https://www.eur.nl/people/wilco-van-den-heuvel" target="_blank">Wilco van den Heuvel</a> en
            <a href="https://www.eur.nl/people/remy-spliet" target="_blank">Remy Spliet</a>, onderzoekers aan
            de Erasmus School of Economics van Erasmus Universiteit Rotterdam.
          </v-col>
        </v-row>
        <v-row>
          <v-col class="lh-50">
            <v-btn class="link-btn" href="handleiding.pdf" target="_blank"><v-icon>mdi-help-circle</v-icon> Handleiding</v-btn>
            <v-btn class="link-btn" href="https://eur.cloud.panopto.eu/Panopto/Pages/Sessions/List.aspx?folderID=1debd283-7a52-42aa-8e1b-accc00e67abb" target="_blank"><v-icon>mdi-filmstrip</v-icon>Instructievideos</v-btn>
            <v-btn class="link-btn" href="mailto:verspreidnaarschool@ese.eur.nl" target="_blank"><v-icon>mdi-email</v-icon>E-mail ons</v-btn>
            <v-btn class="link-btn" href="https://www.ese.eur.nl" target="_blank"><v-icon>mdi-school</v-icon>Over ESE</v-btn>
            <v-btn class="link-btn" href="https://github.com/EconometricInstitute/VerspreidNaarSchool" target="_blank"><v-icon>mdi-github</v-icon>Broncode</v-btn>
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
.link-btn:not(:last-child) {
  margin-right: 0.8em;
}
.lh-50 {
  line-height: 50px;
}
</style>