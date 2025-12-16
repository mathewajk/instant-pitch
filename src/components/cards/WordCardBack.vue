<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    word: {
        tango: string,
        kana: string,
        pitch: number,
        source: string,
        definition_ja: string,
        definition_en: string,
    }
}>()

defineEmits<{
    click: []
}>()

const showEnglish = ref(false);
</script>

<template>
    <div class="word-back" @click="$emit('click')">
        <div class="definition-ja" @click.stop>{{ word.definition_ja }}</div>
        <div class="translation-container">
            <div v-if="showEnglish" class="definition-en">{{ word.definition_en }}</div>
            <div v-else class="definition-toggle" @click.stop="showEnglish = true">Show translation</div>
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

.definition-ja {
    z-index: 10;
}

.translation-container {
    text-align: center;
}

.definition-toggle {
    z-index: 10;
    text-decoration: underline;
}

.definition-toggle:hover {
    cursor: pointer;
}
</style>

