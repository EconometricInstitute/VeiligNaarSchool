<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="3" v-for="(type, idx) of group_types" :key="type">
          <v-text-field :label="type" v-model="group_count[idx]" type="number" min="0" />
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-btn color="primary" @click="next">Volgende</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  const PREFIX = 'Groep' ;
  const NUMBER_OF_YEARS = 8;
  const GROUP_TYPES = [...Array(NUMBER_OF_YEARS).keys()].map(i => PREFIX + (i+1));

  export default {
    name: 'ClassConfig',
    methods: {
      next() {
        this.$emit('next');
      }
    },
    data: () => ({
      group_types: [...GROUP_TYPES],
      group_count: GROUP_TYPES.map(() => 1)
    }),
  }
</script>
