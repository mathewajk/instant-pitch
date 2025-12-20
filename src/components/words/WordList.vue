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
const baseQuery = { words: { $: {order: { yomi: 'asc' } } } };
const { isLoading, error, data } = store.subscribe(baseQuery);

const filteredWords = computed(() => {
  return data.value?.words
    .filter((word) => filterByPitch.value ? filterByPitch.value(word) : true)
    .filter((word) => {
      return word.tango.toLowerCase().includes(search.value.toLowerCase()) || word.yomi.toLowerCase().includes(search.value.toLowerCase());
    });
});

const { open, close } = useModal({
  component: WordForm,
  attrs: {
    onClose() {
      close()
    },
  },
});

const search = ref('');

</script>

<template>
  <div class="word-list-wrapper">
    <div class="form-container">  
        <PitchFilter @change="filterByPitch = $event" />
        <input id="search" type="text" v-model="search" placeholder="単語を検索" />
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

<style scoped lang="less">

.word-list-wrapper {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 4rem calc(100vh - 12rem) 5rem;
  overflow: hidden;

  > div {
    padding: 1rem 2rem;
  }

  .words-container {
    overflow-y: scroll;

    .words {
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }
  }

  .form-container {
    display: flex;
    flex-direction: row;
    gap: 1em;
    align-items: flex-end;
  }

  #search {
    border-radius: 0.5em;
    border: 1px solid #ccc;
    padding: 0.5em;
  }
}
</style>
