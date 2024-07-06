<template>
  <div id="dictionary">
    <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
      <v-main>
      <v-card color="primary">
        <v-card-text>
          Dictionary provides words in Ancient Greek, English and Dutch. See
          <a class="grey--text text--lighten-3" href="https://github.com/odysseia-greek/olympia/tree/master/demokritos/lexiko" target="_blank">the GitHub repository</a>
          for examples.
          <v-btn @click="infoDialogVisible = true" variant="text" icon="mdi-information">
          </v-btn>
        </v-card-text>
        <v-dialog v-model="infoDialogVisible" max-width="80%">
          <v-card class="ma-5">
            <v-card-title class="headline">Dictionary</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-title class="subtitle-1">
                    This section provides information about the different components:
                  </v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>

                <v-list-item>
                  <v-list-item-title>
                    <strong>Selected Language:</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Allows you to choose the language.
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>

                <v-list-item>
                  <v-list-item-title>
                    <strong>Search Mode:</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    The mode you want to use for searching:
                    <v-list>
                      <v-list-item>
                        <strong>Partial:</strong> "ouse" matches "house," "mouse," and "trousers".
                      </v-list-item>
                      <v-list-item>
                        <strong>Exact:</strong> "house" matches only "house".
                      </v-list-item>
                      <v-list-item>
                        <strong>Extended:</strong> "house" matches "household" and "build a house".
                      </v-list-item>
                      <v-list-item>
                        <strong>Fuzzy:</strong> "hiuse" matches "house" based on Levenshtein distance.
                      </v-list-item>
                    </v-list>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>

                <v-list-item>
                  <v-list-item-title>
                    <strong>Search Input:</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Enter the word you are looking for. The search happens as you type.
                    <v-list-item>
                      <strong>Examples:</strong> όφο, δοτος, Ἀθῆ.
                    </v-list-item>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>

                <v-list-item>
                  <v-list-item-title>
                    <strong>Results Table:</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Displays the search results in the chosen language.
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-title>
                    <strong>Extended Search:</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Queries attempt to find the word in all its declensions in text.
                    <v-list-item>
                      <strong>Examples:</strong> Λακεδαιμονιος, λόγος, Ἀθηναῖος.
                    </v-list-item>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                <v-list-item-title>
                  <strong>Warning:</strong>
                </v-list-item-title>
                <v-list-item-subtitle>
                  Extended searches work only with language set to Greek language and Exact search mode!
                </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="infoDialogVisible = false">Close</v-btn>
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
        <v-radio-group v-model="dictionaryMode" class="mx-4">
          <v-radio color="secondary" label="Partial (default)" value="partial"></v-radio>
          <v-radio color="secondary" label="Exact" value="exact"></v-radio>
          <v-radio color="secondary" label="Extended" value="extended"></v-radio>
          <v-radio color="secondary" label="Fuzzy" value="fuzzy"></v-radio>
        </v-radio-group>

        <v-card-text>
          <v-autocomplete
              :loading="loading"
              v-model="search"
              @update:search="updateSearchHistory"
              :items="searchHistory"
              hide-no-data
              color="white"
              item-text="Description"
              item-value="API"
              label="Enter a word to search"
              placeholder="Start typing..."
              prepend-icon="mdi-magnify"
              @keyup.enter="updateSearchHistory($event.target.value)"
              clearable
          ></v-autocomplete>
        </v-card-text>

        <v-divider></v-divider>

        <v-expand-transition>
          <v-card light color="background">
            <v-card-text>
              <h2 ref="resultsContainerRef">Results</h2>
              <br />
              <v-data-table
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
                        v-if="selectedLanguage === 'greek' && dictionaryMode === 'exact'"
                        v-model="extendedMode"
                        label="Extended Search"
                        color="primary"
                    ></v-switch>
                  </v-toolbar>
                </template>
              </v-data-table>
              <AnalyzeResults v-if="extendedMode && selectedLanguage.toLowerCase() === 'greek'" :analyzeResults="analyzeResults" />
            </v-card-text>
          </v-card>
        </v-expand-transition>
      </v-card>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import {ref, computed, watch, onMounted, getCurrentInstance, nextTick} from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { DictionaryEntry } from '@/constants/graphql';
import AnalyzeResults from '@/components/AnalyzeResults.vue'; // Import the AnalyzeResults component

