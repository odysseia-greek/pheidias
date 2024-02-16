<template>
  <div id="dictionary">
    <v-app id="dictionaryarea" :style="{ background: $vuetify.theme.themes[theme].background }">
      <br>
      <v-card class="mx-auto" color="primary" dark width="100em">
        <v-card-text>
          Dictionary provides words in Ancient Greek, English and Dutch. See
          <a class="grey--text text--lighten-3" href="https://github.com/odysseia-greek/ionia/tree/master/demokritos/lexiko" target="_blank">the GitHub repository</a>
          for examples.
          <v-btn icon @click="infoDialogVisible = true" class="mx-4">
            <v-icon>mdi-information</v-icon>
          </v-btn>
        </v-card-text>
        <v-snackbar
            v-model="errorSnackbar.show"
            :timeout="1000"
            color="error"
        >
          {{ errorSnackbar.message }}
          <v-btn
              color="white"
              text
              @click="errorSnackbar.show = false"
          >
            Close
          </v-btn>
        </v-snackbar>
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
          ></v-autocomplete>
        </v-card-text>

        <v-divider></v-divider>

        <v-switch
            v-model="extendedMode"
            :label="'Extended Mode: ' + (extendedMode ? 'ON' : 'OFF')"
            color="primary"
        ></v-switch>
        <span>Warning: This will increase search times and is only recommended for exact and extended queries.</span>
          <v-card light color="background">
            <v-card-text>
              <h2>Results</h2>
              <br />

            </v-card-text>
          </v-card>
      </v-card>
      <v-data-table
          :headers="headers"
          :items="searchResults"
          :items-per-page="10"
          item-value="greek"
          select-strategy="single"
          show-select
      ></v-data-table>
    </v-app>
  </div>
</template>


<script>
import {DictionaryEntry} from "@/constants/graphql";

export default {
  name: "DictionaryArea",
  computed: {
    theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    },
  },
  data() {
    return {
      selectedLanguage: 'greek',
      mode: 'partial',
      searchHistory: [],
      extendedMode: false,
      headers: [
        {
          text: 'Greek',
          align: 'start',
          value: 'greek',
        },
        { text: 'English', value: 'english' }
      ],
      searchResults: [],
      errorSnackbar: {
        show: false,
        message: ''
      },
      loading: false,
      search: '',
      infoDialogVisible: false,
    }
  },
  methods: {
    submitSearch(value) {
      this.loading = true;
      this.searchResults = [];
      this.$apollo
          .query({
            query: DictionaryEntry,
            variables: {
              word: value,
              language: this.selectedLanguage.toLowerCase(),
              mode: this.mode,
              searchInText: this.extendedMode
            },
            fetchPolicy: 'no-cache',
          })
          .then((response) => {
            const hits = response.data.dictionary.hits;
            this.searchResults = hits.map((item) => ({
              greek: item.hit.greek,
              english: item.hit.english,
              dutch: item.hit.dutch,
              // Add more properties as needed
            }));
            setTimeout(() => {
              this.loading = false;
            }, 1500);
          })
          .catch(() => {
            this.errorSnackbar.message = 'No results. Please try another word.';
            this.errorSnackbar.show = true;
            setTimeout(() => {
              this.loading = false;
            }, 1500);
          });

    },
    updateSearchHistory(val) {
      if (!this.searchHistory.includes(val)) {
        this.searchHistory.unshift(val);

        if (this.searchHistory.length > 10) {
          this.searchHistory.pop();
        }
      }
    },
    handleRowClick(val) {
      console.log(val)
    },
    handleSelect(item) {
      if (item && item.term) {
        this.search = item.term;
        this.submitSearch(item.term);
      }
    },
    updateTableData() {
      if (this.selectedLanguage === 'dutch') {
        this.headers = [
          // Dutch headers
          { text: 'Grieks', align: 'start', sortable: true, value: 'greek' },
          { text: 'Nederlands', value: 'dutch' },
          // Add more headers if needed
        ];
      } else {
        // Reset to English headers and search results
        this.headers = [
          {
            text: 'Greek',
            align: 'start',
            value: 'greek',
          },
          { text: 'English', value: 'english' }
        ];
      }
    },
  },
  watch: {
    search (val) {
      val && val !== this.select && this.submitSearch(val)
    },
    selectedLanguage() {
      this.updateTableData();
      this.submitSearch(this.searchHistory[0])
    },
    mode() {
      this.submitSearch(this.searchHistory[0])
    }
  },
}
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

</style>
