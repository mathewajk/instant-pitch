<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { Word } from '@/stores/word';

defineProps<{
    word: Word
}>()

defineEmits<{
    showDetails: []
}>()

const showEnglish = ref(false);

</script>

<template>
    <div class="word-back">
        <div class="definition definition-ja" @click.stop>{{ word.definition_jp }}</div>
        <div class="translation-container">
            <div v-if="showEnglish" class="definition definition-en">{{ word.definition_en }}</div>
            <div v-else class="card-toggle" @click.stop="showEnglish = true">Show translation</div>
            <div class="card-toggle"><RouterLink :to="`/word/${word.tango}`">Show more</RouterLink></div>
        </div>
    </div>
</template>

<style scoped>
.word-back {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 1.2em;
}

.definition {
    z-index: 10;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;  
}

.definition.definition-ja {
    -webkit-line-clamp: 4;
    line-clamp: 4;
}

.definition.definition-en {
    -webkit-line-clamp: 2;
    line-clamp: 2;
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

