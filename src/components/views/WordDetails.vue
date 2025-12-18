<script setup lang="ts">
import PitchDisplay from '../pitch/PitchDisplay.vue';
import { ref, computed, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWordStore } from '@/stores/word';
import type { Word } from '@/stores/word';

const route = useRoute();
const router = useRouter();
const store = useWordStore();

const showEnglish = ref(false);

const activeWord = ref<Word | null>(null);
const previousWord = ref<Word | null>(null);
const nextWord = ref<Word | null>(null);

const loading = ref(true);

const showPreviousWord = () => {
    showEnglish.value = false;
    router.push(`/word/${previousWord.value?.tango}`);
};

const showNextWord = () => {
    showEnglish.value = false;
    router.push(`/word/${nextWord.value?.tango}`);
};

watchEffect(() => {
    const tango = route.params.tango;
    
    const activeWordQuery = { words: { $: { limit: 1, where: { tango } } } };
    const previousWordQuery = { words: { $: { limit: 1, where: { tango: { $lt: tango } }, order: { tango: 'desc' } } } };
    const nextWordQuery = { words: { $: { limit: 1, where: { tango: { $gt: tango } }, order: { tango: 'asc' } } } };

    const { data: activeWordData, isLoading: activeWordLoading } = store.subscribe(activeWordQuery);
    const { data: previousWordData, isLoading: previousWordLoading } = store.subscribe(previousWordQuery);
    const { data: nextWordData, isLoading: nextWordLoading } = store.subscribe(nextWordQuery);

    watchEffect(() => {
        if (!activeWordLoading.value && activeWordData.value?.words[0]) {
            activeWord.value = activeWordData.value.words[0] as Word;
        }
        
        if (!previousWordLoading.value) {
            previousWord.value = (previousWordData.value?.words[0] as Word) || null;
        }
        
        if (!nextWordLoading.value) {
            nextWord.value = (nextWordData.value?.words[0] as Word) || null;
        }

        loading.value = activeWordLoading.value || previousWordLoading.value || nextWordLoading.value;
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && previousWord.value) {
        showPreviousWord();
    } else if (event.key === 'ArrowRight' && nextWord.value) {
        showNextWord();
    }
});
</script>

<template>
    <div class="word-details-wrapper">
        <div class="form-container">
            <RouterLink to="/">
                < Back to word list
            </RouterLink>
        </div>
        <template v-if="!loading || activeWord">
            <div class="card-container">
                <div class="card-navigation previous-word">
                    <template v-if="previousWord">
                        <span class="sr-only">Previous word: {{ previousWord.tango }}</span>
                        <button @click="showPreviousWord">{{ previousWord.tango }}</button>
                    </template>
                </div>
                <div class="card">
                    <div v-if="activeWord" id="word-details-container" :data-tango="activeWord.tango">
                        <div class="headword-container">
                            <h1>{{ activeWord.tango }}</h1>
                            <PitchDisplay :yomi="activeWord.yomi" :pitch="activeWord.pitch" />
                        </div>
                        <div id="word-details">
                            <div class="definition-jp">{{ activeWord.definition_jp }}</div>
                            <div v-if="showEnglish" class="definition-en">{{ activeWord.definition_en }}</div>
                            <div v-else class="card-toggle" @click="showEnglish = true">Show translation</div>
                            <div class="context">{{ activeWord.context }}</div>
                            <div class="source">Source: {{ activeWord.source }}</div>
                        </div>
                    </div>
                </div>
                <div class="card-navigation next-word">
                    <template v-if="nextWord">
                        <span class="sr-only">Next word: {{ nextWord.tango }}</span>
                        <button @click="showNextWord">{{ nextWord.tango }}</button>
                    </template>
                </div>
            </div>
            <div class="hint-container">
                <div class="hint">Tip: Use the arrow keys to navigate between words!</div>
            </div>
        </template>
    </div>
</template>

<style scoped>
    .word-details-wrapper {
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-rows: 1fr 3fr 1fr;
        overflow: hidden;
    }

    .card-container {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        justify-items: center;
        align-items: center;
        gap: 1em;
    }

    .card-container .card-navigation {
        flex: 0;
    }

    .card-container .card-navigation button {
        font-size: 1.2em;
        background-color: var(--button-dark);
        color: var(--text-dark);
        border-radius: 10px;
        transition: background-color 0.3s ease;
    }

    .card-container .card-navigation button:hover {
        background-color: var(--button-dark-hover);
    }

    .card-container .card-navigation.next-word button {
        padding: 1em 1.5em 1em 1em;
    }

    .card-container .card-navigation.previous-word button {
        padding: 1em 1em 1em 1.5em;
    }

    .card-container button {
        position: relative;
        height: fit-content;
        background-color: transparent;
        text-decoration: underline;
        width: max-content;
    }

    .card-container button:after, .card-container button:before {
        height: 20px;
        width: 20px;
        position: absolute;
        transition: background-color 0.3s ease;
    }

    .card-container .previous-word button:before {
        content: url('/src/assets/icons/chevron-left.svg');
        margin-right: 0.5em;
        top: 1.1em;
        left: 0.5em;
    }   

    .card-container .next-word button:after {
        content: url('/src/assets/icons/chevron-right.svg');
        margin-left: 0.5em;
        top: 1.1em;
        right: 0.5em;
    }

    .card-container button:hover::before {
        transition: background-color 0.3s ease;
    }

    .card-container button:hover::after {
        transition: background-color 0.3s ease;
    }

    .card-container .card {
        flex: 0;
        padding: 2em;
        
        min-width: 800px;
        height: 100%;

        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5em;
        
        border-radius: 1em;
        background-color: white;
        color: var(--text-light);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    }

    #word-details-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        width: 100%;
    }

    #word-details-container .headword-container {
        flex: 0;
        display: flex;
        flex-direction: column;
        gap: 1em;
        text-align: center;
        border-right: 1px solid #ccc;
    }

    #word-details-container .headword-container h1 {
        margin: 0;
        font-size: 6rem;
        line-height: 1;
        overflow-wrap: break-word;
        hyphens: auto;
    }

    #word-details-container .headword-container .pitch-display {
        margin-bottom: 0;
        font-size: 2em;
    }

    #word-details-container #word-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2em;
        padding: 2em;
    }

    #word-details .context {
        border-left: 2px solid #ccc;
        padding-left: 1em;
        color: #666;
    }

    #word-details .source {
        color: #666;
        font-size: 0.8em;
    }

    #word-details .definition-jp {
        font-size: 1.2em;
    }

    #word-details .card-toggle {
        text-decoration: underline;
    }

    #word-details .card-toggle:hover {
        cursor: pointer;
    }
    
    .hint-container {
        padding-top: 3em;
        text-align: center;
    }

    .hint {
        font-size: 0.8em;
        color: #000000;
    }

    .form-container {
        padding: 2rem;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
    }

    .form-container a {
        font-size: 1.2em;
        color: black;
        text-decoration: underline;
    }

    .form-container a:hover {
        color: var(--text-light);
    }
</style>