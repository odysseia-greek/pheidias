<script>


import {useQuery} from "@vue/apollo-composable";
import {ConvertEntry} from "@/constants/graphql";
import {ref} from "vue";

export default {
  name: 'ConvertArea',
  setup() {
    const resultData = ref(null)
    const words = [
      'ferw',
      'fe/rw',
      'Lakedaimonios',
      'lo/gos',
      'A)qh=naios',
      'a)ga/ph',
      'ei)rh/nh',
      'sophi/a',
      'gi/gnomai',
      'le/gw',
      'gra/fw',
      'poie/w'
    ];


    const convertInput = async (rootword) => {
        const { onResult } = useQuery(ConvertEntry, {
            rootword: rootword,
        });

        onResult((response) => {
          if (response.data && response.data.convert) {
            resultData.value = response.data.convert;
          } else {
            resultData.value = null;
          }
        });
  }

  return {
    resultData,
    words,
    convertInput
    }
  }

}
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="paper-card">
          <v-card-title class="ma2 text-h2">Hello and welcome to Edgecase 2024!</v-card-title>
          <v-card-subtitle class="ma2 text-h4">Ἀποσκότησόν μοι — Get out of my light!</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text class="ma2 text-lg-body-1">
            Here the functionality of Diogenes, the edgy backend, will be shown with some examples.
            <br>
            Click a word to start a conversion.
            <br>
            Hope you have fun during the event.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="word in words" :key="word" cols="12" sm="6" md="4">
        <v-btn @click="convertInput(word)" block color="triadic">
          {{ word }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="paper-card" v-if="resultData">
          <v-card-title>Greek Word: {{ resultData.greekWord }} from: {{ resultData.originalWord }} </v-card-title>
          <v-card-subtitle>Strong Password: {{ resultData.strongPassword }}</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <v-list class="section-content">
              <v-list-item v-for="similar in resultData.similarWords" :key="similar.english">
                <v-list-item-title>{{ similar.english }}</v-list-item-title>
                <v-list-item-subtitle>{{ similar.greek }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.paper-card {
  background: #fdf6e3; /* A light, papyrus-like color */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  font-family: 'Roboto', serif;
}

.section-content {
  background: #fefcf5; /* A slightly different shade for sections */
  padding: 10px;
  border-radius: 4px;
}

</style>