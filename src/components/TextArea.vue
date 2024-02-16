<template>
  <div id="herodotos">
    <v-app
        id="sentencearea"
        :style="{background: $vuetify.theme.themes[theme].background}"
    >
      <v-main>
        <div class="text-center">
          <div style="margin-bottom:2em;">
            <v-btn
                class="ma-2"
                color="primary"
                dark
                v-on:click="displayInfo=!displayInfo;stepper=1"
            >
              Howto
              <v-icon
                  dark
                  right
              >
                info
              </v-icon>
            </v-btn>
            <v-stepper v-model="stepper" v-if="displayInfo">
              <v-stepper-header>
                <v-stepper-step
                    :complete="stepper > 1"
                    step="1"
                >
                  Select Author
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                    :complete="stepper > 2"
                    step="2"
                >
                  Select Book
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="3">
                  Type Translation
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-card
                      class="mb-12"
                      color="white"
                      height="5em"
                  >Press the Authors button and choose one of the available Authors (a pop up will appear)</v-card>

                  <v-btn
                      color="primary"
                      @click="stepper = 2"
                  >
                    Next Step
                  </v-btn>

                  <v-btn
                      text
                      v-on:click="displayInfo=!displayInfo">
                    Close
                  </v-btn>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-card
                      class="mb-12"
                      color="white"
                      height="5em"
                  >Press the Books button and choose one of the available Books (a pop up will appear)</v-card>

                  <v-btn
                      color="primary"
                      @click="stepper = 3"
                  >
                    Next Step
                  </v-btn>

                  <v-btn
                      text
                      v-on:click="displayInfo=!displayInfo">
                    Close
                  </v-btn>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <v-card
                      class="mb-12"
                      color="white"
                      height="12em"
                  >Type your translation and when done hit the CHECK button. You can toggle Translation assistance where
                    Odysseia will attempt to help you decline and translate the word (limited at this time).<br>
                    Any typos will be displayed after you have given your translation along side a "official" translation
                    </v-card>
                  <v-btn
                      text
                      v-on:click="displayInfo=!displayInfo">
                    Close
                  </v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
            </div>
          <v-card class="mx-auto" max-width="40em">
            <v-card-text>
              <p class="text-h4 text--primary">
                {{ this.selectedAuthor }} Book: {{ this.selectedBook }}
              </p>
              <v-menu top :close-on-content-click="closeOnContentClick">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" dark v-bind="attrs" v-on="on" rounded>
                    Authors
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                      v-for="(author, index) in authors"
                      :key="index"
                      v-on:click="setAuthorTo(author.name)"
                  >
                    <v-list-item-title>{{ author.name }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-menu top :close-on-content-click="closeOnContentClick">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" dark v-bind="attrs" v-on="on" rounded>
                    Books
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                      v-for="(book, index) in books"
                      :key="index"
                      v-on:click="setBookTo(book)"
                  >
                    <v-list-item-title>{{ book }}</v-list-item-title>
                  </v-list-item>
              </v-list>
              </v-menu>
              <div class="text--primary">
                <v-textarea
                    readonly
                    v-model="sentence"
                ></v-textarea>
              </div>
              <h4>Possible Typos</h4>
              <v-list
                  v-for="(typo, index) in possibleTypos"
                  :key="index">
                <v-list-item>
                  <v-list-item-title>{{typo.verified}} => {{ typo.provided}}</v-list-item-title>
                </v-list-item>
              </v-list>
              <v-container fluid>
                <v-textarea
                    clearable
                    v-model="translationText"
                    clear-icon="close"
                    label="Type your translation here."
                    value="Type your translation here."
                ></v-textarea>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn
                  text
                  color="teal accent-4"
                  @click="reveal = true"
                  v-on:click="checkAnswer();"
              >
                Check
              </v-btn>
              <v-btn
                  text
                  color="teal accent-4"
                  @click="reveal = false"
                  v-on:click="getNewSentence();"
              >
                Next
              </v-btn>
            </v-card-actions>
            <v-card
                v-if="reveal"
                class="transition-fast-in-fast-out v-card--reveal"
                style="height: 100%"
            >
              <v-card-text class="pb-0">
                <p class="text-h4 text--primary">Translation</p>
                <p>Correctness: {{this.translationPercentage}}%</p>
                {{ this.databaseAnswer }}
              </v-card-text>
              <v-card-actions class="pt-0">
                <v-btn text color="teal accent-4" @click="reveal = false">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
            <div style="margin-bottom:1em; margin-left:1em;">
            <v-switch
                v-model="mobileView"
                label="Translation Assistance"
                color="primary"
                value="primary"
                hide-details
            ></v-switch>
            </div>
            <v-card-text v-if="mobileView">
              <v-chip-group
                  active-class="deep-purple accent-4 white--text"
                  column
              >
                <v-chip
                    v-for="(word, index) in seperatedWords"
                    :key="index"
                    v-on:click="queryWord(word)"
                    class="ma-1"
                    color="triadic"
                >
                  {{ word }}
                </v-chip>
              </v-chip-group>
            </v-card-text>
            <v-expand-transition>
              <v-card
                  elevation="24"
                  max-width="444"
                  class="mx-auto"
              >
                <v-system-bar lights-out></v-system-bar>
                <div class="text-overline mb-4">
                  Translation
                </div>
                <v-carousel
                    :continuous="false"
                    :cycle="cycle"
                    :show-arrows="true"
                    hide-delimiter-background
                    height="300"
                >
                  <v-carousel-item
                      v-for="(result, i) in grammarResults"
                      :key="i"
                  >
                    <v-sheet
                        height="100%"
                        tile
                    >
                      <v-row
                          class="fill-height"
                          align="center"
                          justify="center"
                      >
                        <v-list-item-title class="text-h5 mb-1">
                          {{ result.word }}
                        </v-list-item-title>
                        <v-list-item-title class="text-h5 mb-1">
                          {{ result.translation }}
                        </v-list-item-title>
                        <v-list-item-subtitle><strong>root:</strong> {{result.rootWord}}</v-list-item-subtitle>
                        <v-list-item-subtitle><strong>rule:</strong> {{result.rule}}</v-list-item-subtitle>
                      </v-row>
                    </v-sheet>
                  </v-carousel-item>
                </v-carousel>
                <v-list two-line>
                  <v-list-item>
                    <v-list-item-action>
                      <v-switch
                          v-model="cycle"
                          label="Cycle Translations"
                          inset
                      ></v-switch>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-expand-transition>
          </v-card>
        </div>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import {HerodotosTreeQuery, CheckGrammar, HerodotosCreateSentence, HerodotosCheckSentence} from '../constants/graphql'

export default {
  name: "TextArea",
  computed: {
    theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    },
  },
  data() {
    return {
      errors: [],
      authors: [],
      books: [],
      grammarResults: [],
      possibleTypos: [],
      seperatedWords: [],
      selectedAuthor: "",
      selectedBook: "",
      sentence: "",
      currentSentenceId: "",
      translationText: "",
      translationPercentage: "",
      databaseAnswer: "",
      closeOnContentClick: true,
      reveal: false,
      cycle: false,
      mobileView: false,
      displayInfo: false,
      stepper: 1,
    }
  },
  apollo: {
    authors: {
      query: HerodotosTreeQuery,
      result({data, loading, networkStatus}) {
        const nameCapitalized = data.authors[0].name.charAt(0).toUpperCase() + data.authors[0].name.slice(1)
        // this.selectedAuthor = nameCapitalized
        {
          const nameCapitalized = data.authors[0].name.charAt(0).toUpperCase() + data.authors[0].name.slice(1)
          // this.selectedAuthor = nameCapitalized
          const innerBooks = []
          data.authors[0].books.forEach(function (book) {
            innerBooks.push(book.book)
          })
          this.books = innerBooks
          // this.setBookTo(innerBooks[0])
        }
      }
    },
},
  methods: {
    updateURLParams() {
      const { selectedAuthor, selectedBook } = this;
      this.$router.push({ path: '/texts', query: { author: selectedAuthor, book: selectedBook } });
    },
    setAuthorTo(author) {
      const nameCapitalized = author.charAt(0).toUpperCase() + author.slice(1)
      this.selectedAuthor = nameCapitalized
      const innerBooks = []
      this.authors.forEach(function (loopAuthor) {
        if (loopAuthor.name === author) {
          loopAuthor.books.forEach(function (book) {
            innerBooks.push(book.book)
          })
        }
      })
      this.books = innerBooks
      this.setBookTo(innerBooks[0])
    },
    setBookTo(book) {
      this.selectedBook = book
      this.getNewSentence()
    },
    queryWord: function (word) {
      this.$apollo.query({
        query: CheckGrammar,
        variables: {
          word: word,
        },
      }).then((response) => {
        let extraTranslation = []
        for (let i = 0; i < response.data.grammar.length; i++) {
          if (response.data.grammar[i].translation === "") {
            response.data.grammar[i].translation = "No translation found"
          }

          if (response.data.grammar[i].translation.length > 25) {
            let words = response.data.grammar[i].translation.split(";")
            if (words.length > 1) {
              for (let j = 0; j < words.length; j++) {
                let rule = response.data.grammar[i].rule
                let rootWord = response.data.grammar[i].rootWord
                extraTranslation.push(
                    {
                      "word": word,
                      "rule": rule,
                      "rootWord": rootWord,
                      "translation": words[j]
                    }
                )
              }

              response.data.results.splice(i, 1)
            }
          }
        }

        this.grammarResults = response.data.grammar
        if (extraTranslation !== []) {
          for (let i= 0; i < extraTranslation.length; i++) {
            this.grammarResults.push(extraTranslation[i])
          }
        }
      })
          .catch(e => {
            this.grammarResults =  [{
              "word"  :  word,
              "translation"   :  "No translation found",
              "rootWord"      :  word,
              "rule" : "No rule found"
            }]

            this.errors.push(e)
          })
    },

    getNewSentence: function () {
      const author = this.selectedAuthor.toLowerCase()
      this.$apollo.query({
        query: HerodotosCreateSentence,
        variables: {
          author: author,
          book: this.selectedBook.toString()
        },
        fetchPolicy: "no-cache",
      }).then((response) => {
        this.sentence = response.data.sentence.greek
        let cleanedText = response.data.sentence.greek
            .replaceAll(",", "")
            .replaceAll(".", "")
            .replaceAll("—", " ")
        this.seperatedWords = cleanedText.split(" ")
        this.currentSentenceId = response.data.sentence.id
      })
      .catch(e => {
        console.log(e)
        this.errors.push(e)
      })
    },
    checkAnswer: function () {
      const author = this.selectedAuthor.toLowerCase()
      this.$apollo.query({
        query: HerodotosCheckSentence,
        variables: {
          sentenceId: this.currentSentenceId,
          author: author,
          answer: this.translationText,
        },
        fetchPolicy: "no-cache",
      }).then((response) => {
        this.translationPercentage = response.data.text.levenshtein
        this.databaseAnswer = response.data.text.quiz
        this.searchPossibleTypos(response.data.text.mistakes)
      })
    },
    searchPossibleTypos: function (words) {
      this.possibleTypos = []
      let i;
      for (i in words) {
        let j;
        for (j in words[i].nonMatches) {
          const percentage = parseFloat(words[i].nonMatches[j].percentage);
          if (words[i].nonMatches[j].levenshtein <= 2 && percentage > 50.00) {
            let jsonMap = {
              "provided": words[i].word,
              "verified": words[i].nonMatches[j].match
            }
            this.possibleTypos.push(jsonMap)
          }
        }
      }
    },
  },
  mounted() {
  },
  created() {
    this.selectedAuthor = this.$route.query.author || "";
    this.selectedBook = this.$route.query.book || "";

    if (this.selectedAuthor) {
      this.selectedAuthor = this.selectedAuthor.charAt(0).toUpperCase() + this.selectedAuthor.slice(1);
    }
  },
  watch: {
    // Watch for changes in selectedAuthor and selectedBook properties
    selectedAuthor() {
      // Update the URL query parameter when the selectedAuthor changes
      this.updateURLParams();
      this.getNewSentence();
    },
    selectedBook() {
      this.updateURLParams();
      this.getNewSentence();
    }
  },
}
</script>

<style scoped>
h2 {
  margin: 1em;
}

h3 {
  margin: 0.5em;
}

h4 {
  margin: 0.5em;
}
</style>
