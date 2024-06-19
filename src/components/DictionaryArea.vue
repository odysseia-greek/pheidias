<template>
  <div id="dictionary">
    <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
      <v-main>
      <v-card class="mx-auto" color="primary" dark width="100em">
        <v-card-text>
          Dictionary provides words in Ancient Greek, English and Dutch. See
          <a class="grey--text text--lighten-3" href="https://github.com/odysseia-greek/ionia/tree/master/demokritos/lexiko" target="_blank">the GitHub repository</a>
          for examples.
          <v-btn icon @click="infoDialogVisible = true" class="mx-4">
            <v-icon>mdi-information</v-icon>
          </v-btn>
        </v-card-text>
        <v-dialog v-model="infoDialogVisible" max-width="500">
          <v-card>
            <v-card-title class="headline">Dictionary</v-card-title>
            <v-card-text>
              <p>This section provides information about the different components:</p>
              <ul>
                <li>
                  <strong>Selected Language:</strong> Allows you to choose the language.
                </li>
                <li>
                  <strong>Search Mode:</strong> The mode you want to use for searching:<
                  <ol>
                    <li>
                      <strong>Partial</strong> search examples: "ouse" matches "house," "mouse," and "trousers".
                    </li>
                    <li>
                      <strong>Exact</strong> match example: "house" matches only "house".
                    </li>
                    <li>
                      <strong>Extended</strong> will see if the word is part of an entry example: "house" matches "household" and "build a house".
                    </li>
                    <li>
                      <strong>Fuzzy</strong> matches based on levenshtein distance so words that are close are matches "hiuse" matches house.
                    </li>
                  </ol>
                </li>
                <li>
                  <strong>Search Input:</strong> Enter the word you are looking for. The search will happen as you type. A minimum of 2 characters need to be typed before any results appear. Here are some "Partial" examples: όφο, δοτος, Ἀθῆ. If the searchbox loses focus (this happens when you click outside of it) the text will disappear.
                </li>
                <li>
                  <strong>Results Table:</strong> Displays the search results in the language of your choosing.
                </li>
                <li>
                  <strong>Extended Search:</strong> Queries will also attempt to find the word in all it's declension in text. These declensions are made in the grammar component so the list is always incomplete.
                  To see it in action try the extended mode with an exact search mode:
                  <ol>
                    <li>Λακεδαιμονιος</li>
                    <li>λόγος</li>
                    <li>Ἀθηναῖος</li>
                  </ol>
                  <strong>Warning: using extended searches is not recommended for partial or fuzzy modes since it adds a lot of overhead to each call!</strong>
                </li>
              </ul>

            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" text @click="infoDialogVisible = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <h3 class="mx-4">Language</h3>
        <v-radio-group v-model="selectedLanguage"class="mx-4">
          <v-radio color="secondary" label="Greek (default)" value="greek"></v-radio>
          <v-radio color="secondary" label="English" value="english"></v-radio>
          <v-radio color="secondary" label="Nederlands" value="dutch"></v-radio>
        </v-radio-group>

        <h3 class="mx-4">Search Mode</h3>
        <v-radio-group v-model="mode"class="mx-4">
          <v-radio color="secondary" label="Partial (default)" value="partial"></v-radio>
          <v-radio color="secondary" label="Exact" value="exact"></v-radio>
          <v-radio color="secondary" label="Extended" value="extended"></v-radio>
          <v-radio color="secondary" label="Fuzzy" value="fuzzy"></v-radio>
        </v-radio-group>

        <v-card-text>
          <v-autocomplete
              :loading="loading"
              :search-input.sync="search"
              :items="searchHistory"
              hide-no-data
              color="white"
              item-text="Description"
              item-value="API"
              label="Enter a word to search"
              placeholder="Start typing..."
              prepend-icon="mdi-magnify"
              auto-select-first
              @keyup.enter="updateSearchHistory($event.target.value)"
              @input="scrollToResults"
          ></v-autocomplete>
        </v-card-text>

        <v-divider></v-divider>

        <v-expand-transition>
          <v-card light color="background">
            <v-card-text>
              <h2>Results</h2>
              <br />
              <v-data-table ref="resultsSection"
                            dense
                            :headers="headers"
                            :items="searchResults"
                            :items-per-page="10"
                            item-key="id"
                            class="elevation-1"
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>Dictionary Results</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-switch
                        v-model="extendedMode"
                        label="Extended Search"
                        class="mt-2"
                    ></v-switch>
                  </v-toolbar>
                </template>
              </v-data-table>
              <AnalyzeResults v-if="extendedMode" :analyzeResults="analyzeResults" />
            </v-card-text>
          </v-card>
        </v-expand-transition>
      </v-card>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import {ref, computed, watch} from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { DictionaryEntry } from '@/constants/graphql';
