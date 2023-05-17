<template>
  <div id="quizarea">
    <v-app
        id="navbar"
        :style="{background: $vuetify.theme.themes[theme].background}"
    >
      <v-main>
        <div class="text-center">
          <div style="margin-bottom:2em;">
            <v-btn
                class="ma-2"
                color="primary"
                v-on:click="displayInfo=!displayInfo;stepper=1"
            >
              Howto
              <v-icon
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
                  Select Method and Category
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                    :complete="stepper > 2"
                    step="2"
                >
                  Select Chapter
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="3">
                  Answer Questions
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-card
                      class="mb-12"
                      color="white"
                      height="14em"
                  >Press one of the buttons below "Methods". The categories for that Method can then be selected.
                  <br>
                    Some of these are based on books (such as Aristophanes -> frogs) and others on more general terms.
                    <br>
                    MOUSEION is Dutch only.
                  </v-card>

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
                      height="14em"
                  >Chapters can be chosen by typing and pressing SET CHAPTER.
                    <br>
                    Between brackets (for example: Chapters (1 -93)) are the available chapters
                  <br>
                  You can only set a chapter after you have chosen a method and catergory. Each chapter is 10 words at this time.</v-card>


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
                      height="14em"
                  >After having set a Method with a Category and a chapter (default is 1) you can start testing your knowledge.
                    <br>
                    For example:
                    <br>
                    Translate:
                    ἀλλά
                    <br>
                    Choose one of the options below and click the right answer. You will be shown whether you are right or not!
                    A graph is displayed just for fun.
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
          <br />

          <v-card
              class="mx-auto"
              max-width="20em"
          >
            <v-toolbar
                color="primary"
                dark
                dense
            >
              <v-toolbar-title>Methods</v-toolbar-title>

              <v-spacer></v-spacer>

            </v-toolbar>

            <v-list>
              <v-list-group
                  v-for="item in methods"
                  @click="selectedMethod = item.name;"
                  :key="item.name"
                  v-model="item.active"
                  :prepend-icon="item.action"
                  no-action
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item
                    v-for="child in item.categories"
                    :key="child.name"
                    @click="category=child.name;setChapter(1)"
                    v-on:click="getChapters(child.name, item.name);scrollMeTo('chapter');item.active=false"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="child.name"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list>
          </v-card>

          <br />
          <br />
            <v-container v-if="category.length" ref="chapter">
              <v-row justify="center" align="center">
                <v-col
                    cols="12"
                    md="4"
                >
                  <v-text-field
                      v-model="inputChapter"
                      min="1"
                      :max=chapters
                      :rules="numberRules"
                      :label=labelText
                      type="number"
                      required
                  ></v-text-field>
                  <v-btn
                      :disabled="!valid"
                      color="primary"
                      dark
                      rounded
                      @click="validate();scrollMeTo('quiz')"
                  >
                    Set Chapter
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          <br>

          <div ref="quiz" v-if="quizWord.length">
          <h2>Method: {{this.selectedMethod}} - Category: {{ this.category}} - Chapter {{this.selectedChapter}}</h2>
          <h3>Translate:</h3>
          <h3>{{quizWord}}</h3>
          <br />
          <div v-if="showAnswer">
            <div style="min-height: 4px">
              <v-progress-linear
                  v-model="value"
                  width="100%"
              ></v-progress-linear>
            </div>
            <v-alert
                v-if="correct"
                dense
                prominent
                type="success"
                icon="done"
                color="#1de9b6"
                transition="slide-y-transition"
            >
              <v-row align="center">
                <v-col class="grow">
                  The correct answer was indeed {{correctAnswer}}
                </v-col>
                <v-col class="shrink">
                  <v-btn
                      id="nextButton"
                      v-on:click="getNextQuestion"
                      rounded
                      color="primary"
                      dark
                  >
                    Next
                  </v-btn>
                </v-col>
              </v-row>
            </v-alert>
            <v-alert
                v-if="!correct"
                dense
                prominent
                type="error"
                icon="close"
                color="#e9501d"
                transition="slide-y-transition"
            >
              <v-row align="center">
                <v-col class="grow">
                  The correct answer was: {{correctAnswer}}
                </v-col>
                <v-col class="shrink">
                  <v-btn
                      id="nextButton"
                      v-on:click="getNextQuestion"
                      rounded
                      color="primary"
                      dark
                  >
                    Next
                  </v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </div>
          <div v-if="!showAnswer && showButtons">
            <v-btn v-for="item in answers"
                v-on:click="checkAnswer(item);showLoader();"
                class="ma-4"
                color="triadic"
                :width="widthStyle"
            >
              <span>{{ item }}</span>
            </v-btn>
          </div>
          <br />
          <br />
          <h4>
            You answered {{correctlyAnswered}} of {{answered}} correctly ({{percentage
            }}%)
          </h4>
          <v-btn v-on:click="resetProgress" rounded color="primary" dark>
            Reset Progress
          </v-btn>

          <div>
            <div style="width:75%; margin: 5em auto;">
              <v-data-table
                  :disable-sort="true"
                  :headers="headers"
                  :items="historyTable"
                  :items-per-page="5"
                  class="elevation-1"
              >
                <template v-slot:item.input="{ item }">
                  <v-chip
                      :color="item.color"
                  >
                    {{ item.input }}
                  </v-chip>
                </template>
              </v-data-table>
           </div>
          </div>
          <v-sparkline
              :value="this.graphNumbers"
              :gradient="['#1affcb', '#e9b61d', '#e9501d']"
              :smooth="radius || false"
              :padding="padding"
              :line-width="width"
              :stroke-linecap="lineCap"
              :gradient-direction="gradientDirection"
              :fill="fill"
              :type="type"
              :auto-line-width="autoLineWidth"
              auto-draw
          ></v-sparkline>
        </div>
        </div>
      </v-main>
    </v-app>
  </div>
