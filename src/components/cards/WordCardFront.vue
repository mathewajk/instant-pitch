<script setup lang="ts">
import PitchDisplay from '../pitch/PitchDisplay.vue'
import type { Word } from '@/stores/word';

const props = defineProps<{
    word: Word,
}>()

</script>

<template>
    <div class="card-front">
        <div id="word">{{ word.tango }}</div>
        <PitchDisplay :yomi="word.yomi" :pitch="word.pitch" />
        <div id="source">
            Source: {{ word.source }}
        </div>
    </div>
</template>

<style scoped>
.card-front {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;

    #word {
        font-size: 2em;

        display: webkit-box;
        -webkit-box-orient: vertical;
        
        line-clamp: 1;
        -webkit-line-clamp: 1;
        
        overflow: ellipsis;
        word-break: break-word;
        white-space: nowrap;
    }

    #source {
        font-size: 0.8em;
        color: #666;
    }
}
</style>