export default {
  name: 'DictionaryArea',
  components: {
    AnalyzeResults,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const theme = ref('light');
    const selectedLanguage = ref('greek');
    const dictionaryMode = ref('partial');
    const extendedMode = ref(false);
    const search = ref('');
    const searchHistory = ref([
      'Λακεδαιμονιος',
      'λόγος',
      'Ἀθηναῖος',
      'ἀγάπη',
      'εἰρήνη',
      'σοφία',
      'γίγνομαι',
      'λέγω',
      'γράφω',
      'ποιέω',
    ]);
    const loading = ref(false);
    const searchResults = ref([]);
    const analyzeResults = ref([]);
    const infoDialogVisible = ref(false);
    const resultsContainerRef = ref();
    const headers = ref([
      { title: 'Greek', value: 'greek' },
      { title: 'English', value: 'english' },
      { title: 'Dutch', value: 'dutch' },
      // Add more headers as needed
    ]);

    watch(extendedMode, () => {
      updateSearchHistory(search.value)
    })

    watch(dictionaryMode, () => {
      if (dictionaryMode.value.toLowerCase() !== 'exact') {
        extendedMode.value = false;
      }
      updateSearchHistory(search.value)
    })

    watch(selectedLanguage, (newLanguage) => {
      if (selectedLanguage.value.toLowerCase() !== 'greek') {
        extendedMode.value = false;
      }

      if (newLanguage === 'greek') {
        headers.value = [
          { title: 'Greek', value: 'greek' },
          { title: 'English', value: 'english' },
          { title: 'Dutch', value: 'dutch' },
        ];
      } else if (newLanguage === 'english') {
        headers.value = [
          { title: 'English', value: 'english' },
          { title: 'Greek', value: 'greek' },
        ];
      } else if (newLanguage === 'dutch') {
        headers.value = [
          { title: 'Nederlands', value: 'dutch' },
          { title: 'Grieks', value: 'greek' },
        ];
      }

      updateSearchHistory(search.value)
    });

    const fetchDictionaryEntry = (value) => {
      loading.value = true;

      const { result, error, onResult } = useQuery(DictionaryEntry, {
        word: value,
        language: selectedLanguage.value.toLowerCase(),
        mode: dictionaryMode.value,
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
          if (extendedMode.value && selectedLanguage.value.toLowerCase() === "greek" && dictionaryMode.value.toLowerCase() === "exact") {
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
          console.log(newError);
          setTimeout(() => {
            loading.value = false;
          }, 1500);
        }
      });
    };

    const updateSearchHistory = (value) => {
      if (value === null || value === '') {
        return
      }

      if (!searchHistory.value.includes(value)) {
        searchHistory.value.push(value);
      }

      fetchDictionaryEntry(value);
      updateUrl({
        mode: dictionaryMode.value,
        language: selectedLanguage.value,
        extended: extendedMode.value,
        word: value,
      });

      scrollToResults('results')
    };


    const scrollToResults = (refName) => {
      nextTick(() => {
        if (refName === 'results' && resultsContainerRef.value) {
          resultsContainerRef.value.scrollIntoView({ behavior: 'smooth' });
        }
      });
    };

    const updateUrl = (query) => {
      const currentQuery = proxy.$route.query;
      const newQuery = { ...currentQuery, ...query };
      const queryChanged = Object.keys(newQuery).some(key => currentQuery[key] !== newQuery[key]);

      if (queryChanged) {
        proxy.$router.replace({ name: 'Alexandros', query: newQuery });
      }
    };

    const initializeFromURL = async () => {
      const {language, mode, word, extended } = proxy.$route.query;
      if (language) {
        selectedLanguage.value = language
      }

      if (mode) {
        dictionaryMode.value = mode;
      }

      if (extended ) {
        extendedMode.value = (extended.toLowerCase() === 'true');
      }

      if (word) {
        search.value = word
        updateSearchHistory(word)
      }
    };

    onMounted(() => {
      initializeFromURL();
    });

    return {
      theme,
      selectedLanguage,
      dictionaryMode,
      extendedMode,
      search,
      searchHistory,
      loading,
      searchResults,
      analyzeResults,
      infoDialogVisible,
      headers,
      resultsContainerRef,
      updateSearchHistory,
      scrollToResults,
      initializeFromURL,
      updateUrl,
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
