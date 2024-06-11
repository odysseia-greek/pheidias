<template>
  <div id="quizarea">
    <v-app
        id="navbar"
        :style="{background: $vuetify.theme.themes[theme].background}"
    >
      <v-main>
        <div class="text-center">
          <div v-if="showAllOptions" style="margin-bottom:2em;">
            <v-btn class="ma-4" color="primary" @click="toggleDisplayInfo">
              How To
              <v-icon right>info</v-icon>
            </v-btn>
            <v-stepper v-model="stepper" v-if="displayInfo">
              <v-stepper-header>
                <v-stepper-step :complete="stepper > 1" step="1">Select Quiz Type</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="stepper > 2" step="2">Select Theme</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="stepper > 3" step="3">Select Set</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="4">Other Options</v-stepper-step>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-card class="mb-12 text-left" color="white">
                    First select the quiz type you want to play <strong>this page looks best on a tablet resolution (820px).</strong>
                    <br>
                    <br>
                    <ul>
                      <li>
                        <strong>Author:</strong> multiple choice questions taken from great works of literature.
                      </li>
                      <li>
                        <strong>Dialogue:</strong> converse in Ancient Greek with Ancient Greeks! This mode allows you to recreate dialogue taken from great works of literature. You are asked to put the conversation in the right order.
                      </li>
                      <li>
                        <strong>Media:</strong> this quiz type has images and (in the future) audio for you to have an interactive experience. The images have been created by AI so if they seem a bit "off" at times you know why;). The reason they have been generated is simply cost effectiveness.
                      </li>
                    </ul>
                    <br>
                  </v-card>
                  <v-btn color="primary" @click="stepper = 2">Next Step</v-btn>
                  <v-btn text @click="toggleDisplayInfo">Close</v-btn>
                </v-stepper-content>
                <v-stepper-content step="2">
                  <v-card class="mb-12 text-left" color="white">
                    Themes represent a work from antiquity or a category of questions such as Basic or Daily Life.
                    <br>
                    <br>
                    For example: <strong>Aeschylus - Agamemnon</strong> or <strong>Homer - Odyssey</strong>. Dialogue or multiple choice will be taken from these works.
                    <br>
                    <br>
                    Since the quiz words are the words that appear the most in certain texts, there will always be quite some overlap between the different themes.
                  </v-card>
                  <v-btn color="primary" @click="stepper = 3">Next Step</v-btn>
                  <v-btn text @click="toggleDisplayInfo">Close</v-btn>
                </v-stepper-content>
                <v-stepper-content step="3">
                  <v-card class="mb-12 text-left" color="white">
                    A set is a number of quiz items within a quiz. Each set consists of <strong>20</strong> words that will randomly be presented as a quiz.
                    <br>
                    <br>
                    Some sets might be a bit smaller or larger than 20 because the total number of quiz words is larger than x * 20.
                    <br>
                    <br>
                    In author mode, sets are divided by word size and whenever possible into nouns and verbs.
                  </v-card>
                  <v-btn color="primary" @click="stepper = 4">Next Step</v-btn>
                  <v-btn text @click="toggleDisplayInfo">Close</v-btn>
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
                        <strong>Show Text With Images:</strong> when using media or image-based modes, the images can be appended with an English test.
                      </li>
                      <li>
                        <strong>Extended Mode:</strong> available in image, media, and author-based modes. This will show words that are similar and where in the text you can find a word in all its known declensions.
                        <br>
                        The known declensions are based on words found in the grammar component <a href="/grammar">link</a>.
                      </li>
                      <li>
                        <strong>Show Translation:</strong> adds translations in Dialogue mode.
                      </li>
                      <li>
                        <strong>Show History Table:</strong> in non-dialogue quiz modes, you can see the answers you have given in this history table, making it easier to remember previous entries.
                      </li>
                      <li>
                        <strong>Show All Options:</strong> unclutters the screen by removing everything but the Quiz Area itself. Extended mode can still be enabled when all other options are removed.
                      </li>
                    </ul>
                  </v-card>
                  <v-btn text @click="toggleDisplayInfo">Close</v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </div>
          <br />
          <br>
          <v-container class="quiz-container">
            <!-- Quiz Mode Buttons -->
            <v-row v-if="showAllOptions">
              <v-col v-for="(quiz, index) in quizModes" :key="index" cols="12" sm="6">
                <v-btn class="ma-1 quiz-button" :class="{ 'pulsate': selectedQuizMode === '' }" :color="selectedQuizMode === quiz.value ? 'primary' : 'triadic'" block @click="selectQuiz(quiz.value)">
                  <v-icon left>{{ quiz.icon }}</v-icon>
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
                v-if="selectedQuizMode !== '' && showAllOptions"
                class="mt-5"
                :class="{ 'pulsate': selectedTheme === '' }"
                v-model="selectedTheme"
                :items="options"
                item-text="name"
                item-value="name"
                label="Theme"
                return-object
                @change="onThemeSelect"
            ></v-combobox>
            <v-slider
                v-if="selectedQuizMode !== '' && showAllOptions"
                class="my-5"
                label="Set"
                v-model="selectedSet"
                :max="maxSet"
                :min="1"
                thumb-label="always"
            ></v-slider>
          </v-container>
          <div ref="quizContainerRef" class="quiz-container">
            <v-container v-if="selectedQuizMode !== 'dialogue' && quizWord">
              <h3>Translate:</h3>
              <div class="quiz-word-container">
                <h2>{{ quizWord }}</h2>
              </div>
            </v-container>
            <br />
            <div v-if="correct && showNextQuestionIndicator" class="text-center mb-4">
              <v-progress-circular indeterminate color="primary" width="3" size="48"></v-progress-circular>
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
                    <v-col v-for="(speaker, index) in dialogueOptions.speakers" :key="index" cols="12" sm="6">
                      <v-btn class="ma-1" :color="selectedSpeaker === speaker.shorthand ? 'primary' : 'triadic'" block @click="setSpeaker(speaker);scrollMeTo('dialogueRef');">
                        {{ speaker.shorthand }} {{ speaker.translation }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card v-if="dialogueText.length > 0">
                <v-card-title ref="dialogueRef">Dialogue</v-card-title>
                <v-card-text>
                  <div v-for="(line, index) in dialogueText" :key="index" class="dialogue-line" :class="{'user-speaker': line.speaker === selectedSpeaker, 'other-speaker': line.speaker !== selectedSpeaker, 'wrongly-placed': line.isWronglyPlaced}">
                    <div class="dialogue-bubble" :ref="el => setDialogueOptionRef(el, index)">
                      <strong>{{ line.speaker }}:</strong>
                      {{ line.greek }}
                    </div>
                    <div v-if="showDialogueTranslation" class="translation-text">
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
                      <v-card class="ma-2 response-card" color="#f5f5f5" @click="setDialogue(response)">
                        <v-card-text>
                          {{ response.greek }}
                          <span v-if="showDialogueTranslation" class="translation-text"> <em><br>{{ response.translation }}</em></span>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card v-if="selectedQuizMode === 'dialogue' && selectedTheme">
                <v-card-title>Progress of your dialogue</v-card-title>
                <v-btn @click="checkDialogueAnswer();" color="primary" class="ma-1" block>Check</v-btn>
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
                  <v-btn @click="checkAnswer(item);" class="ma-1" :class="{ 'answer-correct': answerStates[item.option]?.isCorrect, 'answer-incorrect': !answerStates[item.option]?.isCorrect && answerStates[item.option]?.selected }" :color="answerStates[item.option]?.selected ? (answerStates[item.option]?.isCorrect ? '#1de9b6': '#e9501d') : 'triadic'" block>
                    <span>{{ truncateText(item.option) }}</span>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <AnalyzeResults v-if="isComprehensive" :analyzeResults="analyzeResults" />
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
import {ref, reactive, watch, nextTick, onMounted, getCurrentInstance, watchEffect} from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { SokratesCheckBase, SokratesCheckDialogue, SokratesCreateQuestion, SokratesOptions } from "@/constants/graphql";
import AnalyzeResults from "@/components/AnalyzeResults.vue";
import Vue from "vue";

export default {
  name: "QuizArea",
  components: {AnalyzeResults},
  setup() {
    const { proxy } = getCurrentInstance();
    const theme = ref('light');
    const showAllOptions = ref(true);
    const selectedQuizMode = ref('');
    const selectedTheme = ref('');
    const selectedSet = ref(1);
    const maxSet = ref(1);
    const isComprehensive = ref(false);
    const showEnglishText = ref(false);
    const showDialogueTranslation = ref(false);
    const displayInfo = ref(false);
    const stepper = ref(1);
    const quizWord = ref('');
    const answers = ref([]);
    const responseOptions = ref([]);
    const dialogueOptions = ref({});
    const dialogueContent = ref([]);
    const selectedSpeaker = ref('');
    const dialogueText = ref([]);
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
    const answerStates = reactive({});
    const wronglyPlaced = ref([]);
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
    const dialogueOptionsRefs = ref([]);
    const quizContainerRef = ref();
    const dialogueRef = ref();
    const analyzeResults = ref([]);


    const toggleDisplayInfo = () => {
      displayInfo.value = !displayInfo.value;
      stepper.value = 1;
    };

    const highlightText = (text) => {
      return text.replace(/&&&(.*?)&&&/g, (match, p1) => {
        return `<span style="font-weight: bold; background-color: yellow; color: black; padding: 0 4px;">${p1}</span>`;
      });
    };

    const scrollToLatestLine = () => {
      nextTick(() => {
        if (latestIndex.value < 5) {
          scrollMeTo('dialogueRef');
        } else {
          const targetIndex = Math.max(latestIndex.value - 2, 0);
          const targetElement = dialogueOptionsRefs.value[targetIndex];

          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    };

    const scrollMeTo = (refName) => {
      nextTick(() => {
        if (refName === 'quiz') {
          quizContainerRef.value.scrollIntoView({ behavior: 'smooth' });
        } else {
          dialogueRef.value.scrollIntoView({ behavior: 'smooth' });
        }
      });
    };

    const setDialogueOptionRef = (el, index) => {
      if (el) {
        dialogueOptionsRefs.value[index] = el;
      } else {
        // When the element is unmounted, remove the ref
        dialogueOptionsRefs.value.splice(index, 1);
      }
    };

    const selectQuiz = (value) => {
      selectedTheme.value = '';
      quizWord.value = '';
      answers.value = [];
      responseOptions.value = [];
      dialogueText.value = [];
      dialogueContent.value = [];
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

    const setSpeaker = (value) => {
      selectedSpeaker.value = value.shorthand;
      initializeDialogue();
    };

    const initializeDialogue = async () => {
      const firstSpeaker = dialogueContent.value[0].speaker;

      if (selectedSpeaker.value === firstSpeaker) {
        dialogueText.value = [dialogueContent.value[0], dialogueContent.value[1]];
      } else {
        dialogueText.value = [dialogueContent.value[0]];
      }

      const responses = dialogueContent.value.filter((line) => line.speaker === selectedSpeaker.value && line.place !== 1);

      responseOptions.value = await createNewArray(responses);
    };

    const getLocalImagePath = (imageUrl) => {
      return require(`@/assets/icons/${imageUrl}`);
    };

    const setDialogue = (selectedDialogue) => {
      let setTranslationBack = false;
      if (showDialogueTranslation.value) {
        showDialogueTranslation.value = false;
        setTranslationBack = true;
      }

      updateResponseOptions(selectedDialogue);
      scrollToLatestLine();
      latestIndex.value = dialogueText.value.length;

      typeDialogue(selectedDialogue, () => {
        const nextIndex = dialogueText.value.length;
        if (nextIndex < dialogueContent.value.length && dialogueContent.value[nextIndex].speaker !== selectedSpeaker.value) {
          setTimeout(() => {
            typeDialogue(dialogueContent.value[nextIndex], () => {
              if (setTranslationBack) {
                setTimeout(() => {
                  showDialogueTranslation.value = true;
                }, 500);
              }
            });
          }, 500);
        } else {
          if (setTranslationBack) {
            setTimeout(() => {
              showDialogueTranslation.value = true;
            }, 500);
          }
        }
      });
    };

    const updateResponseOptions = (selectedDialogue) => {
      responseOptions.value = responseOptions.value.filter((option) => option.place !== selectedDialogue.place);
    };

    const typeDialogue = (line, callback = null) => {
      let typedText = '';
      const typingSpeed = 50;
      const newLine = Object.assign({}, line, { greek: '' });
      dialogueText.value.push(newLine);

      for (let i = 0; i < line.greek.length; i++) {
        setTimeout(() => {
          typedText += line.greek[i];
          newLine.greek = typedText;
          if (i === line.greek.length - 1 && callback) {
            callback();
          }
        }, i * typingSpeed);
      }
    };

    const onThemeSelect = (item) => {
      selectedSet.value = 1;
      selectedSpeaker.value = '';
      responseOptions.value = [];
      dialogueText.value = [];
      dialogueOptions.value = [];
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
        fetchPolicy: 'cache-and-network', // Use cache-and-network to fetch from cache and then update from network
      });

      watch(result, (newResult) => {
        if (newResult && newResult.options) {
          options.value = newResult.options.aggregates.sort((a, b) => a.name.localeCompare(b.name));
        }
      }, { immediate: true }); // Ensure the watcher runs immediately to handle the initial result

      // Initial fetch to ensure data is loaded and updated if necessary
      await refetch();
    };

    watch(selectedQuizMode, async (newMode) => {
      if (newMode) {
        await getOptions(newMode);
      }
    });


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
            quizWord.value = 'temp';
            dialogueOptions.value = newResult.quiz.dialogue;
            dialogueContent.value = newResult.quiz.content;
          }
        }
      });

      await refetch(); // Ensure the query is refetched
    };

    const checkDialogueAnswer = () => {
      const dialogueData = dialogueText.value.map(({ isWronglyPlaced, __typename, ...rest }, index) => {
        return { ...rest, place: index + 1 };
      });

      const { result } = useQuery(SokratesCheckDialogue, {
        theme: selectedTheme.value,
        quizType: selectedQuizMode.value,
        set: String(selectedSet.value),
        dialogue: dialogueData,
        fetchPolicy: 'no-cache',
      });

      watch(result, (newResult) => {
        if (newResult) {
          wronglyPlaced.value = newResult.answer.wronglyPlaced;
          wronglyPlaced.value.forEach((wrongItem) => {
            const index = wrongItem.place - 1;
            if (dialogueText.value[index]) {
              Vue.set(dialogueText.value[index], 'isWronglyPlaced', true);
            }
          });
        }
      });
    };
    const checkAnswer = async (selectedAnswer) => {
      attemptMade.value = true;

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
          if (isComprehensive.value) {
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
              analyzeResults.value[0].rootword = quizWord.value
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

          const color = correct.value ? '#1de9b6' : '#e9501d';
          lastInteractiveWord.value = quizWord.value;
          const lastAnswer = {
            greek: quizWord.value,
            color: color,
            input: selectedAnswer.option,
          };

          historyTable.value.unshift(lastAnswer);
        }
      };

      // Watch result immediately and on changes
      watch(result, async (newResult) => {
        await processResult(newResult);
      }, { immediate: true });

      // Explicitly refetch the query to ensure it's executed again
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
      showAllOptions,
      selectedQuizMode,
      selectedTheme,
      selectedSet,
      maxSet,
      isComprehensive,
      showEnglishText,
      showDialogueTranslation,
      displayInfo,
      stepper,
      quizWord,
      answers,
      responseOptions,
      dialogueOptions,
      dialogueContent,
      selectedSpeaker,
      dialogueText,
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
      wronglyPlaced,
      quizModes,
      headers,
      isTouchDevice,
      quizContainerRef,
      dialogueRef,
      dialogueOptionsRefs,
      analyzeResults,
      toggleDisplayInfo,
      highlightText,
      scrollToLatestLine,
      selectQuiz,
      setSpeaker,
      initializeDialogue,
      getLocalImagePath,
      setDialogue,
      updateResponseOptions,
      typeDialogue,
      getOptions,
      onThemeSelect,
      scrollMeTo,
      getQuestion,
      checkDialogueAnswer,
      checkAnswer,
      truncateText,
      createNewArray,
      getNextQuestion,
      setDialogueOptionRef,
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>


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
