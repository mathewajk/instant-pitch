<script setup lang="ts">
import WordCardFront from './WordCardFront.vue'
import WordCardBack from './WordCardBack.vue'
import { ref } from 'vue';
import type { Word } from '@/stores/word';

defineProps<{
    word: Word
}>()

const flipped = ref(false);

const emit = defineEmits<{
    showDetails: []
}>()

</script>

<template>
    <div class="card" @click="flipped = !flipped">
        <WordCardFront v-if="!flipped" :word="word" />
        <WordCardBack v-if="flipped" :word="word" @showDetails="emit('showDetails')" />
    </div>
</template>

<style scoped>
.card {  
  width: 10vw;
  height: 10vw;
  min-width: 250px;
  min-height: 250px;
}

.card:hover {
    cursor: help;
}
</style>