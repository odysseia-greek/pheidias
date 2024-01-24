<template>
  <div id="app">
    <v-app id="homepage">
      <v-container
          background="primary"
          style="max-width: 100%"
          >
      <v-parallax
          class=".v-parallax__image-container"
          dark
          height=900
          :src="odysseus"
      >
        <v-row
            align="center"
            justify="center"
        >
          <v-col
              class="text-center"
              cols="12"
          >
            <h1 class="text-lg-h1 text--primary">
              Welcome to your Odysseia!
            </h1>
          </v-col>
        </v-row>
      </v-parallax>
      <v-container
          fluid
          style="max-width: 1400px"
      >
      <v-card
          class="text-center"
          color="triadic"
          style="margin-bottom: 1em"
      >
        <v-card-text>
          <p class="text-h4 text--primary my-text-block" style="margin-top:1em">
            odysseia-greek is an app to help you learn and interact with Ancient (Attic) Greek
          </p>
          <div :class="$vuetify.theme.textsecondary + ' text-h5 my-text-block'">
            When learning Ancient Greek there are a lot of resources you can (and should) use.
            This app in no way wants to replace anything that exists out there.
            Its main goal has always been to make a fun and educational tool to be used.<br>
            Any mistakes either in translation or content are mine, please feel free to reach out to me if you have any suggestions. <br>
            Each component listed below has a HOWTO in the top for when you need help interacting with the app.
          </div>
          <div :class="$vuetify.theme.textsecondary + ' text-h5 my-text-block'">
           <strong>Don't know where to start? Click the button below.</strong>
          </div>

          <v-btn
              :to="'/quiz'"
              color="primary"
              class="mx-auto my-text-block"
              large
          >
            Start With a Quiz
          </v-btn>
        </v-card-text>
      </v-card>
        <v-row dense>
          <v-col
              v-for="card in cards"
              :key="card.title"
              :cols="flex"
          >
            <v-card
                :color="card.color"
                height="100%">
              <a :href="card.link">
              <v-img
                  :src="card.src"
                  class="white--text align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  height="20em"
              >
                <v-card-title v-text="card.title"></v-card-title>
              </v-img>
              </a>
              <v-card-subtitle class="pb-0">
                {{card.subTitle}}
              </v-card-subtitle>
              <v-card-text class="text--primary">
                <p class="text-sm-h5 text--primary">
                  {{card.quote}}
                </p>
                <div class="text--primary">
                  {{card.shortText}}
                </div>
                <br>
                <div class="text--primary">
                  {{card.longText}}
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn
                    text
                    style="cursor: pointer"
                    :to="card.link"
                >
                  Link
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      </v-container>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data () {
    return {
      flex: 6,
      odysseus: require('@/assets/odysseus.webp'),
      cards: [
        {
          "title": "Quiz",
          "color": "triadic",
          "src": require('@/assets/school_of_athens.webp'),
          "link": "/quiz",
          "subTitle": "Sokrates",
          "quote": "ἓν οἶδα ὅτι οὐδὲν οἶδα - I know one thing that I know nothing",
          "shortText": "Imagine standing in the Athenian Agora, just selling your wares. " +
              "A man, an ugly man at that, walks up and strikes up a conversation. " +
              "Before you know it you need to answer questions about morality and how you know you are correct.",
          "longText": "That insisted questioning is why Sokrates is the name given to the Quiz section, it is a place to practise multiple choice word options taken from famous Greek works. Image based quizzes or even dialogue! It's the best place to start if you are new.",
        },
      {
        "title": "Dictionary",
        "color": "triadic",
        "src": require('@/assets/alexander.webp'),
        "link": "/dictionary",
        "subTitle": "Alexandros",
        "quote": "Ου κλέπτω την νίκην - I will not steal my victory",
        "shortText": "The end of the earth was still not enough in his search and quest for glory. Few people loom as large as Alexander the Great in world history.",
        "longText": "His name is therefor linked to the dictionary component of Odysseia which is pretty self explanatory. " +
            "You can search for (partial) words here. Each keystroke will send a query to the backend and accents are ignored for easy searching. " +
            "Support English, Ancient Greek or Dutch (Nederlands) as search parameters.",
      },
      {
        "title": "Grammar",
        "color": "triadic",
        "src": require('@/assets/grammar.webp'),
        "link": "/grammar",
        "subTitle": "Dionysios",
        "quote": "Γραμματική ἐστιν ἐμπειρία τῶν παρὰ ποιηταῖς τε καὶ συγγραφεῦσιν ὡς ἐπὶ τὸ πολὺ λεγομένων - Grammar is an experimental knowledge of the usages of language as generally current among poets and prose writers",
        "shortText": "Dionysios was a grammarian working in Alexandria, at the time the centre of Greek learning. His grammatical text has been the standard manual for a period up to the Renaissance.",
        "longText": "The fact that he wrote about Grammar and his text is known as a grammatical text makes Dionysios the logical name for the Grammar part of Odysseia. " +
            "So what can you expect here? Dionysios will help you decline words and search for a possible meaning. The backend takes care of the heavy lifting for you. " +
            "Currently nouns, verbs and participia are supported (but very much incomplete).",
      },
      {
        "title": "Texts",
        "color": "triadic",
        "src": require('@/assets/alexandria.webp'),
        "link": "/texts",
        "subTitle": "Herodotos",
        "quote": "Ἡροδότου Ἁλικαρνησσέος ἱστορίης ἀπόδεξις ἥδε - This is the display of the inquiry of Herodotos of Halikarnassos",
        "shortText": "Herodotos is known as the father of history. Whether he has earned that reputation I'll leave to the viewer of Odysseia.",
        "longText": "What can be said with certainty is that his influence over Ancient Greek is vast. He is part of most textbooks that help students take their first steps into Ancient Greek. " +
            "In the Herodotos or Text section of Odysseia you can translate texts. " +
            "It will calculate how accurate your translation is compared to an official translation.",
      },
    ],

    }
  },
  methods: {
    isMobile() {
      return screen.width <= 900;
    },
  },
  created() {
    if (this.isMobile()) {
      this.flex = 12;
      this.odysseus = require('@/assets/mobile_odysseus.webp')

    }
    else {
      this.flex = 6;
    }
  }
}
</script>

<style>
.v-parallax__image-container {
  opacity: 0.8;
}

.my-card {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.my-text-block {
  margin-bottom: 1em; /* Adjust this value as needed */
}

@media only screen and (max-width: 820px) {
  .my-card {
    width: 100%;
  }
}

#homepage h1.text-lg-h1 {
  color: rgb(248,248,248) !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

</style>