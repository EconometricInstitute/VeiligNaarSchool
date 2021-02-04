<template>
  <v-dialog v-model="visible" max-width="65em">
    <v-card>
    <v-card-title>Verspreid naar school</v-card-title>
    <v-card-text>
      <p>Tijdens Corona doen we allemaal ons best om onderling contact zoveel mogelijk te vermijden.
        Basisscholen kunnen hieraan bijdragen door klassen op verschillende tijden te laten starten en eindigen.
        Op deze manier wordt drukte in de wijk, op het schoolplein en bij de ingang van de school zoveel mogelijk vermeden.
        Scholen kunnen ook de leerlingen verdelen over verschillende dagen.
        Daarbij krijgt bijvoorbeeld de ene helft van de leerlingen op maandag en donderdag les, en de andere helft op dinsdag en vrijdag.
        Ook hiermee wordt drukte vermeden. Veel ouders hebben meerdere kinderen op dezelfde school.
        Het is daarom belangrijk om het aangepaste schema zo te maken dat zoveel mogelijk ouders in één keer hun kinderen weg kunnen brengen.
        Het is niet wenselijk dat een ouder elk kind apart naar school moet brengen.
        Dat is niet alleen vervelend voor de ouders, maar vermindert ook het effect van het spreiden van de lestijden.
        In veel gevallen is het helaas niet mogelijk om dit volledig te voorkomen, maar op deze website vindt u een computerprogramma om een schema te maken dat dit wel zoveel mogelijk tegengaat.
        Zo kunnen onze kinderen allemaal veilig verspreid naar school.
      </p>
    </v-card-text>
    <v-divider />
    <v-card-actions >
      <v-spacer />
      <v-btn color="primary" @click="close">Begin</v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'WelcomeDialog',
    methods: {
      show() {
        this.visible = true;
      },
      close() {
        this.visible = false;
      }
    },
    data: () => ({
      visible: true
    })
  }
</script>