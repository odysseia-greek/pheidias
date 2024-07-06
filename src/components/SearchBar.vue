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
    ></v-autocomplete>
    <div v-if="selectedWord" class="translation">
      <p><strong>Translation:</strong> {{ selectedWord }}</p>
      <v-divider></v-divider>
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
      { title: 'λόγος', translation: 'word, reason' },
      { title: 'ἀγάπη', translation: 'love' },
      { title: 'ψυχή', translation: 'soul' },
      { title: 'ἄνθρωπος', translation: 'man, human' },
      { title: 'θεός', translation: 'god' },
    ]);

    return {
      loading,
      selectedWord,
      words,
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
