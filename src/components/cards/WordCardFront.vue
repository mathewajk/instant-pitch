<script setup lang="ts">
import PitchDisplay from '../pitch/PitchDisplay.vue'
import type { Word } from '@/stores/word';

const props = defineProps<{
    word: Word,
}>()

</script>

<template>
    <div class="word-front">
        <span class="tango">{{ word.tango }}</span>
        <PitchDisplay :yomi="word.yomi" :pitch="word.pitch" />
        <span class="sr-only"> - Pitch accent: {{ word.pitch }}</span>
        <div class="source">
            Source: {{ word.source }}
        </div>
    </div>
</template>

<style scoped>
.word-front {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
}

.source {
    font-size: 0.8em;
    color: #666;
}

.tango {
    font-size: 2em;
    font-family: 'Noto Sans', Arial, sans-serif;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    word-wrap: normal;
    border: 0;
}

@media (prefers-color-scheme: dark) {
    .mora[data-pitch="high"]::before, .mora[data-pitch="start"]::after, 
    .mora[data-pitch="low"]::before, .mora[data-pitch="start"]::before {
        @apply bg-gray-200;
    } 

    button .mora[data-pitch="high"]::before, button .mora[data-pitch="start"]::after, 
    button .mora[data-pitch="low"]::before, button .mora[data-pitch="start"]::before {
        background-color: #330D00;
    } 
}
</style>

