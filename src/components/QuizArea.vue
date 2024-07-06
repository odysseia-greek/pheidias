<template>
  <div id="quiz">
    <v-app
        id="navbar"
        :style="{background: $vuetify.theme.themes[theme].background}"
    >
      <v-main>
        <div class="text-center">
          <div style="margin-bottom:2em;">
            <v-stepper v-if="displayInfo" :items="['Select Quiz Type', 'Select Theme', 'Select Set', 'Other Options']">
              <template v-slot:item.1>
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
                    <br>
                    <br>
                    <li>
                      <v-icon>mdi-information</v-icon> Press the button for more information again to close this window.
                    </li>
                  </ul>
                  <br>
                </v-card>
              </template>
              <template v-slot:item.2>
                <v-card class="mb-12 text-left" color="white">
                  Themes represent a work from antiquity or a category of questions such as Basic or Daily Life.
                  <br>
                  <br>
                  For example: <strong>Aeschylus - Agamemnon</strong> or <strong>Homer - Odyssey</strong>. Dialogue or multiple choice will be taken from these works.
                  <br>
                  <br>
                  Since the quiz words are the words that appear the most in certain texts, there will always be quite some overlap between the different themes.
                </v-card>
              </template>
              <template v-slot:item.3>
                <v-card class="mb-12 text-left" color="white">
                  A set is a number of quiz items within a quiz. Each set consists of <strong>20</strong> words that will randomly be presented as a quiz.
                  <br>
                  <br>
                  Some sets might be a bit smaller or larger than 20 because the total number of quiz words is larger than x * 20.
                  <br>
                  <v-icon>mdi-shuffle-variant</v-icon>
                  Selects a random set when the number of sets is greater than 1.
                  <br>
                  <v-icon>mdi-skip-next</v-icon>
                  Creates the next quiz if you want to skip a certain word.
                  <br>
                  <br>
                  In author mode, sets are divided by word size and whenever possible into nouns and verbs.
                </v-card>
              </template>
              <template v-slot:item.4>
                <v-card class="mb-12 text-left" color="white">
                  Additional options to turn on and off by pressing the cogwheel on the right
                  <v-icon>mdi-cog</v-icon>
                  which will appear after selecting a Quiz Mode.
                  <br>
                  <br>
                  <ul>
                    <li>
                      <strong>Show Text With Images:</strong> when using media mode, the images can be appended with an English test.
                    </li>
                    <li>
                      <strong>Extended Mode:</strong> available in media, and author-based modes. This will show words that are similar and where in the text you can find a word in all its known declensions.
                      <br>
                      The known declensions are based on words found in the grammar component <a href="/grammar">link</a>.
                    </li>
                    <li>
                      <strong>Show Translation:</strong> adds translations in Dialogue mode.
                    </li>
                    <li>
                      <strong>Show History Table:</strong> in non-dialogue quiz modes, you can see the answers you have given in this history table, making it easier to remember previous entries.
                    </li>
                  </ul>
                </v-card>
              </template>
            </v-stepper>
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
                  <v-btn c
                         lass="ma-2"
                         variant="text"
                         icon="mdi-information"
                         @click="toggleDisplayInfo">
                    <v-icon>mdi-information</v-icon>
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
                      @click="randomSet"
                      v-if="selectedQuizMode !== '' && selectedQuizMode !== 'dialogue' && maxSet > 2"
                  ></v-btn>
                  <v-menu v-if="selectedQuizMode !== '' && selectedQuizMode !== 'dialogue'" offset-y>
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" color="footer">
                        <v-tooltip bottom :disabled="isTouchDevice">
                          <template v-slot:activator="{ props }">
                            <v-icon color="black" v-bind="props" large>mdi-cog</v-icon>
                          </template>
                          <span>Extra Settings</span>
                        </v-tooltip>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item v-if="selectedQuizMode === 'media'">
                        <v-list-item-action>
                          <v-switch
                              v-model="showEnglishText"
                              color="primary"
                              label="Show text with images"
                          ></v-switch>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item v-if="selectedQuizMode === 'media' || selectedQuizMode === 'authorbased'">
                        <v-list-item-action>
                          <v-switch
                              v-model="isComprehensive"
                              color="primary"
                              label="Extended Mode"
                          ></v-switch>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item v-if="selectedQuizMode === 'media' || selectedQuizMode === 'authorbased'">
                        <v-list-item-action>
                          <v-switch
                              v-model="showHistoryIndicator"
                              color="primary"
                              label="Show History Table"
                          ></v-switch>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-toolbar>
                <v-expand-transition>
                  <div v-if="!minimized">
                    <br><br>
                    <v-row>
                      <v-col v-for="(quiz, index) in quizModes" :key="index" cols="12" sm="6">
                        <v-btn class="ma-1 quiz-button" :class="{ 'pulsate': selectedQuizMode === '' }" :color="selectedQuizMode === quiz.value ? 'primary' : 'triadic'" block @click="selectQuiz(quiz.value)">
                          <v-icon left>{{ quiz.icon }}</v-icon>
                          {{ quiz.text }}
                        </v-btn>
                      </v-col>
                    </v-row>
                    <br><br>
                    <v-combobox
                        v-if="selectedQuizMode !== ''"
                        class="mt-5"
                        :class="{ 'pulsate': selectedTheme === '' }"
                        v-model="selectedTheme"
                        :items="options"
                        item-title="name"
                        item-value="name"
                        label="Theme"
                        return-object
                        color="primary"
                        @update:modelValue="onThemeSelect"
                    ></v-combobox>
                    <v-card-text v-if="maxSet > 1 && selectedTheme !== ''">
                      <v-row class="mb-4" justify="space-between">
                        <v-col class="text-left">
                          <span class="subheading font-weight-light me-1">Set </span>
                          <span class="text-h4 font-weight-light" v-text="selectedSet"></span>
                          <span class="subheading font-weight-light me-1"> of </span>
                          <span class="text-h4 font-weight-light" v-text="maxSet"></span>
                        </v-col>
                        <v-col class="text-right">
                        </v-col>
                      </v-row>
                      <v-slider
                          v-if="selectedQuizMode !== ''"
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
                    </v-card-text>
                  </div>
                </v-expand-transition>
              </v-card>
            </v-container>
            <div ref="quizContainerRef" class="quiz-container" v-if="selectedTheme !== ''">
              <v-container v-if="quizWord">
                <h3>Translate:</h3>
                <div class="quiz-word-container">
                  <h2>{{ quizWord }}</h2>
                </div>
              </v-container>
              <br />
              <div v-if="correct && showNextQuestionIndicator" class="text-center mb-4">
                <v-progress-circular indeterminate color="primary" width="3" size="48"></v-progress-circular>
              </div>
              <Dialogue
                  v-if="selectedQuizMode === 'dialogue'"
                  :dialogueOptions="dialogueOptions"
                  :dialogueContent="dialogueContent"
                  :selectedQuizMode="selectedQuizMode"
                  :selectedTheme="selectedTheme"
                  :selectedSet="selectedSet"
              />
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
                      <v-img
                          :src="`/src/assets/icons/${item.imageUrl}`"
                          class="mb-2"
                          aspect-ratio="1"
                      >
                      </v-img>
                      <v-card-text v-if="showEnglishText" class="text-center">{{ item.option }}</v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
              <!-- Text Buttons for Other Quiz Modes -->
              <div v-if="selectedQuizMode === 'authorbased'">
                <v-row>
                  <v-col v-for="item in answers" :key="item.option" cols="12" sm="6">
                    <v-btn @click="checkAnswer(item);" class="ma-1" :class="{ 'answer-correct': answerStates[item.option]?.isCorrect, 'answer-incorrect': !answerStates[item.option]?.isCorrect && answerStates[item.option]?.selected }" :color="answerStates[item.option]?.selected ? (answerStates[item.option]?.isCorrect ? '#1de9b6': '#e9501d') : 'triadic'" block>
                      <span>{{ truncateText(item.option) }}</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
              <AnalyzeResults v-if="isComprehensive" :analyzeResults="analyzeResults" />
              <div style="margin: 5em auto;">
                <v-data-table
                    v-if="selectedQuizMode !== quizModes[2].value && selectedQuizMode !== '' && showHistoryIndicator && selectedTheme !== ''"
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
import { ref, reactive, watch, nextTick, onMounted, getCurrentInstance, watchEffect } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { SokratesCheckBase, SokratesCreateQuestion, SokratesOptions } from "@/constants/graphql";
import AnalyzeResults from "@/components/AnalyzeResults.vue";
import Dialogue from "@/components/Dialogue.vue";