import AnalyzeResults from '@/components/AnalyzeResults.vue'; // Import the AnalyzeResults component

export default {
  name: 'DictionaryArea',
  components: {
    AnalyzeResults,
  },
  setup() {
    const theme = ref('light');
    const selectedLanguage = ref('greek');
    const mode = ref('partial');
    const extendedMode = ref(false);
    const search = ref('');
    const searchHistory = ref([]);
    const loading = ref(false);
    const searchResults = ref([]);
    const analyzeResults = ref([]);
    const infoDialogVisible = ref(false);

    const headers = ref([
      { text: 'Greek', value: 'greek' },
      { text: 'English', value: 'english' },
      { text: 'Dutch', value: 'dutch' },
      // Add more headers as needed
    ]);


    watch(selectedLanguage, (newLanguage) => {
      if (newLanguage === 'greek') {
        headers.value = [
          { text: 'Greek', value: 'greek' },
          { text: 'English', value: 'english' },
          { text: 'Dutch', value: 'dutch' },
        ];
      } else if (newLanguage === 'english') {
        headers.value = [
          { text: 'English', value: 'english' },
          { text: 'Greek', value: 'greek' },
        ];
      } else if (newLanguage === 'dutch') {
        headers.value = [
          { text: 'Nederlands', value: 'dutch' },
          { text: 'Grieks', value: 'greek' },
        ];
      }
    });

    const fetchDictionaryEntry = (value) => {
      loading.value = true;

      const { result, error, onResult } = useQuery(DictionaryEntry, {
        word: value,
        language: selectedLanguage.value.toLowerCase(),
        mode: mode.value,
        searchInText: extendedMode.value,
      }, { fetchPolicy: 'no-cache' });

      watch(result, (newResult) => {
        if (newResult) {
          const hits = newResult.dictionary.hits;
          searchResults.value = hits.map((item, index) => ({
            id: item.hit.greek + index,
            greek: item.hit.greek,
            english: item.hit.english,
            dutch: item.hit.dutch,
            // Add more properties as needed
          }));
          if (extendedMode.value) {
            analyzeResults.value = hits.map((hit) => ({
              rootword: hit.hit.greek,
              conjugations: hit.foundInText.conjugations,
              results: hit.foundInText.results.map((result) => ({
                author: result.author,
                book: result.book,
                text: result.text,
                reference: result.reference,
                referenceLink: result.referenceLink,
              })),
            }));
          }
          setTimeout(() => {
            loading.value = false;
          }, 1500);
        }
      });

      watch(error, (newError) => {
        if (newError) {
          console.error(newError);
          setTimeout(() => {
            loading.value = false;
          }, 1500);
        }
      });
    };

    const updateSearchHistory = (value) => {
      if (!searchHistory.value.includes(value)) {
        searchHistory.value.push(value);
      }
      fetchDictionaryEntry(value);
    };

    const scrollToResults = () => {
      const resultsSection = this.$refs.resultsSection;
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return {
      theme,
      selectedLanguage,
      mode,
      extendedMode,
      search,
      searchHistory,
      loading,
      searchResults,
      analyzeResults,
      infoDialogVisible,
      headers,
      updateSearchHistory,
      scrollToResults,
    };
  },
};
</script>


<style scoped>
h4 {
  margin-top: 2em;
}

h3 {
  margin-top: 0.5em;
}

a {
  cursor: pointer;
}

* {
  box-sizing: border-box;
}

/* Style the search field */
form.livesearch input[type="text"] {
  padding: 10px;
  font-size: 17px;
  border: 1px solid grey;
  text-align: center;
  width: 40%;
  background: #f1f1f1;
}
.italic-text {
  font-style: italic;
}
</style>
