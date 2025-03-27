<template>
  <div id="quiz">
    <v-app
        id="navbar"
        :style="{background: $vuetify.theme.themes[theme].background}"
    >
      <v-main>
        <div class="text-center">
          <div style="margin-bottom: 2em">
            <v-expansion-panels color="secondary" v-if="showInfoBar">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon left>mdi-information</v-icon>
                  Don't know what to do?
                  <v-spacer></v-spacer>
                  <v-btn
                      icon="mdi-close"
                      variant="text"
                      @click="showInfoBar = !showInfoBar"
                      class="mx-4"
                  >
                  </v-btn>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-stepper
                      :items="['Select Quiz Type', 'Select Theme', 'Select Set', 'Other Options']"
                  >
                    <template v-slot:item.1>
                      <v-card class="mb-12 text-left" color="white">
                        First select the quiz type you want to be play.
                        <br />
                        <br />
                        <ul>
                          <li>
                            <strong>Dialogue:</strong> converse in Ancient Greek
                            with Ancient Greeks! This mode allows you to
                            recreate dialogue taken from great works of
                            literature. You are asked to put the conversation in
                            the right order. For advanced learners of Ancient
                            Greek.
                          </li>
                          <li>
                            <strong>Author:</strong> Learn words and see them
                            placed in an actual Greek sentence. Most suited for
                            those looking to learn words from a specific text or
                            intermediate learners.
                          </li>
                          <li>
                            <strong>Media:</strong> this quiz type has images
                            and (in the future) audio for you to have an
                            interactive experience. Easiest mode to start with.
                          </li>
                          <li>
                            <strong>Mutliple Choice:</strong> multiple choice
                            questions can be done in Dutch or English.
                          </li>
                          <br />
                          <br />
                          <strong
                          >Start with Media if you are new to Ancient
                            Greek</strong
                          >
                        </ul>
                        <br />
                      </v-card>
                    </template>
                    <template v-slot:item.2>
                      <v-card class="mb-12 text-left" color="white">
                        Themes represent a work from antiquity or a category of
                        questions such as Basic or Daily Life.
                        <br />
                        <br />
                        For example: <strong>Aeschylus - Agamemnon</strong> or
                        <strong>Homer - Odyssey</strong>. Dialogue or multiple
                        choice will be taken from these works.
                        <br />
                        <br />
                        <v-icon>mdi-shuffle-variant</v-icon>
                        Selects a random theme if you are unsure what text you
                        want to do (not available in dialogue mode).
                      </v-card>
                    </template>
                    <template v-slot:item.3>
                      <v-card class="mb-12 text-left" color="white">
                        A set is a number of quiz items within a quiz. Each set
                        consists of <strong>20</strong> words that will randomly
                        be presented as a quiz.
                        <br />
                        <br />
                        Some sets might be a bit smaller or larger than 20
                        because the total number of quiz words is larger than x
                        * 20.
                        <br />
                        <v-icon>mdi-skip-next</v-icon>
                        Creates the next quiz if you want to skip a certain
                        word.
                        <br />
                        <br />
                        In author mode, sets are divided by word size and
                        whenever possible into nouns and verbs.
                      </v-card>
                    </template>
                    <template v-slot:item.4>
                      <v-card class="mb-12 text-left" color="white">
                        Additional options to turn on and off when you have
                        selected a mode, theme and if available a set.
                        <br />
                        <br />
                        <ul>
                          <li>
                            <strong>Show Text With Images:</strong> when using
                            media mode, the images can be appended with an
                            English test.
                          </li>
                          <li>
                            <strong>Extended Mode:</strong> available in media,
                            and author-based modes. This will show words that
                            are similar and where in the text you can find a
                            word in all its known declensions.
                            <br />
                            The known declensions are based on words found in
                            the grammar component <a href="/grammar">link</a>.
                          </li>
                          <li>
                            <strong>Show Translation:</strong> adds translations
                            in Dialogue mode.
                          </li>
                          <li>
                            <strong>Show History Table:</strong> in non-dialogue
                            quiz modes, you can see the answers you have given
                            in this history table, making it easier to remember
                            previous entries.
                          </li>
                        </ul>
                      </v-card>
                    </template>
                  </v-stepper>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-container class="quiz-container">
              <!-- Quiz Mode Buttons -->
              <v-card class="mx-auto paper-card" max-width="80em">
                <v-toolbar dense flat color="triadic">
                  <v-toolbar-title>
                    <span class="text-subheading">Options</span>
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn
                      icon="mdi-minus"
                      variant="text"
                      @click="minimized = !minimized"
                  >
                    <v-icon>{{ minimized ? 'mdi-plus' : 'mdi-minus' }}</v-icon>
                  </v-btn>
                  <v-btn
                      icon="mdi-skip-next"
                      variant="text"
                      @click="getNextQuestion"
                      v-if="selectedQuizMode !== '' && selectedQuizMode !== 'dialogue'"
                  ></v-btn>
                  <v-btn
                      icon="mdi-shuffle-variant"
                      variant="text"
                      @click="randomTheme"
                      v-if="selectedQuizMode !== '' && selectedQuizMode !== 'dialogue'"
                  ></v-btn>
                </v-toolbar>
                <v-expand-transition>
                  <div v-if="!minimized" ref="selectThemeRef">
                    <br /><br />

                    <v-card-title class="ma-6"> Choose your Mode </v-card-title>
                    <p class="ma-4">
                      Ἀρχὴ πάσης πράξεως ἐστὶν ἡ τοῦ αἱρεῖσθαι ἀρχή.
                      <v-divider></v-divider>
                      The beginning of every action is the choice.
                    </p>

                    <v-row>
                      <v-col
                          v-for="(quiz, index) in quizModes"
                          :key="index"
                          cols="12"
                          sm="6"
                      >
                        <v-card-subtitle class="ma-6">
                          {{ quiz.header}}
                        </v-card-subtitle>
                        <v-btn
                            class="ma-1 quiz-button"
                            :class="{ 'pulsate': selectedQuizMode === '' }"
                            :color="selectedQuizMode === quiz.value ? 'primary' : 'triadic'"
                            block
                            @click="selectQuiz(quiz.value)"
                        >
                          <v-icon left>{{ quiz.icon }}</v-icon>
                          {{ quiz.text }}
                        </v-btn>
                      </v-col>
                    </v-row>
                    <br /><br />
                    <v-combobox
                        v-if="selectedQuizMode !== ''"
                        class="mt-5"
                        :class="{ 'pulsate': selectedTheme === '' }"
                        v-model="selectedTheme"
                        :items="options"
                        item-title="name"
                        item-value="name"
                        label="Select a Theme"
                        return-object
                        color="primary"
                        @update:modelValue="onThemeSelect"
                    ></v-combobox>
                    <v-card-text v-if="maxSet > 0 && selectedTheme !== ''">
                      <v-row
                          class="mb-4"
                          justify="space-between"
                          v-if="maxSet > 1"
                      >
                        <v-col class="text-left">
                          <span class="subheading font-weight-light me-1"
                          >Set
                          </span>
                          <span
                              class="text-h4 font-weight-light"
                              v-text="selectedSet"
                          ></span>
                          <span class="subheading font-weight-light me-1">
                            of
                          </span>
                          <span
                              class="text-h4 font-weight-light"
                              v-text="maxSet"
                          ></span>
                        </v-col>
                      </v-row>
                      <v-slider
                          v-if="selectedQuizMode !== '' && maxSet > 1"
                          class="my-5"
                          v-model="selectedSet"
                          :max="maxSet"
                          :min="1"
                          step="1"
                          color="primary"
                          track-color="accent"
                          thumb-color="primary"
                      >
                        <template v-slot:prepend>
                          <v-btn
                              icon="mdi-minus"
                              size="small"
                              variant="text"
                              @click="decrementSelectedSet"
                          ></v-btn>
                        </template>

                        <template v-slot:append>
                          <v-btn
                              icon="mdi-plus"
                              size="small"
                              variant="text"
                              @click="incrementSelectedSet"
                          ></v-btn>
                        </template>
                      </v-slider>
                      <v-row v-if="segments.length > 0">
                        <v-col cols="12">
                          <h3>Segments</h3>
                        </v-col>
                        <v-btn
                            v-for="(segment, index) in segments"
                            :key="index"
                            class="quiz-button"
                            :class="{ 'pulsate': selectedSegment === segment.name }"
                            :color="selectedSegment === segment.name ? 'primary' : 'triadic'"
                            @click="onSegmentSelect(segment.name)"
                        >
                          {{segment.name}}
                        </v-btn>
                      </v-row>
                      <br />
                      <br />
                      <v-switch
                          v-if="selectedQuizMode === 'media'"
                          v-model="showEnglishText"
                          color="primary"
                          label="Text with images"
                      ></v-switch>
                      <v-switch
                          v-if="selectedQuizMode === 'media' || selectedQuizMode === 'multiplechoice'"
                          v-model="isComprehensive"
                          color="primary"
                          label="Extended Results"
                      ></v-switch>
                      <v-switch
                          v-if="selectedQuizMode === 'media' || selectedQuizMode === 'multiplechoice' || selectedQuizMode === 'authorbased'"
                          v-model="showHistoryIndicator"
                          color="primary"
                          label="History Table"
                      ></v-switch>
                      <div v-if="selectedQuizMode !== 'dialogue'">
                        <p>Correct answers needed before marked complete</p>
                        <v-slider
                            :label="numberOfAnswersNeeded"
                            class="my-5"
                            v-model="numberOfAnswersNeeded"
                            :min="1"
                            :max="4"
                            step="1"
                            color="primary"
                            track-color="accent"
                            thumb-color="primary"
                            show-ticks
                        ></v-slider>
                        <v-card-subtitle
                        >Seen {{Object.keys(correctAnswersCount).length}} out
                          of {{numberOfItemsInSet}}:</v-card-subtitle
                        >
                        <v-card-subtitle
                        >Completed out of
                          {{numberOfItemsInSet}}:</v-card-subtitle
                        >
                        <v-progress-circular
                            style="margin: 2em"
                            rotate="360"
                            color="primary"
                            width="8"
                            size="72"
                            :model-value="excludedWords.length/numberOfItemsInSet * 100"
                        >
                          {{ Math.round(excludedWords.length/numberOfItemsInSet * 100)
                          }}%
                        </v-progress-circular>
                        <v-divider></v-divider>
                        <v-card-subtitle
                        >Total played:
                          {{numberOfQuestionsPlayed}}</v-card-subtitle
                        >
                        <v-progress-circular
                            style="margin: 2em"
                            rotate="360"
                            :color="progressColor"
                            width="8"
                            size="72"
                            :model-value="currentCorrectness"
                        >
                          {{ currentCorrectness }}%
                        </v-progress-circular>
                      </div>
                    </v-card-text>
                  </div>
                </v-expand-transition>
              </v-card>
            </v-container>
            <div
                ref="quizContainerRef"
                v-if="selectedTheme !== ''"
                class="quiz-container"
            >
              <v-container
                  v-if="quizWord && excludedWords.length !== numberOfItemsInSet"
                  class="quiz-container"
              >
                <v-card class="quiz-word-container">
                  <h2 class="quiz-word" v-if="!showNextQuestionIndicator">
                    {{ quizWord }}
                  </h2>
                  <div
                      v-if="showNextQuestionIndicator"
                      class="text-center mb-4"
                  >
                    <v-progress-circular
                        style="margin-bottom: 2em; margin-top: 2em"
                        indeterminate
                        color="primary"
                        width="8"
                        size="72"
                    ></v-progress-circular>
                  </div>
                  <p
                      class="quiz-instructions"
                      v-if="selectedQuizMode === 'media'"
                  >
                    Match the word to the image.
                  </p>
                  <p
                      class="quiz-instructions"
                      v-else-if="selectedQuizMode === 'multiplechoice'"
                  >
                    Select the correct meaning.
                  </p>
                  <p
                      class="quiz-instructions"
                      v-else-if="allAuthorWordsCorrect"
                  >
                    Select a different set or theme for the next sentence. Or
                    check out this text in it's fuller context.
                    <v-divider></v-divider>
                    <v-btn
                        class="ma-5"
                        color="primary"
                        @click="goToTextEntry()"
                    >
                      Text
                      <v-icon end> mdi-book-open-variant </v-icon>
                    </v-btn>
                  </p>
                  <p
                      class="quiz-instructions"
                      v-else-if="selectedQuizMode === 'authorbased' && !allAuthorWordsCorrect && !grammarQuizMode"
                  >
                    Select the correct meaning.
                  </p>
                  <p
                      class="quiz-instructions"
                      v-else-if="selectedQuizMode === 'authorbased' && !allAuthorWordsCorrect && grammarQuizMode"
                  >
                    Select the correct grammatical form.
                  </p>
                </v-card>
              </v-container>
              <v-card
                  class="mx-auto paper-card"
                  v-if="selectedQuizMode === 'authorbased'"
              >
                <v-card-text>
                  <v-card-title
                  >Text Result for
                    {{ extendedResultsAuthor.quizWord }}</v-card-title
                  >
                  <v-card-subtitle
                  >Translation:
                    <strong
                    >{{ extendedResultsAuthor.answer }}</strong
                    ></v-card-subtitle
                  >
                  <v-card-subtitle
                  >Word as it appears in the text:</v-card-subtitle
                  >
                  <li
                      v-for="(word, index) in extendedResultsAuthor.wordsInText"
                      :key="index"
                  >
                    <strong>{{ word }}</strong>
                  </li>
                  <br
                      v-if="grammarQuizMode && grammarQuizzes[currentGrammarIndex].extraInformation"
                  />
                  <v-card-subtitle
                      v-if="grammarQuizMode && grammarQuizzes[currentGrammarIndex].extraInformation"
                  >Extra Information for Grammar Question:
                    <strong
                    >{{grammarQuizzes[currentGrammarIndex].extraInformation}}</strong
                    ></v-card-subtitle
                  >
                </v-card-text>
              </v-card>
              <br />
              <Dialogue
                  v-if="selectedQuizMode === 'dialogue'"
                  :dialogueOptions="dialogueOptions"
                  :dialogueContent="dialogueContent"
                  :selectedQuizMode="selectedQuizMode"
                  :selectedTheme="selectedTheme"
                  :selectedSet="selectedSet"
              />
              <v-container
                  v-if="selectedQuizMode === 'media'"
                  class="inner-quiz-area"
              >
                <!-- Show "Well Done!" message and randomize button if the quiz is completed -->
                <v-container
                    v-if="excludedWords.length === numberOfItemsInSet"
                >
                  <v-card flat class="mb-3 paper-card">
                    <v-card-text>
                      <h3>🎉 Well Done! You have finished this section! 🎉</h3>
                      <p>
                        Select a new quiz by going up or click the randomize button
                      </p>
                    </v-card-text>
                    <!-- Arrow up button -->
                    <v-btn
                        icon="mdi-arrow-up"
                        variant="text"
                        @click="scrollMeTo('selectTheme')"
                    >
                    </v-btn>
                    <!-- Randomize button -->
                    <v-btn
                        icon="mdi-shuffle-variant"
                        variant="text"
                        @click="randomTheme"
                    ></v-btn>
                  </v-card>
                </v-container>

                <!-- Quiz area -->
                <v-container v-else>
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
                        <v-img
                            :src="loadedImages[item.imageUrl] || ''"
                            class="mb-2"
                            aspect-ratio="1"
                        ></v-img>
                        <v-card-text v-if="showEnglishText" class="text-center">
                          {{ item.option }}
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-container>

              <!-- Text Buttons for Multiple Choice Quiz -->
              <div v-if="selectedQuizMode === 'multiplechoice'">
                <!-- Show "Well Done!" message and randomize button if the quiz is completed -->
                <v-container
                    v-if="excludedWords.length === numberOfItemsInSet"
                >
                  <v-card flat class="mb-3 paper-card">
                    <v-card-text>
                      <h3>🎉 Well Done! You have finished this section! 🎉</h3>
                      <p>
                        Select a new quiz by going up or click the randomize button
                      </p>
                    </v-card-text>
                    <!-- Arrow up button -->
                    <v-btn
                        icon="mdi-arrow-up"
                        variant="text"
                        @click="scrollMeTo('selectTheme')"
                    >
                    </v-btn>
                    <!-- Randomize button -->
                    <v-btn
                        icon="mdi-shuffle-variant"
                        variant="text"
                        @click="randomTheme"
                    ></v-btn>
                  </v-card>
                </v-container>


                <!-- Multiple Choice Quiz Area -->
                <v-container v-else>
                  <v-row>
                    <v-col
                        v-for="item in answers"
                        :key="item.option"
                        cols="12"
                        sm="6"
                    >
                      <v-btn
                          @click="checkAnswer(item);"
                          class="ma-1"
                          :class="{
            'answer-correct': answerStates[item.option]?.isCorrect,
            'answer-incorrect': !answerStates[item.option]?.isCorrect && answerStates[item.option]?.selected
          }"
                          :color="answerStates[item.option]?.selected
            ? answerStates[item.option]?.isCorrect
              ? '#1de9b6'
              : '#e9501d'
            : 'triadic'"
                          block
                      >
                        <span>{{ truncateText(item.option) }}</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </div>

              <div v-if="selectedQuizMode === 'authorbased'">
                <GrammarDetails
                    :clickedWord="clickedWord"
                    :forceUpdate="forceUpdate"
                />

                <v-row v-if="!allAuthorWordsCorrect && grammarQuizMode">
                  <v-col
                      v-for="item in grammarQuizzes[currentGrammarIndex].options"
                      :key="item.option"
                      cols="12"
                      sm="6"
                  >
                    <v-btn
                        @click="checkGrammarAnswer(item);"
                        class="ma-1"
                        :class="{ 'answer-correct': answerStates[item.option]?.isCorrect, 'answer-incorrect': !answerStates[item.option]?.isCorrect && answerStates[item.option]?.selected }"
                        :color="answerStates[item.option]?.selected ? (answerStates[item.option]?.isCorrect ? '#1de9b6': '#e9501d') : 'triadic'"
                        block
                    >
                      <span>{{ truncateText(item.option) }}</span>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row v-if="!allAuthorWordsCorrect && !grammarQuizMode">
                  <v-col
                      v-for="item in answers"
                      :key="item.option"
                      cols="12"
                      sm="6"
                  >
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
                <v-card class="paper-card ma-3">
                  <v-card-title
                      v-if="!allAuthorWordsCorrect"
                      class="text-wrap white-space-normal break-words"
                  >
                    Reveal words by answering correctly. Click the word for a
                    declension attempt after 2 correct answers!
                  </v-card-title>
                  <h2>
                    <span
                        v-for="(word, index) in splitAuthorSentence"
                        :key="index"
                        @click="wordOpacity(word) > 50 && setClickedWord(word)"
                        :style="{ opacity: wordOpacity(word) + '%', cursor: wordOpacity(word) > 50 ? 'pointer' : 'default' }"
                    >
                      {{ word }}
                    </span>
                  </h2>
                  <v-divider v-if="allAuthorWordsCorrect"></v-divider>
                  <h3 v-if="allAuthorWordsCorrect">
                    {{ authorSpecificContent.translation }}
                  </h3>
                </v-card>
              </div>
              <AnalyzeResults
                  v-if="isComprehensive"
                  :analyzeResults="analyzeResults"
              />
              <div style="margin: 5em auto">
                <v-data-table
                    v-if="selectedQuizMode !== 'dialogue' && selectedQuizMode !== '' && showHistoryIndicator && selectedTheme !== ''"
                    :disable-sort="true"
                    :headers="headers"
                    :items="historyTable"
                    :items-per-page="5"
                    class="elevation-1"
                >
                  <template v-slot:item.input="{ item }">
                    <v-chip :color="item.color">{{ item.input }}</v-chip>
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
import {ref, reactive, watch, nextTick, onMounted, getCurrentInstance, watchEffect, computed} from 'vue';
import { useQuery } from '@vue/apollo-composable';
import {apolloClient} from "@/apollo";
import { SokratesCheckBase, SokratesCreateQuestion, SokratesOptions } from "@/constants/graphql";
import AnalyzeResults from "@/components/AnalyzeResults.vue";
import Dialogue from "@/components/Dialogue.vue";
import GrammarDetails from "@/components/GrammarDetails.vue";

