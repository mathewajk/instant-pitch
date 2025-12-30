<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useModal } from 'vue-final-modal';

import WordCardFront from './WordCardFront.vue'
import WordCardBack from './WordCardBack.vue'
import WordForm from '../words/WordForm.vue';

import { useUserStore } from '@/stores/user';
import type { Word } from '@/stores/word';

const props = defineProps<{
    word: Word
}>()

const userStore = useUserStore();
const flipped = ref(false);
const showEnglish = ref(false);
const wordToEdit = ref<Word | undefined>(undefined);

const emit = defineEmits<{
    showDetails: []
}>()

const { open: openEditModal, close: closeEditModal } = useModal({
  component: WordForm,
  attrs: computed(() => ({
    word: wordToEdit.value,
    onClose() {
      closeEditModal()
      wordToEdit.value = undefined;
    },
  })),
});

const starWord = () => {
    console.log('starWord');
}

const toggleLanguage = () => {
    showEnglish.value = !showEnglish.value;
}

const editWord = () => {
    wordToEdit.value = props.word;
    openEditModal();
}
</script>

<template>
    <div class="card" @click="flipped = !flipped">
        <div class="card-actions">
            <a v-if="flipped" href="#" class="language-button" @click.stop="toggleLanguage">
                <img src="/src/assets/icons/language.svg" alt="Toggle language" />
            </a>
            <a v-if="userStore.isAdmin" href="#" class="edit-button" @click.stop="editWord">
                <img src="/src/assets/icons/pencil.svg" alt="Edit" />
            </a>
            <a href="#" class="star-button" @click.stop="starWord">
                <img src="/src/assets/icons/star-empty.svg" alt="Star" />
            </a>
            <RouterLink :to="`/word/${word.tango}`" class="info-button">
                <img src="/src/assets/icons/circle-info.svg" alt="Show details" />
            </RouterLink>
        </div>
        <WordCardFront v-if="!flipped" :word="word" />
        <WordCardBack v-if="flipped" :word="word" :show-english="showEnglish" />
    </div>
</template>

<style scoped lang="less">

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.card {  
    position: relative; 
    width: 250px;
    height: 250px;
    padding-top: 3rem;

    .card-actions {
        display: none;

        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 10;

        img {
            width: 1.5em;
            height: 1.5em;
            filter: brightness(0) invert(0.25);
            transition: filter 0.2s;

            &:hover {
                cursor: pointer;
                filter: brightness(0) invert(0);
                transition: filter 0.2s;
            }
        }

        /* On touch devices, show the card actions */
        @media (pointer: coarse) {
            display: flex;
            gap: 0.25em;
            img {
                height: 2em;
                width: 2em;
            }
        }
    }

    &:hover {
        cursor: pointer;

        .card-actions {
            display: flex;
            gap: 0.25em;
            animation: fadeIn 0.3s;
        }
    }
}
</style>