</template>

<script>


import {SokratesCheckAnswer, SokratesCreateQuestion, SokratesTreeQuery} from "@/constants/graphql";

export default {
  name: "QuizArea",
  computed: {
    theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
  },
  data() {
    return {
      headers: [
        { text: 'Greek', value: 'greek', align: 'center' },
        { text: 'Input', value: 'input', align: 'center' },
        {text: 'Answer', value: 'answer', align: 'center'},
        {text: 'Method', value: 'method', align: 'center'},
        {text: 'Category', value: 'category', align: 'center'}
      ],
      historyTable: [],
      widthStyle : "33%",
      valid: true,
      showButtons: false,
      alignments: [
        'start',
        'center',
        'end',
      ],
      inputChapter: 1,
      showAnswer: false,
      correctAnswer: "",
      quizWord: [],
      answers: [],
      correct: false,
      category: "",
      selectedMethod: "",
      answered: 0,
      correctlyAnswered: 0,
      percentage: 100,
      graphNumbers: [0],
      chapters : "",
      labelText: 'Chapters: (1 - 1)',
      numberRules: [
        v => !!v || 'Chapter is required',
        v => (v && v <= this.chapters) || 'Chapter cannot exceed chapters',
        v => (v && v !== 0) || 'non zero'
      ],
      closeOnContentClick: true,
      selectedChapter : 1,
      categories: [],
      methods: [],
      value: 0,
      interval: 0,
      width: 2,
      radius: 10,
      padding: 8,
      lineCap: 'round',
      gradientDirection: 'top',
      fill: false,
      type: 'trend',
      autoLineWidth: false,
      stepper: 1,
      displayInfo: false,
    }
  },
  apollo: {
    methods: {
      query: SokratesTreeQuery,
      result({data, loading, networkStatus}) {
        this.selectedMethod = data.methods[0].name
      },
      pollInterval: 5 * 60 * 1000, // refresh data every 5 min
    },
  },
  methods: {
    showLoader () {
      this.value = 0

      this.interval = setInterval(() => {
        if (this.value >= 100) {
          clearInterval(this.interval)
        }
        this.value += 6
      }, 100)
    },
    hideAlert: function () {
      setTimeout(() => {
        if(this.showAnswer === true) {
          this.getQuestion()
          this.showAnswer = false
        }
      }, 2000);
    },
    scrollMeTo(refName) {
      let element = this.$refs[refName];
      let top = element.offsetTop;

      window.scrollTo(0, top);
    },
    async getQuestion () {
      this.showButtons = false
      this.$apollo.query({
          query: SokratesCreateQuestion,
          variables: {
            category: this.category,
            chapter: this.selectedChapter,
            method: this.selectedMethod,
          },
        fetchPolicy: "no-cache",
      }).then(async (response) => {
        console.log(response)
        this.quizWord = response.data.quiz.question;
        this.correctAnswer = response.data.quiz.answer
        let slicedArray = response.data.quiz.quiz.slice(0, 4)
        this.answers = await this.createNewArray(slicedArray);
        this.showButtons = true
      })
    },
    checkAnswer (selectedAnswer) {
      this.answered++
      this.$apollo.query({
        query: SokratesCheckAnswer,
        variables: {
          answerProvided: selectedAnswer,
          quizWord: this.quizWord
        },
        fetchPolicy: "no-cache",
      }).then((response) => {
        this.correct = response.data.answer.correct
        this.showAnswer = true;
        if (this.correct) {
          this.correctlyAnswered++
        }

        let color = "#1de9b6"
        if(!this.correct) {
          color = "#e9501d"
        }

        let lastAnswer = {
          greek: this.quizWord,
          color: color,
          answer: this.correctAnswer,
          input: selectedAnswer,
          category: this.category,
          method: this.selectedMethod,
        }

        this.historyTable.unshift(lastAnswer)

        this.percentage = Math.round(this.correctlyAnswered / this.answered * 100)
        let inNumbers = Math.round(this.correctlyAnswered / this.answered * 10)
        this.graphNumbers.push(inNumbers)
      })
          .catch(e => {
            this.errors.push(e)
          })
      this.hideAlert()
    },
    async createNewArray(shuffeledArray) {
      for (let i = shuffeledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffeledArray[i], shuffeledArray[j]] = [shuffeledArray[j], shuffeledArray[i]];
      }

      return shuffeledArray
    },
    getNextQuestion: function () {
      clearInterval(this.interval)
      this.value = 0
      this.showAnswer = false;
      this.getQuestion()
    },
    resetProgress : function () {
      this.correctlyAnswered = 0
      this.answered = 0
      this.percentage = 100
    },
    setChapter(chapter) {
      this.selectedChapter = chapter
      this.getQuestion()
    },
    getChapters(selectedCategory, selectedMethod) {
      let highChapter = 1
      this.methods.forEach(function (method) {
        if (method.name === selectedMethod) {
          method.categories.forEach( function (category) {
            if (category.name === selectedCategory) {
              highChapter = category.highestChapter
            }
          })
        }
      })
      this.chapters = highChapter
      this.labelText = `Chapters: (1 - ${highChapter})`
    },
    validate() {
      const validator = parseInt(this.inputChapter)
      const isNotZero = validator < 1
      const higher = validator > this.chapters
      if (!isNotZero && !higher) {
        this.setChapter(validator)
      }
    },
    isMobile() {
      return screen.width <= 800;
    },
  },
  mounted() {
    this.correctlyAnswered = 0
    this.answered = 0
    this.percentage = 100
  },
  created() {
    if (this.isMobile()) {
      this.widthStyle = "90%"
    }
    else {
      this.flex = 6;
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
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
