<script setup lang="ts">
import { ref, computed } from 'vue';
import PitchDisplay from '../pitch/PitchDisplay.vue';
import { useWordStore } from '@/stores/word';
import type { Word } from '@/stores/word';

const props = defineProps<{
  word: Word;
  answerOptions: { word: Word; correct: boolean }[];
}>();

const emit = defineEmits<{
  answer: [index: number];
  next: [];
}>();

const wordStore = useWordStore();
const selectedIndex = ref<number | null>(null);
const isAnswered = computed(() => selectedIndex.value !== null);
const correctIndex = computed(() => 
  props.answerOptions.findIndex(opt => opt.correct)
);

const handleAnswer = (index: number) => {
  if (isAnswered.value) return;
  selectedIndex.value = index;
  emit('answer', index);
};

const handleNext = () => {
  if (!isAnswered.value) return;
  selectedIndex.value = null;
  emit('next');
};

const handleKeydown = (event: KeyboardEvent) => {
  if (isAnswered.value) {
    if (event.code === 'Space') {
      event.preventDefault();
      handleNext();
    }
    return;
  }

  // Handle number keys 1-4
  if (event.code.startsWith('Digit')) {
    const digit = parseInt(event.code.replace('Digit', ''));
    if (digit >= 1 && digit <= props.answerOptions.length) {
      event.preventDefault();
      handleAnswer(digit - 1);
    }
  }
};

defineExpose({
  handleKeydown
});
</script>

<template>
  <div class="review-question" tabindex="0" @keydown="handleKeydown">
    <div class="question-word">
      <h1>{{ word.tango }}</h1>
    </div>
    <div class="answer-buttons">
      <button
        v-for="(option, index) in answerOptions"
        :key="index"
        :class="[
          'answer-button',
          {
            'answered': isAnswered,
            'correct': isAnswered && option.correct,
            'incorrect': isAnswered && selectedIndex === index && !option.correct,
            'selected': selectedIndex === index
          }
        ]"
        :disabled="isAnswered"
        @click="handleAnswer(index)"
      >
        <PitchDisplay :yomi="option.word.yomi" :pitch="option.word.pitch" />
      </button>
    </div>
    <div v-if="isAnswered" class="feedback">
      <button class="next-button" @click="handleNext">
        {{ correctIndex === selectedIndex ? 'Correct!' : 'Incorrect' }} →
      </button>
    </div>
  </div>
</template>

<style scoped lang="less">
.review-question {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 2em;
  padding: 2em;
  outline: none;

  .question-word {
    text-align: center;
    margin-bottom: 1em;

    h1 {
      font-size: 6rem;
      margin: 0;
      line-height: 1;
    }
  }

  .answer-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1em;
    max-width: 600px;
    width: 100%;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .answer-button {
    padding: 1.5em;
    border: 2px solid #ccc;
    border-radius: 0.5em;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1.2em;

    &:hover:not(:disabled) {
      border-color: var(--mora-peak, #ff6b6b);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    &:disabled {
      cursor: not-allowed;
    }

    &.answered {
      &.correct {
        border-color: #4caf50;
        background-color: #e8f5e9;
      }

      &.incorrect {
        border-color: #f44336;
        background-color: #ffebee;
      }

      &:not(.correct):not(.incorrect) {
        opacity: 0.6;
      }
    }

    &.selected {
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
    }
  }

  .feedback {
    margin-top: 1em;
  }

  .next-button {
    padding: 1em 2em;
    background-color: var(--button-dark, #333);
    color: white;
    border: none;
    border-radius: 0.5em;
    cursor: pointer;
    font-size: 1.1em;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--button-dark-hover, #555);
    }
  }
}
</style>

