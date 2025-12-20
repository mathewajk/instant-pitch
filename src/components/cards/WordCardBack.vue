<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { Word } from '@/stores/word';

defineProps<{
    word: Word,
    showEnglish: boolean
}>()

defineEmits<{
    showDetails: []
}>()

</script>

<template>
    <div class="word-back">
        <h2 class="tango">{{ word.tango }}</h2>
        <div v-if="showEnglish" class="definition definition-en">{{ word.definition_en }}</div>
        <div v-else class="definition definition-ja">{{ word.definition_ja }}</div>
    </div>
</template>

<style scoped lang="less">

.word-back {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 1.2em;

    h2.tango {
        font-size: 1.25em;
        text-align: center;
        margin: 0 0 1em 0;
    }
}

.definition {
    z-index: 10;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;  
    -webkit-line-clamp: 3;
    line-clamp: 3;
}

.translation-container {
    text-align: center;
}

.card-toggle {
    z-index: 10;
    text-decoration: underline;
}

.card-toggle:hover {
    cursor: pointer;
}
</style>

