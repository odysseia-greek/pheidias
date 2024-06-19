<template>
  <div id="grammar">
    <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
      <v-main>
        <v-container>
          <v-card class="mx-auto" color="background" dark>
            <v-app-bar height="150em" prominent color="primary">
              <v-app-bar-title>Grammar</v-app-bar-title>
              <template v-slot:extension>
                <v-text-field
                    label="What Greek word are you trying to decline?"
                    v-model="queryWord"
                    @keydown.enter="grammarWord"
                ></v-text-field>
                <v-btn icon @click="grammarWord">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
                <v-btn icon @click="infoDialogVisible = true" class="mx-4">
                  <v-icon>mdi-information</v-icon>
                </v-btn>
                <v-dialog v-model="infoDialogVisible" max-width="500">
                  <v-card>
                    <v-card-title class="headline">Grammar Conjugation</v-card-title>
                    <v-card-text>
                      <p>This section provides info on what to expect:</p>
                      <ul>
                        <li>
                          <strong>Search Input:</strong> Allows you to choose to search for authors or books to work with.
                          Copy or type a word into the search bar:
                          <ul>
                            <li>ἔβαλλε</li>
                            <li>φέροντος</li>
                            <li>ἀληθῆ</li>
                            <li>λόγων</li>
                            <li>Ἀθηναῖος</li>
                            <li>πόλεως</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Text Analyze</strong> if any conjugations with translations are found an attempt is made to find these words in all their forms in the text. You can scroll through these texts and attempt to translate them by using the provided link.
                        </li>
                      </ul>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="primary" text @click="infoDialogVisible = false">Close</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
            </v-app-bar>
            <v-expand-transition>
              <v-card light color="background">
                <v-card-text>
                  <h2>Results</h2>
                  <br>
                  <v-data-table
                      dense
                      :headers="headers"
                      :items="grammarResults"
                      :items-per-page="10"
                      item-key="name"
                      class="elevation-1"
                  >
                    <template v-slot:item.translation="{ item }">
                      <ol>
                        <li v-for="(trans, index) in item.translation" :key="index">
                          {{ trans }}
                        </li>
                      </ol>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-expand-transition>
          </v-card>
          <AnalyzeResults :analyzeResults="analyzeResults" />
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import {Analyze, CheckGrammar} from '@/constants/graphql';
import AnalyzeResults from "@/components/AnalyzeResults.vue";

export default {
  name: 'GrammarArea',
  components: {
    AnalyzeResults, // Register the new component
  },
  setup() {
    const theme = ref('light');
    const queryWord = ref('');
    const stepper = ref(1);
    const infoDialogVisible = ref(false);
    const grammarResults = ref([]);
    const analyzeResults = ref([]);
    const errors = ref([]);

    const headers = [
      { text: 'Queried', align: 'start', sortable: true, value: 'word' },
      { text: 'Rule', value: 'rule' },
      { text: 'Root', value: 'rootWord' },
      { text: 'Translation', value: 'translation' },
    ];

    const analyzeRootWord = (grammarResults) => {
      analyzeResults.value = [];
      let foundRootWords = new Set();
      let foundTranslations = new Set();
      grammarResults.forEach(result => {
        if (foundRootWords.has(result.rootWord) || foundTranslations.has(result.translation)) {
          return; // Skip if the root word has already been queried
        }
        foundRootWords.add(result.rootWord); // Add the root word to the set
        foundTranslations.add(result.translation);
        const { onResult, onError } = useQuery(Analyze, { rootword: result.rootWord });

        onResult(({ data }) => {
          if (data) {
            analyzeResults.value.push(data.analyze);
          }
        });

        onError((error) => {
          errors.value.push(error);
        });
      });
    };

    const grammarWord = async () => {
      const { onResult, onError } = useQuery(CheckGrammar, {
        word: queryWord.value
      });

      onResult((response) => {
        let formattedGrammar = response.data.grammar.map(item => {
          if (item.translation.length === 0) {
            item.translation = ['No translation found'];
          }
          return item;
        });

        grammarResults.value = formattedGrammar;

        // Analyze the root word from the first grammar result
        if (response.data.grammar && response.data.grammar.length > 0) {
          analyzeRootWord(response.data.grammar);
        }
      });

      onError((error) => {
        grammarResults.value = [{
          word: queryWord.value,
          translation: ['No translation found'],
          rootWord: queryWord.value,
          rule: 'No rule found'
        }];
        errors.value.push(error);
      });
    };

    const highlightWord = (text) => {
      const regex = /&&&(.*?)&&&/g;
      return text.replace(regex, '<span style="background-color: yellow;">$1</span>');
    };

    return {
      theme,
      queryWord,
      stepper,
      grammarResults,
      errors,
      headers,
      analyzeResults,
      infoDialogVisible,
      grammarWord,
      analyzeRootWord,
      highlightWord,

    };
  }
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

</style>
