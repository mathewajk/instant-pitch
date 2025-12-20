<script setup lang="ts">
import WordDetailsCard from '../details/WordDetailsCard.vue';
import WordNavigationButton from '../details/WordNavigationButton.vue';
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWordStore } from '@/stores/word';
import type { Word } from '@/stores/word';

const route = useRoute();
const router = useRouter();
const store = useWordStore();

const showPreviousWord = () => router.push(`/word/${previousWord.value?.tango}`);
const showNextWord = () => router.push(`/word/${nextWord.value?.tango}`);

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

        const { data: allWordsData, isLoading: allWordsLoading } = store.getAllWords();

        watchEffect(() => {
            if (!allWordsLoading.value && allWordsData.value?.words && activeWord.value) {
                const words = allWordsData.value.words as Word[];
                previousWord.value = store.findPreviousWord(words, activeWord.value!);
                nextWord.value = store.findNextWord(words, activeWord.value!);
            }
            loading.value = activeWordLoading.value || allWordsLoading.value;
        });
    });
});

const allowedKeys = ['ArrowLeft', 'ArrowRight', 'Escape'];
const handleKeydown = (event: KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.key === 'ArrowLeft' && previousWord.value) {
        showPreviousWord();
    } else if (event.key === 'ArrowRight' && nextWord.value) {
        showNextWord();
    } else if (event.key === 'Escape') {
        router.push('/');
    }
}

document.addEventListener('keydown', (event) => {
    if (allowedKeys.includes(event.key)) {
        handleKeydown(event);
    }
});
</script>

<template>
    <div class="word-details-wrapper">
        <div class="breadcrumbs">
            <RouterLink to="/">words</RouterLink>
            <span class="separator"><img src="/src/assets/icons/chevron-right.svg" alt="separator" /></span> 
            <RouterLink to="/word/{{ route.params.tango }}">{{ route.params.tango }}</RouterLink>
        </div>
        <template v-if="!loading || activeWord">
            <div class="card-wrapper">
                <WordNavigationButton direction="previous" :word="previousWord" @click="showPreviousWord" />
                <div class="card">
                    <WordDetailsCard :active-word="activeWord" />
                </div>
                <WordNavigationButton direction="next" :word="nextWord" @click="showNextWord" />
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
    grid-template-rows: 4em 5fr 1fr;
    overflow: hidden;

    .card-wrapper {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 4fr 1fr;
        justify-items: center;
        align-items: center;
        gap: 1em;
    }

    .card {
        padding: 2em;
        height: 100%;

        min-width: 700px;
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
    padding: 1em;

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