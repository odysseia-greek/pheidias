<template>
  <div id="quizarea">
    <v-app
        id="navbar"
        :style="{background: $vuetify.theme.themes[theme].background}"
    >
      <v-main>
        <div class="text-center">
          <div  v-if="showAllOptions" style="margin-bottom:2em;">
            <v-btn
                class="ma-4"
                color="primary"
                v-on:click="displayInfo=!displayInfo;stepper=1"
            >
              How To
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
                  Select Quiz Type
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step
                    :complete="stepper > 2"
                    step="2"
                >
                  Select Theme
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step
                    :complete="stepper > 3"
                    step="3"
                >
                  Select Set
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="4">
                  Other Options
                </v-stepper-step>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-card class="mb-12 text-left" color="white">
                    First select the quiz type you want to be play <strong>this page looks best on a tablet resolution (820px).</strong>
                    <br>
                    <br>
                    <ul>
                      <li>
                        <strong>Author:</strong> multiple choice questions taken from great works of literature.
                      </li>
                      <li>
                        <strong>Dialogue:</strong> converse in Ancient Greek with Ancient Greeks! This mode allows you to recreate dialogue taken from great works
                        of literature. You are asked to put the conversation in the right order.
                      </li>
                      <li>
                        <strong>Media:</strong> this quiz type has images and (in the future) audio for you to have an interactive experience.
                      </li>
                    </ul>
                    <br>
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
                  <v-card class="mb-12 text-left" color="white">
                    Themes can be chosen in dialogue and author mode. Each theme represents a work from antiquity.
                    <br>
                    <br>
                    For example: <strong>Aeschylus - Agamemnon</strong> or <strong>Homer - Odyssey</strong>.
                    Dialogue or multiple choice will be taken from these works.
                    <br>
                    <br>
                    Since the quiz words are the words that appear the most in certain text there will always be quite some overlap between the different themes.
                  </v-card>
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
                  <v-card class="mb-12 text-left" color="white">
                    A set is a number of quiz items within a quiz. Each set consists of <strong>20</strong> words that will randomly be presented as a quiz.
                    <br>
                    <br>
                    Some sets might be a bit smaller or larger than 20 because the total number of quizwords is larger than x * 20.
                    <br>
                    <br>
                    In authormode sets are divided by word size and whenever possible in nouns and verbs.
                  </v-card>
                  <v-btn
                      color="primary"
                      @click="stepper = 4"
                  >
                    Next Step
                  </v-btn>
                  <v-btn
                      text
                      v-on:click="displayInfo=!displayInfo">
                    Close
                  </v-btn>
                </v-stepper-content>
                <v-stepper-content step="4">
                  <v-card class="mb-12 text-left" color="white">
                    Additional options to turn on and off by pressing the cogwheel on the right
                    <v-icon>mdi-cog</v-icon>
                    which will appear after selecting a Quiz Mode.
                    <br>
                    <br>
                    <ul>
                      <li>
                        <strong>Show Text With Images:</strong> when using media or image based modes you the images can be appended with an English test.
                      </li>
                      <li>
                        <strong>Extended Mode:</strong> available in image, media and authorbased modes. This will show words that are similar and where in text you can find a word in all it's known declensions.
                        <br>
                        The known declensions are based on words found in the grammar component <a href="/grammar">link</a>.
                      </li>
                      <li>
                        <strong>Show Translation:</strong> adds translations in Dialogue mode.
                      </li>
                      <li>
                        <strong>Show History Table:</strong> in non dialogue quiz modes you can see the answers you have given in this history table making it easier to remember previous entries.
                      </li>
                      <li>
                        <strong>Show All Options:</strong> unclutters the screen by removing everything but the Quiz Area itself. Extended mode can still be enabled when all other options are removed.
                      </li>
                    </ul>
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
          <br>
          <v-container class="quiz-container">
            <!-- Quiz Mode Buttons -->
            <v-row v-if="showAllOptions">
              <v-col
                  v-for="(quiz, index) in quizModes"
                  :key="index"
                  cols="12"
                  sm="6"
              >
                <v-btn
                    class="ma-1 quiz-button"
                    :class="{ 'pulsate': selectedQuizMode === '' }"
                    :color="selectedQuizMode === quiz.value ? 'primary' : 'triadic'"
                    block
                    @click="selectQuiz(quiz.value)"
                >
                  <v-icon left>
                    {{ quiz.icon }}
                  </v-icon>
                  {{ quiz.text }}
                </v-btn>
              </v-col>
            </v-row>
            <div class="settings-icon">
              <v-menu offset-y v-if="selectedQuizMode !== ''">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" color="footer">
                    <v-tooltip bottom :disabled="isTouchDevice">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" large>mdi-cog</v-icon>
                      </template>
                      <span>Settings</span>
                    </v-tooltip>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-if="selectedQuizMode === 'media'">
                    <v-list-item-content>Show text with images</v-list-item-content>
                    <v-list-item-action>
                      <v-switch v-model="showEnglishText"></v-switch>
                    </v-list-item-action>
                  </v-list-item>
                  <v-list-item v-if="selectedQuizMode === 'media' || selectedQuizMode === 'authorbased'">
                    <v-list-item-content>Extended Mode</v-list-item-content>
                    <v-list-item-action>
                      <v-switch v-model="isComprehensive"></v-switch>
                    </v-list-item-action>
                  </v-list-item>
                  <v-list-item v-if="selectedQuizMode === 'media' || selectedQuizMode === 'authorbased'">
                    <v-list-item-content>Show History Table</v-list-item-content>
                    <v-list-item-action>
                      <v-switch v-model="showHistoryIndicator"></v-switch>
                    </v-list-item-action>
                  </v-list-item>
                  <v-list-item v-if="selectedQuizMode === 'dialogue'">
                    <v-list-item-content>Show Translation</v-list-item-content>
                    <v-list-item-action>
                      <v-switch v-model="showDialogueTranslation"></v-switch>
                    </v-list-item-action>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>Show All Options</v-list-item-content>
                    <v-list-item-action>
                      <v-switch v-model="showAllOptions"></v-switch>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <v-combobox
                v-if="selectedQuizMode !== '' && selectedQuizMode !== quizModes[0].value && showAllOptions"
                class="mt-5"
                :class="{ 'pulsate': selectedTheme === '' && selectedQuizMode !== 'media' }"
                v-model="selectedTheme"
                :items="options"
                item-text="name"
                item-value="name"
                label="Theme"
                return-object
                @change="onThemeSelect"
            ></v-combobox>
            <v-slider
                v-if="selectedQuizMode !== '' && selectedQuizMode !== quizModes[2].value && showAllOptions"
                class="my-5"
                label="Set"
                v-model="selectedSet"
                :max="maxSet"
                :min="1"
                thumb-label="always"
            ></v-slider>
            <v-row v-if="isComprehensive" ref="comprehensive">
              <!-- Similar Words Card -->
              <v-col cols="12" md="6">
                <v-card class="pa-3" outlined>
                  <v-card-title>Similar Words</v-card-title>
                  <v-card-subtitle>Go to the dictionary for much more</v-card-subtitle>
                  <v-card-subtitle>{{ lastInteractiveWord }}</v-card-subtitle>
                  <v-card-text>
                    <v-list dense>
                      <v-list-item
                          v-for="(word, index) in similarWords"
                          :key="index"
                      >
                        <v-list-item-content>
                          {{ word.greek }} - {{ word.english }}
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
              <!-- Placeholder for Text Items Card -->
              <v-col cols="12" md="6">
                <v-card :class="{'minimized-text-box': isTextBoxMinimized}" class="pa-3" outlined>
                  <v-card-title>
                    Found In Texts
                    <v-btn icon small @click="isTextBoxMinimized = !isTextBoxMinimized">
                      <v-icon>{{ isTextBoxMinimized ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-subtitle>Go to the grammar and text area for much more</v-card-subtitle>
                  <v-card-text v-show="!isTextBoxMinimized">
                    <v-list dense>
                      <v-list-item v-for="(text, index) in rhemai" :key="index">
                        <v-list-item-content>
                          <span class="author-name">{{ text.author }}</span> - <span v-html="highlightText(text.greek)"></span>
                          <br>
                          <span class="italic-text">{{ text.translations[0] }}</span>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <div v-if="isComprehensive">
              <v-btn
                  color="primary"
                  @click="scrollMeTo('quiz')"
                  style="margin: 4em"
              >
                To Quiz Area
              </v-btn>
            </div>
          </v-container>
          <div ref="quiz" class="quiz-container">
            <v-container v-if="selectedQuizMode !== 'dialogue' && quizWord">
              <h3>Translate:</h3>
              <div class="quiz-word-container">
                <h2>{{quizWord}}</h2>
              </div>
            </v-container>
            <br />
            <div v-if="correct && showNextQuestionIndicator" class="text-center mb-4">
              <v-progress-circular
                  indeterminate
                  color="primary"
                  width="3"
                  size="48"
              ></v-progress-circular>
            </div>
            <v-container v-if="selectedQuizMode === 'dialogue'">
              <!-- Introduction -->
              <v-card class="mb-3">
                <v-card-title>Introduction</v-card-title>
                <v-card-text>{{ dialogueOptions.introduction }}</v-card-text>
              </v-card>
              <!-- Speaker Selection -->
              <v-card class="mb-3">
                <v-card-title>What role do you want to play?</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                        v-for="(speaker, index) in dialogueOptions.speakers"
                        :key="index"
                        cols="12"
                        sm="6"
                    >
                      <v-btn
                          class="ma-1"
                          :color="selectedSpeaker === speaker.shorthand ? 'primary' : 'triadic'"
                          block
                          @click="setSpeaker(speaker);scrollMeTo('dialogue');"
                      >
                        {{ speaker.shorthand }} {{ speaker.translation}}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card v-if="dialogueText.length > 0">
                <v-card-title ref="dialogue">Dialogue</v-card-title>
                <v-card-text>
                  <div v-for="(line, index) in dialogueText" :key="index" class="dialogue-line" :class="{'user-speaker': line.speaker === selectedSpeaker, 'other-speaker': line.speaker !== selectedSpeaker, 'wrongly-placed': line.isWronglyPlaced}">
                    <div class="dialogue-bubble">
                      <strong>{{ line.speaker }}:</strong>
                      {{ line.greek }}
                    </div>
                    <div v-if="showDialogueTranslation" class="translation-text" >
                      <strong>{{ line.speaker }}:</strong>
                      {{ line.translation }}
                    </div>
                  </div>
                </v-card-text>
              </v-card>
              <v-card v-if="responseOptions.length > 0">
                <v-card-title>Possible Responses</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col v-for="(response, index) in responseOptions" :key="index" cols="12" sm="6">
                      <v-card class="ma-2 response-card" color="#f5f5f5" @click="setDialogue(response); scrollMeTo('dialogue')">
                        <v-card-text>
                          {{ response.greek }}
                          <span v-if="showDialogueTranslation" class="translation-text"> <em><br>{{ response.translation }}</em></span>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card v-if="responseOptions.length === 0">
                <v-card-title>Let's see how you did</v-card-title>
                <v-btn
                    v-if="responseOptions.length === 0 && selectedQuizMode === 'dialogue'"
                    @click="checkDialogueAnswer();"
                    color="primary"
                    class="ma-1"
                    block
                >Check Dialogue Answer</v-btn>
                <v-card-text>
                  You got: {{ dialoguePercentage}}% correctness
                </v-card-text>
              </v-card>
            </v-container>
            <v-container v-if="selectedQuizMode === 'media'">
              <v-row>
                <v-col v-for="item in answers" :key="item.option" cols="6">
                  <v-card
                      flat
                      @click="checkAnswer(item);"
                      :class="{
                                        'card-correct': answerStates[item.option]?.isCorrect,
                                        'card-incorrect': !answerStates[item.option]?.isCorrect && answerStates[item.option]?.selected
                                        }"
                  >
                    <v-img :src="getLocalImagePath(item.imageUrl)" class="mb-2" aspect-ratio="1"></v-img>
                    <v-card-text v-if="showEnglishText" class="text-center">{{ item.option }}</v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
            <!-- Text Buttons for Other Quiz Modes -->
            <div v-if="selectedQuizMode === 'authorbased'">
              <v-row>
                <v-col v-for="item in answers" :key="item.option" cols="12" sm="6">
                  <v-btn
                      @click="checkAnswer(item);"
                      class="ma-1"
                      :class="{ 'answer-correct': answerStates[item.option]?.isCorrect, 'answer-incorrect': !answerStates[item.option]?.isCorrect && answerStates[item.option]?.selected }"
                      :color="answerStates[item.option]?.selected ? (answerStates[item.option]?.isCorrect ? '#1de9b6': '#e9501d') : 'triadic'"
                      block
                  >
                    <span>{{ truncateText(item.option) }}</span>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div>
              <div style="margin: 5em auto;">
                <v-data-table
                    v-if="selectedQuizMode !== quizModes[2].value && selectedQuizMode !== '' && showHistoryIndicator && showAllOptions"
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
          </div>
        </div>
      </v-main>
    </v-app>
  </div>
</template>


<script>
import {SokratesCheckBase, SokratesCheckDialogue, SokratesCreateQuestion, SokratesOptions} from "@/constants/graphql";

export default {
  name: "QuizArea",
  computed: {
    theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
  },
  data() {
    return {
      isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      wronglyPlaced: [],
      dialoguePercentage: 0,
      responseOptions: [],
      dialogueOptions: {},
      dialogueContent: [],
      selectedSpeaker: '',
      dialogueText: [],
      answerStates: {},
      options: [],
      selectedTheme: '',
      isComprehensive: false,
      showEnglishText: false,
      showDialogueTranslation: false,
      showAllOptions: true,
      selectedSet: 1,
      maxSet: 1,
      similarWords: [],
      lastInteractiveWord: "",
      isTextBoxMinimized: false,
      attemptMade: false,
      showNextQuestionIndicator: false,
      showHistoryIndicator: true,
      rhemai: [],
      quizModes: [
          { text: 'Media', value: 'media', icon: 'mdi-image' },
          { text: 'AuthorBased', value: 'authorbased', icon: 'mdi-book-open-page-variant' },
          { text: 'Dialogue', value: 'dialogue', icon: 'mdi-forum' },
    ],
      selectedQuizMode: "",
      headers: [
        { text: 'Greek', value: 'greek', align: 'center' },
        { text: 'Provided Answer', value: 'input', align: 'center' },
      ],
      historyTable: [],
      quizWord: '',
      answers: [],
      correct: false,
      stepper: 1,
      displayInfo: false,
    }
  },
  methods: {
    highlightText(text) {
      const highlighted = text.replace(/&&&(.*?)&&&/g, (match, p1) => {
        return `<span style="font-weight: bold; background-color: yellow; color: black; padding: 0 4px;">${p1}</span>`;
      });
      return highlighted;
    },
    selectQuiz(value) {
      this.selectedSet = 1
      this.selectedTheme = ''
      this.quizWord = ""
      this.options = []
      this.answers = []
      this.similarWords = []
      this.responseOptions = []
      this.dialogueText = []
      this.dialogueContent = []
      this.selectedQuizMode = value;
      this.getOptions(value)

      if (value === this.quizModes[2].value ) {
        this.isComprehensive = false;
      }

      if (value === 'media') {
        this.getQuestion()
        this.scrollMeTo('quiz')
      }
    },
    setSpeaker(value) {
      this.selectedSpeaker = value.shorthand;
      this.initializeDialogue();
    },
    async initializeDialogue() {
      const firstSpeaker = this.dialogueContent[0].speaker;

      // Initialize the initial dialogue
      if (this.selectedSpeaker === firstSpeaker) {
        this.dialogueText = [this.dialogueContent[0], this.dialogueContent[1]];
      } else {
        this.dialogueText = [this.dialogueContent[0]];
      }

      // Prepare response options
      const responses = this.dialogueContent.filter((line) =>
          line.speaker === this.selectedSpeaker && line.place !== 1
      );

      this.responseOptions = await this.createNewArray(responses)
    },
    getLocalImagePath(imageUrl) {
      return require(`@/assets/icons/${this.selectedSet}/${imageUrl}`);
    },
    setDialogue(selectedDialogue) {
      let setTranslationBack = false;
      if (this.showDialogueTranslation) {
        this.showDialogueTranslation = false;
        setTranslationBack = true;
      }

      this.updateResponseOptions(selectedDialogue);

      this.typeDialogue(selectedDialogue, () => {
        const nextIndex = this.dialogueText.length;
        if (nextIndex < this.dialogueContent.length && this.dialogueContent[nextIndex].speaker !== this.selectedSpeaker) {
          setTimeout(() => {
            this.typeDialogue(this.dialogueContent[nextIndex], () => {
              if (setTranslationBack) {
                setTimeout(() => {
                  this.showDialogueTranslation = true;
                }, 500); // Additional 500ms delay
              }

            });
          }, 500); // Delay before typing the next speaker's response
        } else {
          if (setTranslationBack) {
            setTimeout(() => {
              this.showDialogueTranslation = true;
            }, 500); // Additional 500ms delay
          }
        }
      });
    },
    updateResponseOptions(selectedDialogue) {
      this.responseOptions = this.responseOptions.filter(option => option.place !== selectedDialogue.place);
    },
    typeDialogue(line, callback = null) {
      let typedText = '';
      const typingSpeed = 50; // Milliseconds per character
      const newLine = Object.assign({}, line, { greek: '' }); // Create a copy of the line with empty text
      this.dialogueText.push(newLine); // Add the new line with empty text to dialogueText

      for (let i = 0; i < line.greek.length; i++) {
        setTimeout(() => {
          typedText += line.greek[i];
          newLine.greek = typedText; // Update the text of the new line
          if (i === line.greek.length - 1 && callback) {
            callback(); // Call the callback function after the last character is typed
          }
        }, i * typingSpeed);
      }
    },
    async getOptions(value) {
      this.$apollo.query({
        query: SokratesOptions,
        variables: {
          quizType: value,
        },
        fetchPolicy: "no-cache",
      }).then(async (response) => {
        if (value === this.quizModes[0].value) {
          this.maxSet = parseInt(response.data.options.aggregates[0].highestSet);
          this.selectedSet = 1;
          return
        }

        this.options = await response.data.options.aggregates.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      })
    },
    onThemeSelect(item) {
      this.selectedSet = 1;
      this.selectedSpeaker = ''
      this.responseOptions = []
      this.dialogueText = []
      this.dialogueOptions =[]
      this.selectedTheme = item.name
      if (item && item.highestSet) {
        this.maxSet = parseInt(item.highestSet, 10);
        this.selectedSet = 1;
      }

      this.getQuestion()
      this.scrollMeTo('quiz')
    },
    scrollMeTo(refName) {
      this.$nextTick(() => {
        if (this.$refs[refName]) {
          this.$refs[refName].scrollIntoView({ behavior: 'smooth' });
        }
      });
    },
    async getQuestion () {
      this.attemptMade = false;
      this.answerStates = {};
      this.$apollo.query({
          query: SokratesCreateQuestion,
          variables: {
            theme: this.selectedTheme,
            quizType: this.selectedQuizMode,
            set: String(this.selectedSet)
          },
        fetchPolicy: "no-cache",
      }).then(async (response) => {
        if (this.selectedQuizMode !== "dialogue") {
          this.quizWord = response.data.quiz.quizItem;
          let slicedArray = response.data.quiz.options.slice(0, 4)
          this.answers = await this.createNewArray(slicedArray);
        } else {
          this.quizWord = "temp"
          this.dialogueOptions = response.data.quiz.dialogue
          this.dialogueContent = response.data.quiz.content
        }
      })
    },
    checkDialogueAnswer() {
      const dialogueData = this.dialogueText.map(({ __typename, ...rest }, index) => {
        return { ...rest, place: index + 1 };
      });

      this.$apollo.query({
        query: SokratesCheckDialogue,
        variables: {
          theme: this.selectedTheme,
          quizType: this.selectedQuizMode,
          set: String(this.selectedSet),
          dialogue: dialogueData
        },
        fetchPolicy: "no-cache",
      }).then((response) => {
        this.dialoguePercentage = response.data.answer.percentage;
        this.wronglyPlaced = response.data.answer.wronglyPlaced;

        this.wronglyPlaced.forEach(wrongItem => {
          const index = wrongItem.place - 1; // Adjusting for zero-based index
          if (this.dialogueText[index]) {
            this.dialogueText[index].isWronglyPlaced = true;
          }
        });
      })
    },
    checkAnswer(selectedAnswer) {
      this.attemptMade = true;
      this.$apollo.query({
        query: SokratesCheckBase,
        variables: {
          theme: this.selectedTheme,
          quizType: this.selectedQuizMode,
          set: String(this.selectedSet),
          quizWord: this.quizWord,
          answer: selectedAnswer.option,
          comprehensive: this.isComprehensive
        },
        fetchPolicy: "no-cache",
      }).then((response) => {
        this.correct = response.data.answer.correct;
        this.similarWords = response.data.answer.similarWords;
        this.rhemai = response.data.answer.foundInText.rhemai;

        this.$set(this.answerStates, selectedAnswer.option, {
          selected: true,
          isCorrect: this.correct
        });

        if (this.correct) {
          this.showNextQuestionIndicator = true;
          setTimeout(() => {
            this.getNextQuestion();
            this.showNextQuestionIndicator = false;
            this.scrollMeTo('comprehensive')
          }, 2000);
        }

        // Optionally, update states for all other answers if needed
        this.answers.forEach(answer => {
          if (answer.option !== selectedAnswer.option) {
            this.$set(this.answerStates, answer.option, {
              selected: false,
              isCorrect: false
            });
          }
        });


        let color = this.correct ? "#1de9b6" : "#e9501d";

        this.lastInteractiveWord = this.quizWord;
        let lastAnswer = {
          greek: this.quizWord,
          color: color,
          input: selectedAnswer.option,
        };

        this.historyTable.unshift(lastAnswer);
      })
    },
    truncateText(text) {
      const maxLength = 35;
      if (text.length > maxLength) {
        return text.substring(0, 32) + '...';
      }
      return text;
    },
    async createNewArray(shuffeledArray) {
      for (let i = shuffeledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffeledArray[i], shuffeledArray[j]] = [shuffeledArray[j], shuffeledArray[i]];
      }

      return shuffeledArray
    },
    getNextQuestion: function () {
      this.showNextQuestionIndicator = false;
      this.getQuestion()
    },
  },
  watch: {
    selectedSet() {
      this.getNextQuestion()
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

.author-name {
  font-weight: bold;
  font-size: larger;
}

.italic-text {
  font-style: italic;
}

.minimized-text-box {
  /* Define styles for minimized text box */
  max-height: 50em;
  overflow: hidden; /* Hide the overflow content */
}

.answer-correct {
  border: 2px solid #1de9b6;
  animation: running-border 2s infinite;
}

.answer-incorrect {
  border: 2px solid #e9501d;
  animation: running-border-error 2s infinite;
}

.card-correct {
  animation: running-border 1s infinite;
  border: 8px solid transparent;
}

.card-incorrect {
  animation: running-border-error 1s infinite;
  border: 8px solid transparent;
}

@keyframes running-border {
  0% { border-color: #1CBCD1; }
  50% { border-color: #1de9b6; }
  100% { border-color: #1cd18c; }
}

@keyframes running-border-error {
  0% { border-color: #982110; }
  50% { border-color: #ff0000; }
  100% { border-color: #f6624c; }
}

.quiz-word-container {
  text-align: center; /* Center align the quiz word */
  margin: 20px 0; /* Add some spacing */
  padding: 10px;
  border: 1px solid #1c61d1; /* Optional border */
  border-radius: 10px; /* Rounded corners for the border */
  background-color: #1cd18c; /* Light background color */
}

.quiz-word-container h2 {
  font-size: 2em; /* Larger font size */
  font-weight: bold; /* Make it bold */
  color: #333; /* Darker color for emphasis */
}

.quiz-container {
  max-width: 90%; /* Default max-width for smaller screens */
  margin: auto; /* Center the container */
}

/* Media query for screens wider than 820px */
@media (min-width: 900px) {
  .quiz-container {
    max-width: 820px; /* Fixed max-width for larger screens */
  }
}

.dialogue-line {
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dialogue-bubble {
  background-color: #f5f5f5; /* Off-white color */
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  max-width: 80%;
}

.user-speaker .dialogue-bubble {
  margin-left: auto; /* Aligns to the right */
  border-top-right-radius: 0; /* Optional: for speech bubble effect */
}

.other-speaker .dialogue-bubble {
  margin-right: auto; /* Aligns to the left */
  border-top-left-radius: 0; /* Optional: for speech bubble effect */
}

.wrongly-placed .dialogue-bubble {
  background-color: #f6624c; /* Light red background */
}

.translation-text {
  color: #666;
  font-style: italic;
  margin-top: 5px;
}

@keyframes pulse-border {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
}

.pulsate {
  animation: pulse-border 2s infinite;
}

.settings-icon {
  position: fixed; /* or 'absolute' depending on your layout */
  top: 16px; /* Adjust based on your layout */
  right: 16px; /* Adjust based on your layout */
  z-index: 10; /* Ensure it's above other content */
}

</style>
