<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import WordCard from './cards/WordCard.vue'
import WordDetails from './WordDetails.vue'
import PitchFilter from './PitchFilter.vue'
import WordForm from './WordForm.vue'

import { useWordStore } from '../stores/word';
import type { Word } from '@/stores/word';

const store = useWordStore();

const filterByPitch = ref<Function | null>(null);
const filteredWords = computed(() => {
  return store.words.filter((word:Word) => filterByPitch.value ? filterByPitch.value(word) : true);
})

const baseQuery = { words: { $: {order: { tango: 'asc' } } } };
onMounted(() => {
  store.subscribeWords(baseQuery);
  store.startLoading();
})

const activeWord = ref<Word | null>(null);
const showDetails = (word: Word) => {
  activeWord.value = word;
}
</script>

<template>
    <div class="form-container">
        <PitchFilter @change="filterByPitch = $event" />
        <WordForm />
    </div>
    <div class="words-container" v-if="!store.loading && !activeWord">
        <div class="words" v-if="filteredWords.length > 0">
            <WordCard v-for="word in filteredWords" :key="word.tango" :word="word" @showDetails="showDetails(word)" />
        </div>
        <div class="words" v-else>
            <p>No words found!</p>
        </div>
    </div>
    <WordDetails v-if="activeWord" :word="activeWord" @hideDetails="activeWord = null" />
    <div class="loading" v-if="store.loading">
    Loading...
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

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1em;
  justify-content: center;
}
</style>