export default {
  name: 'QuizArea',
  components: {
    AnalyzeResults,
    Dialogue,
    GrammarDetails,
  },

  setup() {
    const { proxy } = getCurrentInstance();
    const minimized = ref(false);
    const theme = ref('light');
    const selectedQuizMode = ref('');
    const selectedTheme = ref('');
    const selectedSet = ref(1);
    const maxSet = ref(1);
    const isComprehensive = ref(false);
    const showEnglishText = ref(false);
    const stepper = ref(1);
    const quizWord = ref('');
    const answers = ref([]);
    const responseOptions = ref([]);
    const dialogueOptions = ref({});
    const authorSpecificContent = ref({});
    const lastInteractiveWord = ref("");
    const isTextBoxMinimized = ref(false);
    const showNextQuestionIndicator = ref(false);
    const showHistoryIndicator = ref(true);
    const rhemai = ref([]);
    const historyTable = ref([]);
    const wordOpacities = ref({});
    const allAuthorWordsCorrect = ref(false);
    const excludedWords = ref([]);
    const options = ref([]);
    const segments = ref([]);
    const correct = ref(false);
    const latestIndex = ref(0);
    const attemptMade = ref(false);
    const dialogueContent = ref({});
    const answerStates = reactive({});
    const analyzeResults = ref([]);
    const lastPlayedWords = ref([]);
    const quizModes = [
      { text: 'Media', value: 'media', icon: 'mdi-image' , header: 'Foundational'},
      { text: 'Multiple Choice', value: 'multiplechoice', icon: 'mdi-order-bool-ascending-variant', header: 'Novice'},
      { text: 'Author Based', value: 'authorbased', icon: 'mdi-book-open-page-variant', header: 'Intermediate'},
      { text: 'Dialogue', value: 'dialogue', icon: 'mdi-forum', header: 'Advanced'},
    ];
    const headers = [
      { text: 'Greek', value: 'greek', align: 'center' },
      { text: 'Provided Answer', value: 'input', align: 'center' },
    ];
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const quizContainerRef = ref();
    const selectThemeRef = ref();
    const loadedImages = reactive({});
    const images = import.meta.glob('../assets/icons/*.webp');
    const showInfoBar = ref(true);
    const splitAuthorSentence = ref([]);
    const numberOfItemsInSet = ref(0);
    const currentCorrectness = ref(100);
    const correctAnswersCount = ref({});
    const numberOfQuestionsPlayed = ref(0);
    const numberOfAnswersNeeded = ref(3);
    const correctlyPlayed = ref(0);
    const selectedSegment = ref('');
    const extendedResultsAuthor = ref({})
    const grammarQuizzes = ref ([])
    const grammarQuizMode = ref(false)
    const currentGrammarIndex = ref(0)


    const green = [29, 233, 182]; // RGB for green
    const orange = [255, 165, 0]; // RGB for orange
    const red = [233, 29, 29]; // RGB for red

    const clickedWord = ref('');
    const forceUpdate = ref(0);

    const progressColor = computed(() => {
      // Interpolate between green and orange, then orange and red
      let r, g, b;
      if (currentCorrectness.value > 50) {
        const ratio = (currentCorrectness.value - 50) / 50;
        r = Math.round(orange[0] * (1 - ratio) + green[0] * ratio);
        g = Math.round(orange[1] * (1 - ratio) + green[1] * ratio);
        b = Math.round(orange[2] * (1 - ratio) + green[2] * ratio);
      } else {
        const ratio = currentCorrectness.value / 50;
        r = Math.round(red[0] * (1 - ratio) + orange[0] * ratio);
        g = Math.round(red[1] * (1 - ratio) + orange[1] * ratio);
        b = Math.round(red[2] * (1 - ratio) + orange[2] * ratio);
      }

      return `rgb(${r}, ${g}, ${b})`;
    });

    const wordOpacity = (word) => {
      return wordOpacities.value[word] || 3;
    };

    const getImageUrl = async (imageName) => {
      const imagePath = `../assets/icons/${imageName}`;
      if (images[imagePath]) {
        const image = await images[imagePath]();
        return image.default;
      }
      return '';
    };

    const randomTheme = () => {
      let randomTheme = options.value[Math.floor(Math.random() * options.value.length)];
      onThemeSelect(randomTheme)
    };
    const decrementSelectedSet = () => {
      if (selectedSet.value > 1) {
        selectedSet.value--;
      }
    };
    const incrementSelectedSet = () => {
      if (selectedSet.value < maxSet.value) {
        selectedSet.value++;
      }
    };

    const goToTextEntry = () => {
      window.open(authorSpecificContent.value.reference, '_blank');
    }


    const highlightText = (text) => {
      return text.replace(/&&&(.*?)&&&/g, (match, p1) => {
        return `<span style="font-weight: bold; background-color: yellow; color: black; padding: 0 4px;">${p1}</span>`;
      });
    };

    const scrollMeTo = (refName) => {
      nextTick(() => {
        if (refName === 'quiz' && quizContainerRef.value) {
          quizContainerRef.value.scrollIntoView({ behavior: 'smooth' });
        }

        if (refName === 'selectTheme' && selectThemeRef.value) {
          selectThemeRef.value.scrollIntoView({ behavior: 'smooth' });
        }
      });
    };

    const resetFields = () => {
      excludedWords.value = [];
      lastPlayedWords.value = [];
      quizWord.value = '';
      answers.value = [];
      responseOptions.value = [];
      splitAuthorSentence.value = [];
      wordOpacities.value = {};
      correctAnswersCount.value = {};
      grammarQuizzes.value = [];
    }

    const extendedSearch = (result, answer) => {
      extendedResultsAuthor.value.answer = answer;
      extendedResultsAuthor.value.wordsInText = result.wordsInText
      extendedResultsAuthor.value.quizWord = result.quizWord
    }

    const selectQuiz = (value) => {
      selectedTheme.value = '';
      selectedQuizMode.value = value;
      resetFields();
      getOptions(value);
      selectedSet.value = 1;

      if (value === 'media' || value === 'multiplechoice') {
        isComprehensive.value = false;
      }

      updateUrl({
        quizmode: selectedQuizMode.value,
      });
    };

    const onSegmentSelect = (item) => {
      resetFields()
      selectedSegment.value = item
      getQuestion();
    };

    const onThemeSelect = (item) => {
      resetFields();

      selectedTheme.value = item.name;

      if (item && item.segments.length === 1 && item.segments[0].maxSet === 1) {
        segments.value = item.segments;
        selectedSegment.value = item.segments[0].name;
        maxSet.value = 1;
      }

      if (item && item.segments.length === 1 && item.segments[0].maxSet > 1) {
        segments.value = []
        selectedSegment.value = ""
        maxSet.value = item.segments[0].maxSet;
        selectedSet.value = Math.floor(Math.random() * maxSet.value) + 1;
      }

      if (item && item.segments.length > 1) {
        // Create a shallow copy of the segments array to avoid mutating the original array
        const sortedSegments = [...item.segments].sort((a, b) => {
          const hasDotA = a.name.includes('.');
          const hasDotB = b.name.includes('.');

          if (hasDotA && hasDotB) {
            const parseSegmentName = (name) => {
              return name.split('.').map(num => parseInt(num, 10));
            };

            const aParts = parseSegmentName(a.name);
            const bParts = parseSegmentName(b.name);

            // Compare each part of the segment names
            for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
              const aVal = aParts[i] || 0;  // If a part is missing, treat it as 0
              const bVal = bParts[i] || 0;
              if (aVal < bVal) return -1;
              if (aVal > bVal) return 1;
            }

            return 0;  // If all parts are equal
          } else if (hasDotA) {
            return -1;  // If only a has a dot, a comes first
          } else if (hasDotB) {
            return 1;   // If only b has a dot, b comes first
          } else {
            return a.name.localeCompare(b.name); // Lexicographical sort if no dots
          }
        });

        // Assign the sorted copy back to the segments.value
        segments.value = sortedSegments;
        selectedSegment.value = sortedSegments[Math.floor(Math.random() * sortedSegments.length)].name;
        maxSet.value = 1;
      }


      getQuestion();
      scrollMeTo('quiz');
      updateUrl({
        quizmode: selectedQuizMode.value,
        theme: selectedTheme.value
      });
    };

    const getOptions = async (value) => {
      options.value = [];

      const { result, refetch } = useQuery(SokratesOptions, {
        quizType: value,
        fetchPolicy: 'cache-and-network',
      });

      watch(result, (newResult) => {
        if (newResult && newResult.options) {
          const sortedOptions = [...newResult.options.themes].sort((a, b) => a.name.localeCompare(b.name));
          options.value = sortedOptions;
        }
      }, { immediate: true });

      await refetch();
    };

    watch(selectedQuizMode, async (newMode) => {
      if (newMode) {
        await getOptions(newMode);
      }
    });

    const processResult = (newResult) => {
      if (selectedQuizMode.value === 'media' || selectedQuizMode.value === 'multiplechoice') {
        quizWord.value = newResult.quiz.quizItem;
        numberOfItemsInSet.value = newResult.quiz.numberOfItems
        const slicedArray = newResult.quiz.options.slice(0, 4);
        createNewArray(slicedArray).then(array => {
          answers.value = array;
        });
      } else if (selectedQuizMode.value === 'authorbased') {
        authorSpecificContent.value = newResult.quiz;
        numberOfItemsInSet.value = newResult.quiz.quiz.numberOfItems
        if (splitAuthorSentence.value.length === 0) {
          allAuthorWordsCorrect.value = false;
          wordOpacities.value = {};
          excludedWords.value = [];
          lastPlayedWords.value = [];
          splitAuthorSentence.value = newResult.quiz.fullSentence.split(/(\s+|[.,;:!?·])/).filter(Boolean);
        }
        const slicedArray = newResult.quiz.quiz.options.slice(0, 4);
        createNewArray(slicedArray).then(array => {
          answers.value = array;
        });
        quizWord.value = newResult.quiz.quiz.quizItem;
        if (newResult.quiz.grammarQuiz.length > 0) {
          grammarQuizzes.value = newResult.quiz.grammarQuiz
        } else {
          grammarQuizzes.value = []
        }
      } else {
        quizWord.value = null;
        dialogueOptions.value = newResult.quiz.dialogue;
        dialogueContent.value = newResult.quiz.content;
      }
    };

    const checkGrammarAnswer = async (answer) => {
      numberOfQuestionsPlayed.value++
      if (answer.option === grammarQuizzes.value[currentGrammarIndex.value].correctAnswer) {
        answerStates[answer.option] = {
          selected: true,
          isCorrect: true,
        };
        correctlyPlayed.value++
        showNextQuestionIndicator.value = true
        setTimeout(() => {
          if (grammarQuizzes.value.length > currentGrammarIndex.value+1) {
            currentGrammarIndex.value++
            quizWord.value = grammarQuizzes.value[currentGrammarIndex.value].wordInText;
            showNextQuestionIndicator.value = false
            answerStates[answer.option] = {
              selected: false,
              isCorrect: true,
            };
          } else {
            showNextQuestionIndicator.value = false
            grammarQuizMode.value = false
            grammarQuizzes.value = [];
            currentGrammarIndex.value = 0;
            answerStates[answer.option] = {
              selected: false,
              isCorrect: true,
            };
            getQuestion()
          }
        }, 1250);
      } else {
        answerStates[answer.option] = {
          selected: true,
          isCorrect: false,
        };
        setTimeout(() => {
          answerStates[answer.option] = {
            selected: false,
            isCorrect: false,
          };
        }, 800)
      }

      currentCorrectness.value = Math.round(correctlyPlayed.value/numberOfQuestionsPlayed.value*100);
    }

    const getQuestion = async () => {
      attemptMade.value = false;
      Object.keys(answerStates).forEach(key => delete answerStates[key]);
      if (!selectedTheme.value) {
        return;
      }

      let uniqueArrayOfExcludes = [...new Set([...excludedWords.value, ...lastPlayedWords.value])];

      const { data } = await apolloClient.query({
        query: SokratesCreateQuestion,
        variables: {
          theme: selectedTheme.value,
          quizType: selectedQuizMode.value,
          set: String(selectedSet.value),
          segment: selectedSegment.value,
          excludeWords: uniqueArrayOfExcludes,
        },
        fetchPolicy: 'no-cache',
      });

      processResult(data);
    };

    const checkAnswer = async (selectedAnswer) => {
      if (showNextQuestionIndicator.value) {
        return
      }

      attemptMade.value = true;
      let resultProcessed = false;

      const { result, refetch } = useQuery(SokratesCheckBase, {
        theme: selectedTheme.value,
        quizType: selectedQuizMode.value,
        set: String(selectedSet.value),
        quizWord: quizWord.value,
        segment: selectedSegment.value,
        answer: selectedAnswer.option,
        comprehensive: isComprehensive.value,
        fetchPolicy: 'no-cache',
      });

      const processResult = async (newResult) => {
        if (newResult) {
          numberOfQuestionsPlayed.value++
          if (excludedWords.value.length < numberOfItemsInSet.value - 5 && newResult.answer.correct) {
            lastPlayedWords.value.push(newResult.answer.quizWord);
            if (lastPlayedWords.value.length > numberOfItemsInSet.value/2) {
              lastPlayedWords.value.shift();
            }
          } else if (newResult.answer.correct) {
            lastPlayedWords.value = [];
          }

          correct.value = newResult.answer.correct;
          if (correct.value) {
            correctlyPlayed.value++
          }

          currentCorrectness.value = Math.round(correctlyPlayed.value/numberOfQuestionsPlayed.value*100);

          answerStates[selectedAnswer.option] = {
            selected: true,
            isCorrect: newResult.answer.correct,
          };

          if (newResult.answer.__typename === 'AuthorBasedAnswer') {
            // Handle special case for AuthorBasedAnswer
            if (correct.value) {
              if (!correctAnswersCount.value[newResult.answer.quizWord]) {
                correctAnswersCount.value[newResult.answer.quizWord] = 0;
              }
              correctAnswersCount.value[newResult.answer.quizWord] += 1;

              extendedSearch(newResult.answer, selectedAnswer.option);
              newResult.answer.wordsInText.forEach(word => {
                if (!wordOpacities.value[word]) {
                  wordOpacities.value[word] = numberOfAnswersNeeded.value;
                }
                // Calculate and round the increment to the nearest number
                const increment = Math.round(100 / numberOfAnswersNeeded.value);
                wordOpacities.value[word] += increment;
                if (wordOpacities.value[word] >= 100) {
                  wordOpacities.value[word] = 100;
                  if (!excludedWords.value.includes(newResult.answer.quizWord)) {
                    excludedWords.value.push(newResult.answer.quizWord);
                  }
                }
              });
            }

            if (excludedWords.value.length === numberOfItemsInSet.value) {
              allAuthorWordsCorrect.value = true
              return
            }

            let lowestOpacity = 3;
            for (const word of Object.keys(wordOpacities.value)) {
              const opacity = wordOpacities.value[word];
              if (opacity > lowestOpacity) {
                lowestOpacity = opacity;
              }
            }

            // Set the punctuation opacity to the lowest found opacity
            splitAuthorSentence.value.forEach((part) => {
              if (/^[.,;:!?·]$/.test(part)) {
                wordOpacities.value[part] = lowestOpacity;
              }
            });



            showNextQuestionIndicator.value = true;

            if (grammarQuizzes.value.length > 0 && correct.value) {
              setTimeout(() => {
                grammarQuizMode.value = true
                quizWord.value = grammarQuizzes.value[currentGrammarIndex.value].wordInText;
                showNextQuestionIndicator.value = false;
              }, 1250);

              return
            }

            setTimeout(() => {
              getQuestion()
              showNextQuestionIndicator.value = false;
            }, 1250);

            const color = correct.value ? '#1cd18c' : '#e9501d';
            lastInteractiveWord.value = quizWord.value;
            const lastAnswer = {
              greek: quizWord.value,
              color: color,
              input: selectedAnswer.option,
            };

            historyTable.value.unshift(lastAnswer);
          } else {
            if (correct.value) {
              if (!correctAnswersCount.value[newResult.answer.quizWord]) {
                correctAnswersCount.value[newResult.answer.quizWord] = 0;
              }
              correctAnswersCount.value[newResult.answer.quizWord] += 1;

              if (correctAnswersCount.value[newResult.answer.quizWord] >= numberOfAnswersNeeded.value) {
                if (!excludedWords.value.includes(newResult.answer.quizWord)) {
                  excludedWords.value.push(newResult.answer.quizWord);
                }
              }
            }

            if (isComprehensive.value && correct.value) {
              analyzeResults.value = [{
                rootword: newResult.answer.foundInText.rootword,
                conjugations: newResult.answer.foundInText.conjugations,
                similarWords: newResult.answer.similarWords,
                results: newResult.answer.foundInText.results.map((result) => ({
                  author: result.author,
                  book: result.book,
                  text: result.text,
                  reference: result.reference,
                  referenceLink: result.referenceLink,
                })),
              }];

              if (analyzeResults.value[0].rootword === "") {
                analyzeResults.value[0].rootword = quizWord.value;
              }
            }

            if (correct.value) {
              showNextQuestionIndicator.value = true;
              setTimeout(() => {
                getQuestion()
                showNextQuestionIndicator.value = false;
              }, 2000);
            }

            answers.value.forEach((answer) => {
              if (answer.option !== selectedAnswer.option) {
                answerStates[answer.option] = {
                  selected: false,
                  isCorrect: false,
                };
              }
            });

            const color = correct.value ? '#1cd18c' : '#e9501d';
            lastInteractiveWord.value = quizWord.value;
            const lastAnswer = {
              greek: quizWord.value,
              color: color,
              input: selectedAnswer.option,
            };

            historyTable.value.unshift(lastAnswer);
          }
        }
      };

      watch(result, async (newResult) => {
        if (!resultProcessed && newResult) {
          resultProcessed = true;
          await processResult(newResult);
        }
      }, { immediate: true });

      await refetch();
    };


    const truncateText = (text) => {
      const maxLength = 35;
      if (text.length > maxLength) {
        return text.substring(0, 32) + '...';
      }
      return text;
    };

    const createNewArray = async (shuffledArray) => {
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }

      return shuffledArray;
    };

    const getNextQuestion = () => {
      excludedWords.value = [];
      lastPlayedWords.value = [];
      splitAuthorSentence.value = [];
      wordOpacities.value = {};

      showNextQuestionIndicator.value = false;
      getQuestion();
    };

    const setClickedWord = (word) => {
      clickedWord.value = word;
      forceUpdate.value++
    };

    const updateUrl = (query) => {
      const currentQuery = proxy.$route.query;
      const newQuery = { ...currentQuery, ...query };
      const queryChanged = Object.keys(newQuery).some(key => currentQuery[key] !== newQuery[key]);

      if (!query.theme) {
        delete newQuery.theme;
      }

      if (queryChanged) {
        proxy.$router.replace({ name: 'Sokrates', query: newQuery });
      }
    };

    const initializeFromURL = async () => {
      const { quizmode, theme } = proxy.$route.query;
      if (quizmode) {
        selectedQuizMode.value = quizmode;
        await getOptions(quizmode);
      }
      if (theme) {
        options.value.forEach((option) => {
          if (option.name === theme) {
            onThemeSelect(option)
          }
        });
      }
      if (quizmode && theme ) {
        await getQuestion();
        scrollMeTo('quiz');
      }
    };

    onMounted(() => {
      initializeFromURL();
    });

    watch(selectedSet, () => {
      if (selectedTheme.value) {
        if (selectedQuizMode.value === 'authorbased') {
          splitAuthorSentence.value = [];
          correctAnswersCount.value = {};
        }
        getNextQuestion();
      }
    });

    // Watch for changes in answers and load corresponding images
    watch(answers, async (newAnswers) => {
      for (const item of newAnswers) {
        if (item.imageUrl && !loadedImages[item.imageUrl]) {
          loadedImages[item.imageUrl] = await getImageUrl(item.imageUrl);
        }
      }
    }, { immediate: true });

    return {
      theme,
      minimized,
      selectedQuizMode,
      selectedTheme,
      selectedSet,
      maxSet,
      isComprehensive,
      showEnglishText,
      stepper,
      quizWord,
      answers,
      responseOptions,
      dialogueOptions,
      lastInteractiveWord,
      isTextBoxMinimized,
      showNextQuestionIndicator,
      showHistoryIndicator,
      rhemai,
      historyTable,
      options,
      correct,
      latestIndex,
      attemptMade,
      answerStates,
      quizModes,
      headers,
      isTouchDevice,
      quizContainerRef,
      selectThemeRef,
      analyzeResults,
      dialogueContent,
      loadedImages,
      images,
      showInfoBar,
      authorSpecificContent,
      allAuthorWordsCorrect,
      excludedWords,
      splitAuthorSentence,
      wordOpacities,
      lastPlayedWords,
      numberOfItemsInSet,
      currentCorrectness,
      correctAnswersCount,
      numberOfQuestionsPlayed,
      progressColor,
      clickedWord,
      forceUpdate,
      segments,
      selectedSegment,
      extendedResultsAuthor,
      grammarQuizzes,
      grammarQuizMode,
      currentGrammarIndex,
      numberOfAnswersNeeded,
      onSegmentSelect,
      resetFields,
      wordOpacity,
      getImageUrl,
      highlightText,
      scrollMeTo,
      selectQuiz,
      getOptions,
      onThemeSelect,
      getQuestion,
      checkAnswer,
      truncateText,
      createNewArray,
      getNextQuestion,
      decrementSelectedSet,
      incrementSelectedSet,
      randomTheme,
      goToTextEntry,
      setClickedWord,
      extendedSearch,
      checkGrammarAnswer,
    };
  },
};
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

