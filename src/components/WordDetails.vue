<script setup lang="ts">
import PitchDisplay from './pitch/PitchDisplay.vue';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useWordStore } from '@/stores/word';

const route = useRoute();
const tango = route.params.tango;
const store = useWordStore();
const word = computed(() => store.words[0]);

onMounted(() => {
    store.subscribeWords({ words: { $: { where: { tango: tango } } } });
});

const showEnglish = ref(false);
</script>

<template>
    <div class="form-container"></div>
    <div v-if="word" class="word-details-container">
        <div class="card word-details">
            <div class="word-header">
                <h1>{{ word.tango }}</h1>
                <PitchDisplay :yomi="word.yomi" :pitch="word.pitch" />
            </div>
            <div class="word-info">
                <div class="definition-jp">{{ word.definition_jp }}</div>
                <div v-if="showEnglish" class="definition-en">{{ word.definition_en }}</div>
                <div v-else class="card-toggle" @click="showEnglish = true">Show translation</div>
                <div class="context">{{ word.context }}</div>
                <div class="source">Source: {{ word.source }}</div>
            </div>
        </div>
    </div>
    <div></div>
</template>

<style scoped>
    .word-details-container h1 {
        flex: 0;
        font-size: 8rem;
        font-weight: 600;
        margin: 0;
    }

    .word-details-container {
        display: flex;
        flex-direction: column;
        gap: 1em;
        justify-content: center;
        padding: 2em;
        align-items: center;
    }

    .word-header {
        display: flex;
        flex-direction: column;
        gap: 1em;
        text-align: center;
        padding: 0em 5em 2em 2em;
        border-right: 1px solid #ccc;
    }

    .word-header .pitch-display {
        margin-bottom: 0;
        font-size: 2em;
    }

    .card {
        padding: 2em;
        border-radius: 1em;
        background-color: white;
        color: var(--text-light);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        width: 75%;
        min-width: 800px;
        height: 100%;
    }

    .word-details {
        display: flex;
        flex-direction: row;
        gap: 5em;
        align-items: center;
    }

    .word-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2em;
    }

    .context {
        border-left: 2px solid #ccc;
        padding-left: 1em;
        color: #666;
    }

    .source {
        color: #666;
        font-size: 0.8em;
    }

    .definition-jp {
        font-size: 1.2em;
    }

    .card-toggle {
        text-decoration: underline;
    }

    .card-toggle:hover {
        cursor: pointer;
    }
    
</style>