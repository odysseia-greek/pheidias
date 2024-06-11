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
        <v-card color="triadic" style="margin-bottom: 1em; padding: 2em;" elevation="10" rounded="lg">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">

                <div class="text-h4 text--primary my-text-block" style="margin-top:1em;">
                  Welcome to Odysseia-Greek, your interactive gateway to learning Ancient (Attic) Greek!
                </div>
                <div :class="$vuetify.theme.textsecondary + ' text-h5 my-text-block'">
                  Dive into the world of Ancient Greece with our app designed to make learning fun and educational.
                  While there's a wealth of resources available for studying Ancient Greek, Odysseia-Greek aims to complement them by offering a unique, interactive experience.
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-card class="custom-card" color="text" rounded="lg"  style="margin-top:8em;">
                  <v-card-text>
                <TypingText :texts="introTexts" />
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <div :class="$vuetify.theme.textsecondary + ' text-h5 my-text-block'" style="margin-top:5em;">
                  <strong>Why choose Odysseia-Greek?</strong>
                  <br><br>
                  <strong>Engaging Content:</strong> All tools and exercises are designed to keep you motivated and entertained as you learn.
                  <br>
                  <strong>Easy to Use:</strong> Each component is designed to be interactive and easy to use. You can find a howto with examples at each component.
                  <br>
                  <strong>Community Driven:</strong> We value your input! If you spot any mistakes or have suggestions, don’t hesitate to reach out.
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <div :class="$vuetify.theme.textsecondary + ' text-h5 my-text-block'" style="margin-top:5em;">
                  <strong>New to Ancient Greek?</strong>
                  <br>
                  Not sure where to begin? Click the button below to start your journey! Scroll down to see each component with a brief introduction.
                  <br><br>
                  For the best experience, we recommend using the app on a tablet with a resolution of 820px.
                  <br><br>
                  Embark on your learning adventure with Odysseia-Greek and explore the beauty of Ancient Greek language and culture.
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <v-card class="custom-card" color="text" rounded="lg" style="margin-top:8em;">
                  <v-card-text>
                <SearchComponent></SearchComponent>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-btn :to="'/quiz'" color="primary" class="mx-auto my-text-block" large elevation="2" style="margin-top:2em;">
              Get Started
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
import { ref, onMounted } from 'vue';
import TypingText from "@/components/TypingText.vue";
import SearchComponent from "@/components/SearchBar.vue";

