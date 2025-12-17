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
    padding: 2em;
    border-radius: 1em;
    background-color: white;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    width: 10vw;
    height: 10vw;
    min-width: 250px;
    min-height: 250px;
    color: var(--text-light);
}

.card:hover {
    cursor: help;
}
</style>