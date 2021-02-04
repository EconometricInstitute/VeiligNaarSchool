<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="3" v-for="(type, idx) of groupTypes" :key="type.short">
          <v-text-field :label="type.full" :value="groupCount[idx]" @change="val => setCount(idx, val)" type="number" min="0" />
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-btn color="primary" @click="next">Volgende</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';

  export default {
    name: 'ClassConfig',
    methods: {
      next() {
        this.$emit('next');
      },
      setCount(idx, val) {
        console.log(idx, val);
        this.$store.commit('setGroupCount', {year: idx, value: val})
      }
    },
    data: () => ({
    }),
    computed: {
      ...mapState(['groupCount']),
      ...mapGetters(['groupTypes'])
    }
  }
</script>
