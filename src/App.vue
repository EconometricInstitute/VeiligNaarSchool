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
      <v-btn color="primary" @click="welcome">Over deze Applicatie</v-btn>
    </v-app-bar>

    <v-main>
      <Main/>
      <WelcomeDialog ref="welcome"/>
    </v-main>
  </v-app>
</template>

<script>
import Main from './components/Main';
import WelcomeDialog from './components/WelcomeDialog';

export default {
  name: 'App',

  components: {
    Main,
    WelcomeDialog
  },
  methods: {
    welcome() {
      this.$refs.welcome.show();
    }
  },
  data: () => ({
    //
  }),
};
</script>