export default {
  name: "HomePage",
  components: {SearchComponent, TypingText},
  setup() {
    const flex = ref(6);
    const odysseus = ref(require('@/assets/odysseus.webp'));
    const introTexts = ref([
      {
        greek: "ἓν οἶδα ὅτι οὐδὲν οἶδα.",
        translation: "I know one thing that I know nothing."
      },
      {
        greek: "νόμωι (γάρ φησι) γλυκὺ καὶ νόμωι πικρόν, νόμωι θερμόν, νόμωι ψυχρόν, νόμωι χροιή, ἐτεῆι δὲ ἄτομα καὶ κενόν",
        translation: "By convention sweet is sweet, bitter is bitter, hot is hot, cold is cold, color is color; but in truth there are only atoms and the void."
      },
      {
        greek: "Πάντα ῥεῖ καὶ οὐδὲν μένει.",
        translation: "Everything flows and nothing stays."
      },
      {
        greek: "Ἀρχὴ ἥμισυ παντός.",
        translation: "The beginning is half of the whole."
      },
      {
        greek: "οἷον ἡ ψυχή ἡ ἡμετέρα ἀὴρ οὖσα συγκρατεῖ ἡμᾶς, καὶ ὅλον τὸν κόσμον πνεῦμα καὶ ἀὴρ περιέχει",
        translation: "Just as our soul, being air, constrains us, so breath and air envelops the whole kosmos."
      },
      {
        greek: "τό γάρ αυτο νοειν έστιν τε καί ειναι.",
        translation: "For it is the same thinking and being."
      },
      {
        greek: "Ου κλέπτω την νίκην.",
        translation: "I will not steal my victory."
      },
      {
        greek: "Αἶψα γὰρ ἐν κακότητι βροτοὶ καταγηράσκουσιν.",
        translation: "Hardship can age a person overnight."
      },
      {
        greek: "Ἡροδότου Ἁλικαρνησσέος ἱστορίης ἀπόδεξις ἥδε, ὡς μήτε τὰ γενόμενα ἐξ ἀνθρώπων τῷ χρόνῳ ἐξίτηλα γένηται, μήτε ἔργα μεγάλα τε καὶ θωμαστά, τὰ μὲν Ἕλλησι τὰ δὲ βαρβάροισι ἀποδεχθέντα, ἀκλεᾶ γένηται, τά τε ἄλλα καὶ διʼ ἣν αἰτίην ἐπολέμησαν ἀλλήλοισι.",
        translation: "This is the display of the inquiry of Herodotus of Halicarnassus, so that things done by man not be forgotten in time, and that great and marvelous deeds, some displayed by the Hellenes, some by the barbarians, not lose their glory, including among others what was the cause of their waging war on each other."
      },
      {
        greek: "κακῶς φρονοῦντες· ὡς τρὶς ἂν παρ’ ἀσπίδα στῆναι θέλοιμ’ ἂν μᾶλλον ἢ τεκεῖν ἅπαξ.",
        translation: "How wrong they are! I would rather stand three times with a shield in battle than give birth once."
      },
    ]);
    const cards = ref([
      {
        title: "Quiz",
        color: "triadic",
        src: require('@/assets/school_of_athens.webp'),
        link: "/quiz",
        subTitle: "Sokrates",
        shortText: "Imagine standing in the Athenian Agora, just selling your wares. A man, an ugly man at that, walks up and strikes up a conversation. Before you know it you need to answer questions about morality and how you know you are correct.",
        longText: "That insisted questioning is why Sokrates is the name given to the Quiz section, it is a place to practise multiple choice word options taken from famous Greek works. Image based quizzes or even dialogue! It's the best place to start if you are new.",
      },
      {
        title: "Dictionary",
        color: "triadic",
        src: require('@/assets/alexander.webp'),
        link: "/dictionary",
        subTitle: "Alexandros",
        shortText: "The end of the earth was still not enough in his search and quest for glory. Few people loom as large as Alexander the Great in world history.",
        longText: "His name is therefore linked to the dictionary component of Odysseia which is pretty self-explanatory. You can search for (partial) words here. Each keystroke will send a query to the backend and accents are ignored for easy searching. Support English, Ancient Greek or Dutch (Nederlands) as search parameters.",
      },
      {
        title: "Grammar",
        color: "triadic",
        src: require('@/assets/grammar.webp'),
        link: "/grammar",
        subTitle: "Dionysios",
        shortText: "As a grammarian working in Alexandria, at the time the centre of Greek learning, Dionysios has had a large influence on learning Greek. His grammatical text has been the standard manual for a period up to the Renaissance.",
        longText: "The fact that he wrote about Grammar and his text is known as a grammatical text makes Dionysios the logical name for the Grammar part of Odysseia. So what can you expect here? Dionysios will help you decline words and search for a possible meaning. The backend takes care of the heavy lifting for you. Currently nouns, verbs and participia are supported (but very much incomplete).",
      },
      {
        title: "Texts",
        color: "triadic",
        src: require('@/assets/alexandria.webp'),
        link: "/texts",
        subTitle: "Herodotos",
        shortText: "Known as the father of history Herodotos came from the city of Halicarnassus in what is now Western Turkey but then a thriving Greek city.",
        longText: "What can be said with certainty is that his influence over Ancient Greek is vast. He is part of most textbooks that help students take their first steps into Ancient Greek. In the Herodotos or Text section of Odysseia you can translate texts. It will calculate how accurate your translation is compared to an official translation.",
      },
    ]);

    const isMobile = () => screen.width <= 900;

    onMounted(() => {
      if (isMobile()) {
        flex.value = 12;
        odysseus.value = require('@/assets/mobile_odysseus.webp');
      } else {
        flex.value = 6;
      }
    });

    return {
      flex,
      odysseus,
      cards,
      introTexts,
    };
  },
};
</script>

<style>
.v-parallax__image-container {
  opacity: 0.8;
}

.my-text-block {
  margin-bottom: 1em; /* Adjust this value as needed */
}

.custom-card {
  padding: 1em;
}

@media only screen and (max-width: 820px) {
  .my-card {
    width: 100%;
  }
}

#homepage h1.text-lg-h1 {
  color: rgb(248, 248, 248) !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>



