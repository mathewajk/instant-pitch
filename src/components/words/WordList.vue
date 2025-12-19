<script setup lang="ts">
import { ref, computed } from 'vue'
import WordCard from '../cards/WordCard.vue'
import WordForm from './WordForm.vue'
import PitchFilter from '../pitch/PitchFilter.vue'

import { useModal } from 'vue-final-modal'
import { useWordStore } from '../../stores/word';

import type { Word } from '@/stores/word';


const store = useWordStore();

const filterByPitch = ref<Function | null>(null);
const baseQuery = { words: { $: {order: { tango: 'asc' } } } };
const { isLoading, error, data } = store.subscribe(baseQuery);

const filteredWords = computed(() => {
  return data.value?.words.filter((word) => filterByPitch.value ? filterByPitch.value(word) : true);
});

const { open, close } = useModal({
  component: WordForm,
  attrs: {
    onClose() {
      close()
    },
  },
});

</script>

<template>
  <div class="word-list-wrapper">
    <div class="form-container">  
        <PitchFilter @change="filterByPitch = $event" />
        <button @click="open">Add words</button>
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
  </div>
</template>

<style scoped>

.word-list-wrapper {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: minmax(10rem, fit-content) calc(100vh - 15rem) 5rem;
  overflow: hidden;
}

.word-list-wrapper > div {
  padding: 1rem 2rem;
}

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
  flex-direction: row;
  gap: 1em;
  align-items: flex-end

}
</style>

