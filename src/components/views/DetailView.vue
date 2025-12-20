<script setup lang="ts">
import PitchDisplay from '../pitch/PitchDisplay.vue';
import { ref, computed, watchEffect, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWordStore } from '@/stores/word';
import type { Word } from '@/stores/word';

const route = useRoute();
const router = useRouter();
const store = useWordStore();

const showEnglish = ref(false);

const showPreviousWord = () => {
    showEnglish.value = false;
    router.push(`/word/${previousWord.value?.tango}`);
};

const showNextWord = () => {
    showEnglish.value = false;
    router.push(`/word/${nextWord.value?.tango}`);
};

const loading = ref(false);
const activeWord = ref<Word | null>(null);
const previousWord = ref<Word | null>(null);
const nextWord = ref<Word | null>(null);

watchEffect(() => {
    const tango = route.params.tango as string;
    const { data: activeWordData, isLoading: activeWordLoading } = store.getActiveWord(tango);

    watchEffect(() => {
      if (!activeWordLoading.value && activeWordData.value?.words[0]) {
          activeWord.value = activeWordData.value.words[0] as Word;
      }
    });

    watchEffect(() => {
        if (!activeWord.value) {
            loading.value = activeWordLoading.value;
            return;
        }

        const yomi = activeWord.value.yomi;
        const { data: previousWordData, isLoading: previousWordLoading } = store.getPreviousWord(yomi);
        const { data: nextWordData, isLoading: nextWordLoading } = store.getNextWord(yomi);

        watchEffect(() => {
            if (!previousWordLoading.value) {   
                previousWord.value = (previousWordData.value?.words[0] as Word) || null;
            }
            if (!nextWordLoading.value) {
                nextWord.value = (nextWordData.value?.words[0] as Word) || null;
            }
            loading.value = activeWordLoading.value || previousWordLoading.value || nextWordLoading.value;
        });
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && previousWord.value) {
        event.preventDefault();
        event.stopPropagation();
        showPreviousWord();
    } else if (event.key === 'ArrowRight' && nextWord.value) {
        event.preventDefault();
        event.stopPropagation();
        showNextWord();
    }
    if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        router.push('/');
    }
});
</script>

<template>
    <div class="word-details-wrapper">
        <div class="breadcrumbs">
            <RouterLink to="/">word list</RouterLink>
            <span class="separator"><img src="/src/assets/icons/chevron-right.svg" alt="separator" /></span> 
            <RouterLink to="/word/{{ route.params.tango }}">{{ route.params.tango }}</RouterLink>
        </div>
        <template v-if="!loading || activeWord">
            <div class="card-wrapper">
                <div class="card-navigation previous-word">
                    <template v-if="previousWord">
                        <span class="sr-only">Previous word: {{ previousWord.tango }}</span>
                        <button @click="showPreviousWord">{{ previousWord.tango }}</button>
                    </template>
                </div>
                <div class="card">
                    <div v-if="activeWord" id="word-details-container" :data-tango="activeWord?.tango">
                        <div class="headword-container">
                            <h1>{{ activeWord.tango }}</h1>
                            <PitchDisplay v-if="activeWord" :yomi="activeWord.yomi" :pitch="activeWord.pitch" />
                        </div>
                        <div id="word-details">
                            <div class="definition-ja">{{ activeWord.definition_ja }}</div>
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
                <RouterLink to="/" class="btn">Back to Word List</RouterLink>
                <div class="hint">Tip: Use the arrow keys to navigate between words and ESC to exit!</div>
            </div>
        </template>
    </div>
</template>

<style scoped lang="less">
.word-details-wrapper {
    padding: 0rem 2rem;

    height: 100%;
    width: 100%;

    display: grid;
    grid-template-rows: 3em 5fr 1fr;
    overflow: hidden;

    .card-wrapper {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 4fr 1fr;
        justify-items: center;
        align-items: center;
        gap: 1em;

        .card-navigation {
            flex: 0;
            button {
                position: relative;
                height: fit-content;
                width: max-content;

                color: var(--text-dark);
                font-size: 1.2em;
                text-decoration: underline;
                
                background-color: var(--button-dark);
                border-radius: 10px;
                transition: background-color 0.3s ease;

                &::after, &::before {
                    height: 20px;
                    width: 20px;
                    position: absolute;
                    transition: background-color 0.3s ease;
                }

                &:hover {
                    background-color: var(--button-dark-hover);
                    &::after, &::before {
                        transition: background-color 0.3s ease;
                    }
                }
            }

            &.next-word {
                button {
                    padding: 1em 1.5em 1em 1em;
                    
                    &::after {
                        content: url('/src/assets/icons/chevron-right.svg');
                        margin-left: 0.5em;
                        top: 1.1em;
                        right: 0.5em;
                    }
                }
            }

            &.previous-word {
                button {
                    padding: 1em 1em 1em 1.5em;
                    
                    &::before {
                        content: url('/src/assets/icons/chevron-left.svg');
                        margin-right: 0.5em;
                        top: 1.1em;
                        left: 0.5em;
                    }
                }
            }
        }
    }

    .card {
        padding: 2em;
        height: 100%;

        min-width: 800px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5em;
        
        border-radius: 1em;
        background-color: white;
        color: var(--text-light);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

        overflow-y: scroll;

        @media (max-width: 1024px) {
            min-width: 400px;
        }
    }
}

#word-details-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 2em;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    @media (max-width: 1024px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2em;
    }

    .pitch-display {
        margin-bottom: 0;
        font-size: 2em;
    }

    #word-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2em;
    }
    
    .headword-container {
        display: flex;
        flex-direction: column;
        gap: 1em;
        border-right: 1px solid #ccc;
        align-items: center;

        justify-content: center;

        @media (min-width: 1024px) {
            height: 100%;
        }
        
        @media (max-width: 1024px) {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #ccc;
            padding-bottom: 2em;
        }

        h1 {
            margin: 0;
            font-size: 6rem;
            line-height: 1;
            overflow-wrap: break-word;
            hyphens: auto;
        }
    }
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

    #word-details .definition-ja {
        font-size: 1.2em;
    }

    #word-details .card-toggle {
        text-decoration: underline;
    }

    #word-details .card-toggle:hover {
        cursor: pointer;
    }
    
.hint-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem;

    .hint {
        font-size: 0.8em;
        color: var(--text-light);
    }

    a {
        background-color: var(--button-dark);
        color: var(--text-dark);
        padding: 0.5em 1em;
        border-radius: 0.5em;
        cursor: pointer;

        &:hover {
            background-color: var(--button-dark-hover);
            cursor: pointer;
        }
    }
}



.breadcrumbs {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5em;
    font-size: 1em;

    a {
        color: var(--text-light);
        text-decoration: underline;

        &:hover {
            color: var(--text-light-hover);
            cursor: pointer;
        }
    }

    .separator {
        img {
            width: 1em;
            height: 1em;
            filter: brightness(0) invert(0);
        }
    }
}
</style>