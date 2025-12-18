<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import WordCard from './cards/WordCard.vue'
import PitchFilter from './PitchFilter.vue'
import WordForm from './WordForm.vue'

import { useWordStore } from '../stores/word';
import type { Word } from '@/stores/word';

const store = useWordStore();

const filterByPitch = ref<Function | null>(null);

const baseQuery = { words: { $: {order: { tango: 'asc' } } } };
const { isLoading, error, data } = store.subscribe(baseQuery);

const filteredWords = computed(() => {
  return data.value?.words.filter((word) => filterByPitch.value ? filterByPitch.value(word) : true);
})
</script>

<template>
    <div class="form-container">
        <PitchFilter @change="filterByPitch = $event" />
        <WordForm />
    </div>
    <div class="words-container" v-if="!isLoading">
        <div class="words" v-if="filteredWords && filteredWords.length > 0">
            <WordCard v-for="word in filteredWords" :key="word.tango" :word="word as Word" />
        </div>
        <div class="words" v-else>
            <p>No words found!</p>
        </div>
    </div>
    <div class="loading" v-if="store.loading">
    Loading...
    </div>
    <div class="word-count">
        {{ filteredWords?.length || 0 }} word(s)
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