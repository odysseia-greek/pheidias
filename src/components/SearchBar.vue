<template>
  <v-card-text>
    <v-autocomplete
        :loading="loading"
        v-model="selectedWord"
        :items="words"
        hide-no-data
        color="textprimary"
        item-text="greek"
        item-value="translation"
        label="Enter a word to search"
        placeholder="Start typing..."
        prepend-icon="mdi-magnify"
        auto-select-first
        @keyup.enter="updateSearchHistory"
        @input="scrollToResults"
    ></v-autocomplete>
    <div v-if="selectedWord" class="translation">
      <p><strong>Translation:</strong> {{ selectedWord }}</p>
      <p>More like this? Time to search the dictionary! <a href="/dictionary">link</a></p>
    </div>
  </v-card-text>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'SearchComponent',
  setup() {
    const loading = ref(false);
    const selectedWord = ref(null);
    const words = ref([
      { greek: 'λόγος', translation: 'word, reason' },
      { greek: 'ἀγάπη', translation: 'love' },
      { greek: 'ψυχή', translation: 'soul' },
      { greek: 'ἄνθρωπος', translation: 'man, human' },
      { greek: 'θεός', translation: 'god' },
    ]);

    const updateSearchHistory = (value) => {
      console.log(`Searched for: ${value}`);
    };

    return {
      loading,
      selectedWord,
      words,
      updateSearchHistory,
    };
  },
};
</script>

<style>
.translation {
  margin-top: 1em;
  color: var(--v-primary-base);
}
</style>