export default {
  name: 'QuizArea',
  components: {
    AnalyzeResults,
    Dialogue,
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
    const displayInfo = ref(false);
    const stepper = ref(1);
    const quizWord = ref('');
    const answers = ref([]);
    const responseOptions = ref([]);
    const dialogueOptions = ref({});
    const lastInteractiveWord = ref("");
    const isTextBoxMinimized = ref(false);
    const showNextQuestionIndicator = ref(false);
    const showHistoryIndicator = ref(true);
    const rhemai = ref([]);
    const historyTable = ref([]);
    const options = ref([]);
    const correct = ref(false);
    const latestIndex = ref(0);
    const attemptMade = ref(false);
    const dialogueContent = ref({});
    const answerStates = reactive({});
    const analyzeResults = ref([]);
    const quizModes = [
      { text: 'Media', value: 'media', icon: 'mdi-image' },
      { text: 'AuthorBased', value: 'authorbased', icon: 'mdi-book-open-page-variant' },
      { text: 'Dialogue', value: 'dialogue', icon: 'mdi-forum' },
    ];
    const headers = [
      { text: 'Greek', value: 'greek', align: 'center' },
      { text: 'Provided Answer', value: 'input', align: 'center' },
    ];
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const quizContainerRef = ref();

    const randomSet = () => {
      selectedSet.value = Math.floor(Math.random() * maxSet.value) + 1;
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

    const toggleDisplayInfo = () => {
      displayInfo.value = !displayInfo.value;
    };

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
      });
    };

    const selectQuiz = (value) => {
      selectedTheme.value = '';
      quizWord.value = '';
      answers.value = [];
      responseOptions.value = [];
      selectedQuizMode.value = value;
      getOptions(value);
      selectedSet.value = 1;

      if (value === quizModes[2].value) {
        isComprehensive.value = false;
      }

      updateUrl({
        quizmode: selectedQuizMode.value,
      });
    };

    const onThemeSelect = (item) => {
      selectedSet.value = 1;
      responseOptions.value = [];
      selectedTheme.value = item.name;
      if (item && item.highestSet) {
        maxSet.value = parseInt(item.highestSet, 10);
        selectedSet.value = 1;
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
          const sortedOptions = [...newResult.options.aggregates].sort((a, b) => a.name.localeCompare(b.name));
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

    const getQuestion = async () => {
      attemptMade.value = false;
      Object.keys(answerStates).forEach(key => delete answerStates[key]);
      if (!selectedTheme.value) {
        return;
      }

      const { result, refetch } = useQuery(SokratesCreateQuestion, {
        theme: selectedTheme.value,
        quizType: selectedQuizMode.value,
        set: String(selectedSet.value),
        fetchPolicy: 'no-cache',
      });

      watchEffect(() => {
        if (result.value) {
          const newResult = result.value;
          if (selectedQuizMode.value !== 'dialogue') {
            quizWord.value = newResult.quiz.quizItem;
            const slicedArray = newResult.quiz.options.slice(0, 4);
            createNewArray(slicedArray).then(array => {
              answers.value = array;
            });
          } else {
            quizWord.value = null;
            dialogueOptions.value = newResult.quiz.dialogue;
            dialogueContent.value = newResult.quiz.content;
          }
        }
      });

      await refetch();
    };

    const checkAnswer = async (selectedAnswer) => {
      attemptMade.value = true;
      let resultProcessed = false;

      const { result, refetch } = useQuery(SokratesCheckBase, {
        theme: selectedTheme.value,
        quizType: selectedQuizMode.value,
        set: String(selectedSet.value),
        quizWord: quizWord.value,
        answer: selectedAnswer.option,
        comprehensive: isComprehensive.value,
        fetchPolicy: 'no-cache',
      });

      const processResult = async (newResult) => {
        if (newResult) {
          correct.value = newResult.answer.correct;
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

          answerStates[selectedAnswer.option] = {
            selected: true,
            isCorrect: correct.value,
          };

          if (correct.value) {
            showNextQuestionIndicator.value = true;
            setTimeout(() => {
              getNextQuestion();
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
      showNextQuestionIndicator.value = false;
      getQuestion();
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
        selectedTheme.value = theme;
        options.value.forEach((option) => {
          if (option.name === theme) {
            maxSet.value = parseInt(option.highestSet, 10);
            selectedSet.value = 1;
          }
        });
      }
      if (quizmode && theme ) {
        await getQuestion();
      }
    };

    onMounted(() => {
      initializeFromURL();
    });

    watch(selectedSet, () => {
      if (selectedTheme.value) {
        getNextQuestion();
      }
    });

    return {
      theme,
      minimized,
      selectedQuizMode,
      selectedTheme,
      selectedSet,
      maxSet,
      isComprehensive,
      showEnglishText,
      displayInfo,
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
      analyzeResults,
      dialogueContent,
      toggleDisplayInfo,
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
      randomSet,
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
  font-family: 'Roboto', serif;
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
