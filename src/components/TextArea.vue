<template>
  <div id="text">
    <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
      <v-main>
        <v-container>
          <v-card class="mx-auto" color="primary" dark>
            <v-container>
              <v-row>
                <v-col>
                  <v-autocomplete
                      v-model="searchQuery"
                      :items="autocompleteAuthorsAndBooks"
                      label="Search Authors and Books"
                      prepend-icon="mdi-magnify"
                      @keyup.enter="handleKeyPress"
                      clearable
                  ></v-autocomplete>
                </v-col>
                <v-col cols="auto">
                  <v-btn icon @click="clearSearchResults">
                    <v-icon>{{ 'mdi-close' }}</v-icon>
                  </v-btn>
                  <v-btn icon @click="toggleExpandAll">
                    <v-icon>{{ expandAll ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
                  </v-btn>
                  <v-btn icon @click="infoDialogVisible = true" class="mx-4">
                    <v-icon>mdi-information</v-icon>
                  </v-btn>
                  <v-dialog v-model="infoDialogVisible" max-width="500">
                    <v-card>
                      <v-card-title class="headline">Text Translation</v-card-title>
                      <v-card-text>
                        <p>This section provides info on what to expect:</p>
                        <ul>
                          <li>
                            <strong>Search Input:</strong> Allows you to choose to search for authors or books to work with.
                          </li>
                          <li>
                            <v-icon>{{ 'mdi-close' }}</v-icon> Remove search history
                          </li>
                          <li>
                            <v-icon>{{ 'mdi-plus' }}</v-icon><v-icon>{{ 'mdi-minus' }}</v-icon> Collapse or expand all options.
                          </li>
                          <li>
                            <strong>Select Author and Book</strong> once selected you will get the "references" these point to passages in the text and you can see an example here:<a href="https://scaife.perseus.org/reader/urn:cts:greekLit:tlg0016.tlg001.perseus-grc2:1.1.0-1.1.4/"> Scaife</a>.
                          </li>
                          <li>
                            <strong>Select Section</strong> and start translating! Once you are done click the <strong>CHECK</strong> button in the bottom to see how you did. Your entry is checked against official translations and a levenshtein score is calculated to see how correct you are. This however does not mean your translation is wrong - it might just be a different word order or you used a different word.
                          </li>
                        </ul>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn color="primary" text @click="infoDialogVisible = false">Close</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
          <v-row v-if="filteredAuthors.length">
            <v-col>
              <v-expansion-panels v-model="expandedPanels" multiple>
                <v-expansion-panel v-for="author in filteredAuthors" :key="author.key" >
                  <v-expansion-panel-header>
                    {{ author.key }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-list>
                      <v-list-item
                          v-for="book in author.filteredBooks.length ? author.filteredBooks : author.books"
                          :key="book.key"
                          :style="selectedAuthor === author.key && selectedBook === book.key ? 'color: white; background-color: #1c61d1' : ''"
                          @click="onBookSelected(author.key, book.key)"
                      >
                        {{ book.key }}
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
          <v-row v-if="selectedBookReferences.length">
            <v-col>
              <v-row>
                <v-col cols="12">
                  <h3>References</h3>
                </v-col>
                <v-btn
                    v-for="reference in selectedBookReferences"
                    :key="reference.key"
                    class="quiz-button"
                    :class="{ 'pulsate': selectedReference === reference.key }"
                    :color="selectedReference === reference.key ? 'primary' : 'triadic'"
                    @click="onReferenceSelected(selectedBook, reference.key)"
                >
                  {{ reference.key }}
                </v-btn>
              </v-row>
              <v-row v-if="selectedReferenceSections.length && selectedReferenceSections[0].key !==''">
                <v-col cols="12">
                  <h3>Sections</h3>
                </v-col>
                <v-btn
                    v-for="section in selectedReferenceSections"
                    :key="section.key"
                    class="quiz-button"
                    :class="{ 'pulsate': selectedSection === section.key }"
                    :color="selectedSection === section.key ? 'primary' : 'triadic'"
                    @click="onSectionSelected(section.key)"
                >
                  {{ section.key }}
                </v-btn>
                <v-btn
                    class="quiz-button"
                    :color="selectedSectionIndex === -1 ? 'primary' : 'triadic'"
                    @click="onSectionSelected('')"
                >
                  All Sections
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-if="resultData">
            <v-col>
              <v-card class="mx-auto paper-card" width="100%">
                <v-row v-for="rhema in resultData.create.rhemai" :key="rhema.section" class="rhema-section" v-bind:align="mobileView ? 'center' : undefined">
                  <v-col :cols="12" :md="6">
                    <p><strong>Section {{ rhema.section }}</strong></p>
                    <p>
              <span v-for="(word, index) in rhema.greek.split(' ')" :key="index">
                <span class="clickable-word" @click="onWordClick(word)">
                  {{ word }}
                </span>
                <span v-if="index < rhema.greek.split(' ').length - 1">&nbsp;</span>
              </span>
                    </p>
                  </v-col>
                  <v-col :cols="12" :md="6">
                    <v-textarea
                        v-model="translations[rhema.section]"
                        label="Translation"
                        outlined
                        auto-grow
                        rows="1"
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="text-right">
                    <v-btn color="primary" @click="checkTranslations">Check</v-btn>
                  </v-col>
                </v-row>
                <v-row v-if="translationResults">
                  <v-col>
                    <v-card class="mx-auto paper-card" width="100%">
                      <v-card-title>Results</v-card-title>
                      <v-card-text>
                        <p><strong>Average Levenshtein Percentage:</strong> {{ translationResults.averageLevenshteinPercentage }}%</p>
                        <p><strong>Provided Answer:</strong> {{ translationResults.sections[0].answerSentence }}</p>
                        <p><strong>Sections:</strong></p>
                            <div v-if="groupedTranslations.length">
                              <v-expansion-panels>
                                <v-expansion-panel v-for="(section, index) in groupedTranslations" :key="index">
                                  <v-expansion-panel-header class="section-content">Section {{ section.section }}</v-expansion-panel-header>
                                  <v-expansion-panel-content class="section-content">
                                    <v-list dense class="section-content">
                                      <v-list-item v-for="(translation, index) in section.translations" :key="index">
                                        <v-list-item-content>
                                          <v-list-item-subtitle>Levenshtein Percentage:</v-list-item-subtitle>
                                          <v-list-item class="list-item">{{ translation.levenshteinPercentage }}%</v-list-item>
                                          <v-list-item-subtitle>Translation from database:</v-list-item-subtitle>
                                          <v-list-item class="list-item">{{ translation.quizSentence }}</v-list-item>
                                        </v-list-item-content>
                                      </v-list-item>
                                    </v-list>
                                  </v-expansion-panel-content>
                                </v-expansion-panel>
                              </v-expansion-panels>
                            </div>
                            <div v-if="translationResults.possibleTypos.length">
                              <p style="margin-top:2em"><strong>Possible Typos:</strong></p>
                              <v-list dense class="section-content">
                                <v-list-item v-for="typo in translationResults.possibleTypos" :key="typo.provided" class="list-item">
                                  <v-list-item-content>
                                    <v-list-item>Provided: {{ typo.provided }}</v-list-item>
                                    <v-list-item>Correction: {{ typo.source }}</v-list-item>
                                  </v-list-item-content>
                                </v-list-item>
                              </v-list>
                            </div>
                          </v-card-text>
                        </v-card>
                      <v-card-actions>
                        <v-btn color="primary" @click="clearTranslations">Clear</v-btn>
                      </v-card-actions>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title class="headline">Word Details</v-card-title>
            <v-card-text>
              <div v-if="grammarError">{{ grammarError.message }}</div>
              <div v-if="grammarResults">
                <v-carousel :continuous="false" :cycle="cycle" :show-arrows="true" hide-delimiter-background height="250">
                  <v-carousel-item v-for="(result, i) in grammarResults" :key="i">
                    <v-sheet height="100%" tile>
                      <v-row class="fill-height" no-gutters>
                        <v-list-item-title class="text-h5 mb-1">{{ result.word }}</v-list-item-title>
                        <v-list-item-subtitle class="mb-1">
                          <strong>Translations:</strong>
                          <ol>
                            <li v-for="(translation, j) in result.translation" :key="j">{{ translation }}</li>
                          </ol>
                        </v-list-item-subtitle>
                        <v-list-item-subtitle><strong>Root:</strong> {{ result.rootWord }}</v-list-item-subtitle>
                        <v-list-item-subtitle><strong>Rule:</strong> {{ result.rule }}</v-list-item-subtitle>
                      </v-row>
                    </v-sheet>
                  </v-carousel-item>
                </v-carousel>
                <v-list two-line>
                  <v-list-item>
                    <v-list-item-action>
                      <v-switch v-model="cycle" label="Cycle Translations" inset></v-switch>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="dialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import { ref, computed, watch, watchEffect, onMounted, getCurrentInstance } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { HerodotosOptions, HerodotosCreate, CheckGrammar, HerodotosCheck } from '@/constants/graphql';

export default {
  setup() {
    const { proxy } = getCurrentInstance();
    const theme = ref('light');
    const expandedPanels = ref([]);
    const expandAll = ref(false);
    const authors = ref([]);
    const searchQuery = ref('');
    const selectedAuthor = ref('');
    const selectedBook = ref('');
    const selectedReference = ref('');
    const selectedSection = ref('');
    const selectedBookReferences = ref([]);
    const selectedReferenceSections = ref([]);
    const selectedSectionIndex = ref(-1);
    const { result, loading, error } = useQuery(HerodotosOptions);
    const mobileView = ref(window.innerWidth <= 600);
    const infoDialogVisible = ref(false);

    const resultData = ref(null);
    const queryLoading = ref(false);
    const queryError = ref(null);

    const dialog = ref(false);
    const clickedWord = ref('');
    const grammarResults = ref([]);
    const grammarError = ref(null);
    const translations = ref({});
    const translationResults = ref(null);
    const translationError = ref(null);
    const cycle = ref(false);
    const autocompleteAuthorsAndBooks = ref([]);

    watchEffect(() => {
      if (result.value) {
        authors.value = result.value.textOptions.authors;
        const authorsAndBooks = authors.value.flatMap((author) => {
          const books = author.books.map((book) => book.key);
          return [author.key, ...books];
        });
        autocompleteAuthorsAndBooks.value = authorsAndBooks;
        if (selectedBook.value) {
          const author = authors.value.find((a) => a.key === selectedAuthor.value);
          const book = author.books.find((b) => b.key === selectedBook.value);
          selectedBookReferences.value = sortedReferences(book.references);
        }

        if (selectedReference.value) {
          const book = selectedBookReferences.value.find((b) => b.key === selectedReference.value);
          selectedReferenceSections.value = sortedSections(book.sections);
        }
      }
    });

    const updateData = async () => {
      if (selectedReference.value || selectedSection.value) {
        queryLoading.value = true;
        queryError.value = null;
        try {
          const { onResult } = useQuery(HerodotosCreate, {
            input: {
              author: selectedAuthor.value,
              book: selectedBook.value,
              reference: selectedReference.value,
              section: selectedSection.value || null,
            },
          });

          onResult((response) => {
            if (response.data && response.data.create) {
              resultData.value = response.data;
              translations.value = {};
              response.data.create.rhemai.forEach((rhema) => {
                translations.value[rhema.section] = '';
              });
            } else {
              resultData.value = null;
            }
            queryLoading.value = false;
          });
        } catch (error) {
          queryError.value = error;
          queryLoading.value = false;
        }
      }
    };

    watch(
        [selectedAuthor, selectedBook, selectedReference, selectedSection],
        () => {
          updateData();
        }
    );

    const toggleExpandAll = () => {
      expandAll.value = !expandAll.value;
      if (expandAll.value) {
        expandedPanels.value = Array.from({ length: filteredAuthors.value.length }, (_, index) => index);
      } else {
        expandedPanels.value = [];
      }
    };

    const clearSearchResults = () => {
      searchQuery.value = '';
    };

    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        searchQuery.value = event.target.value;
      }
    };

    const fetchGrammarDetails = async (word) => {
      grammarError.value = null;
      grammarResults.value = null;
      try {
        const { onResult } = useQuery(CheckGrammar, { word });
        onResult((response) => {
          if (response.data) {
            grammarResults.value = response.data.grammar;
          } else {
            grammarResults.value = [{ word, rootWord: word, translation: ['No translation found'], rule: 'No rule found' }];
          }
        });
      } catch (error) {
        grammarError.value = error;
      }
    };

    const onWordClick = (word) => {
      clickedWord.value = word;
      dialog.value = true;
      fetchGrammarDetails(word);
    };

    const filteredAuthors = computed(() => {
      const query = searchQuery.value.toLowerCase();
      const results = authors.value
          .map((author) => {
            const filteredBooks = author.books.filter((book) =>
                book.key.toLowerCase().includes(query)
            );
            if (author.key.toLowerCase().includes(query) || filteredBooks.length > 0) {
              return {
                ...author,
                filteredBooks,
              };
            }
            return null;
          })
          .filter((author) => author !== null);

      if (query !== '') {
        expandedPanels.value = Array.from({ length: results.length }, (_, index) => index);
      }

      return results;
    });

    const clearTranslations = () => {
      translationResults.value = null;
      translationError.value = null;
    };

    const checkTranslations = async () => {
      loading.value = true;
      translationResults.value = null;
      translationError.value = null;

      const inputTranslations = Object.keys(translations.value).map((section) => ({
        section,
        translation: translations.value[section],
      }));

      const variables = {
        input: {
          author: selectedAuthor.value,
          book: selectedBook.value,
          reference: selectedReference.value,
          translations: inputTranslations,
        },
      };

      try {
        const { onResult, onError } = useQuery(HerodotosCheck, variables);
        onResult((response) => {
          loading.value = false;
          if (response.data) {
            translationResults.value = response.data.check;
          } else {
            translationResults.value = null;
            translationError.value = { message: 'No results found' };
          }
        });
        onError((error) => {
          loading.value = false;
          translationResults.value = null;
          translationError.value = error;
        });
      } catch (error) {
        loading.value = false;
        translationResults.value = null;
        translationError.value = error;
      }
    };

    const groupedTranslations = computed(() => {
      if (!translationResults.value) return [];

      const grouped = translationResults.value.sections.reduce((acc, section) => {
        if (!acc[section.section]) {
          acc[section.section] = {
            section: section.section,
            translations: [],
          };
        }
        acc[section.section].translations.push({
          levenshteinPercentage: section.levenshteinPercentage,
          answerSentence: section.answerSentence,
          quizSentence: section.quizSentence,
        });
        return acc;
      }, {});

      return Object.values(grouped);
    });

    const onBookSelected = (authorKey, bookKey) => {
      translationResults.value = null;
      translationError.value = null;
      selectedAuthor.value = authorKey;
      selectedBook.value = bookKey;
      const author = authors.value.find((a) => a.key === authorKey);
      const book = author.books.find((b) => b.key === bookKey);
      selectedBookReferences.value = sortedReferences(book.references);
      selectedReference.value = '';
      selectedSection.value = '';
      selectedReferenceSections.value = [];
      resultData.value = null;
      translations.value = {};

      updateURL({
        author: authorKey,
        book: bookKey,
      });
    };

    const onReferenceSelected = (bookKey, referenceKey) => {
      translationResults.value = null;
      translationError.value = null;
      selectedBook.value = bookKey;
      selectedReference.value = referenceKey;
      const book = selectedBookReferences.value.find((b) => b.key === referenceKey);
      selectedReferenceSections.value = sortedSections(book.sections);
      selectedSectionIndex.value = -1;
      selectedSection.value = '';
      resultData.value = null;
      translations.value = {};

      updateURL({
        author: selectedAuthor.value,
        book: bookKey,
        reference: referenceKey,
      });
    };

    const onSectionChanged = (index) => {
      if (index >= 0) {
        selectedSection.value = selectedReferenceSections.value[index].key;
      } else {
        selectedSection.value = '';
      }
      resultData.value = null;
      translations.value = {};
    };

    const onSectionSelected = (sectionKey) => {
      translationResults.value = null;
      translationError.value = null;
      selectedSection.value = sectionKey;
      selectedSectionIndex.value = selectedReferenceSections.value.findIndex((s) => s.key === sectionKey);
      resultData.value = null;
      translations.value = {};
    };

    const sortedSections = (sections) => {
      return sections.slice().sort((a, b) => {
        const aNum = parseFloat(a.key);
        const bNum = parseFloat(b.key);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        } else {
          return a.key.localeCompare(b.key);
        }
      });
    };

    const sortedReferences = (references) => {
      return references.slice().sort((a, b) => {
        const parseReference = (ref) => {
          const parts = ref.split('.');
          return parts.map((part) => parseFloat(part));
        };

        const [aMain, aSub] = parseReference(a.key);
        const [bMain, bSub] = parseReference(b.key);

        if (aMain !== bMain) {
          return aMain - bMain;
        } else {
          if (aSub !== undefined && bSub !== undefined) {
            return aSub - bSub;
          } else if (aSub === undefined) {
            return -1;
          } else if (bSub === undefined) {
            return 1;
          }
          return 0;
        }
      });
    };

    const updateURL = (query) => {
      const currentQuery = proxy.$route.query;
      const newQuery = { ...currentQuery, ...query };

      if (!query.reference) {
        delete newQuery.reference;
      }

      const queryChanged = Object.keys(newQuery).length !== Object.keys(currentQuery).length ||
          Object.keys(newQuery).some(key => currentQuery[key] !== newQuery[key]);


      if (queryChanged) {
        proxy.$router.replace({ name: 'Herodotos', query: newQuery });
      }
    };

    const initializeFromRoute = () => {
      const { author, book, reference } = proxy.$route.query;
      if (author) {
        selectedAuthor.value = author;
      }
      if (book) {
        selectedBook.value = book;
      }
      if (reference) selectedReference.value = reference;
    };

    onMounted(() => {
      initializeFromRoute(); // Initialize state from URL on mount
    });

    return {
      theme,
      searchQuery,
      authors,
      selectedAuthor,
      selectedBook,
      selectedReference,
      selectedSection,
      selectedBookReferences,
      selectedReferenceSections,
      selectedSectionIndex,
      filteredAuthors,
      autocompleteAuthorsAndBooks,
      onBookSelected,
      onReferenceSelected,
      onSectionChanged,
      onSectionSelected,
      sortedSections,
      sortedReferences,
      loading,
      error,
      resultData,
      queryLoading,
      queryError,
      translations,
      dialog,
      clickedWord,
      grammarResults,
      grammarError,
      translationResults,
      translationError,
      groupedTranslations,
      cycle,
      onWordClick,
      handleKeyPress,
      mobileView,
      checkTranslations,
      clearTranslations,
      expandedPanels,
      toggleExpandAll,
      expandAll,
      clearSearchResults,
      infoDialogVisible,
    };
  },
};
</script>


<style scoped>
.clickable-word {
  cursor: pointer;
}

.quiz-button {
  margin: 0.5em;
}

.mx-auto {
  background-color: #1e3c72; /* Dark blueish background */
}

.v-card .v-card-text {
  max-width: 100%;
  overflow: hidden;
}

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

.rhema-section {
  margin-bottom: 20px;
}

.clickable-word {
  cursor: pointer;
  color: #020202;
  font-family: 'Noto Sans Coptic', sans-serif;
}

.clickable-word:hover {
  text-decoration: underline;
}

.text-right {
  text-align: right;
}

.list-item {
  color: inherit; /* Ensure the list item text inherits the color from the parent */
  white-space: normal; /* Allow text to wrap */
}

</style>
