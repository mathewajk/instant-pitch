<script setup lang="ts">
import { ref, computed } from 'vue'
import WordCard from './components/cards/WordCard.vue'
import PitchFilter from './components/PitchFilter.vue'
import words from './assets/words.json'

const sortedWords = computed(() => {
  return words.words.sort((a, b) => a.tango.localeCompare(b.tango));
});

const filterByPitch = ref<Function | null>(null);
const filteredWords = computed(() => {
  return sortedWords.value.filter(word => filterByPitch.value ? filterByPitch.value(word) : true);
})

</script>

<template>
  <PitchFilter @change="filterByPitch = $event" />
  <div class="words-container">
      <div class="words">
          <WordCard v-for="word in filteredWords" :key="word.tango" :word="word" />
      </div>
  </div>
  <div class="word-count">
      {{ filteredWords.length }} word(s)
  </div>
</template>

<style scoped>

.words-container {
  max-height: calc(100vh - 10rem);
  overflow-y: scroll;
}

.words {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1em;
}
</style>