.paper-card {
  background: #fefcf5; /* A light, papyrus-like color */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  font-family: "Roboto", serif;
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
  0% {
    border-color: #1cbcd1;
  }
  50% {
    border-color: #1de9b6;
  }
  100% {
    border-color: #1cd18c;
  }
}

@keyframes running-border-error {
  0% {
    border-color: #982110;
  }
  50% {
    border-color: #ff0000;
  }
  100% {
    border-color: #f6624c;
  }
}

.quiz-word-container {
  border: 2px solid #1c61d1; /* Optional border */
  border-radius: 10px; /* Rounded corners for the border */
  background-color: #1cd18c; /* Light background color */
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out; /* Smooth transition */
  cursor: pointer; /* Pointer cursor on hover */
}

.quiz-word-container h2 {
  font-size: 2em; /* Larger font size */
  font-weight: bold; /* Make it bold */
  color: #333; /* Darker color for emphasis */
}

.quiz-word-container:hover {
  transform: scale(1.05); /* Slightly enlarge on hover */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Add a shadow on hover */
}

.quiz-word {
  font-size: 2em; /* Larger font size */
  font-weight: bold; /* Make it bold */
  color: #333; /* Darker color for emphasis */
  animation: fadeIn 1s ease-in; /* Fade-in animation */
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
  .inner-quiz-area {
    max-width: 600px;
  }

  .quiz-word-container {
    margin-right: 5em;
    margin-left: 5em;
  }
}

.quiz-instructions {
  font-size: 1.2em;
  color: #555;
  margin-top: 10px;
  animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

.quiz-button {
  margin: 1em;
}
</style>
