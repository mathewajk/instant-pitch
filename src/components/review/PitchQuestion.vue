<script setup lang="ts">
import { ref, computed } from 'vue';
import PitchDisplay from '../pitch/PitchDisplay.vue';
import type { PitchQuestionType, AnswerOption } from './types';

const props = defineProps<{
  question: PitchQuestionType;
}>();

const emit = defineEmits<{
  answer: [payload: { correct: boolean }];
  next: [];
}>();

const selectedIndex = ref<number | null>(null);
const wasCorrect = ref<boolean | null>(null);

const isAnswered = computed(() => wasCorrect.value !== null);
const answerOptions = computed(() => props.question.answerOptions || []);

const handleAnswer = (index: number) => {
  if (isAnswered.value) return;
  selectedIndex.value = index;
  const correct = answerOptions.value[index]?.correct ?? false;
  wasCorrect.value = correct;
  emit('answer', { correct });
};

const handleNext = () => {
  if (!isAnswered.value) return;
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
  if (event.code.startsWith('Digit')) {
    const digit = parseInt(event.code.replace('Digit', ''));
    if (digit >= 1 && digit <= answerOptions.value.length) {
      event.preventDefault();
      handleAnswer(digit - 1);
    }
  }
};

defineExpose({ handleKeydown });
</script>

<template>
  <div class="pitch-question">
    <div class="question-word">
      <h1>{{ question.word.tango }}</h1>
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
        {{ wasCorrect ? 'Correct!' : 'Incorrect' }} →
      </button>
    </div>
  </div>
</template>

<style scoped lang="less">
.pitch-question {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2em;
  padding: 2em;

  .question-word {
    text-align: center;
    margin-bottom: 1em;

    h1 {
      font-size: 6rem;
      margin: 0;
      line-height: 1;
      word-break: break-word;
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

  button {
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

  .answer-button {
    padding: 1.5em;
    border: 2px solid #ccc;
    border-radius: 0.5em;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1.2em;
    color: inherit;

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
    display: flex;
    flex-direction: column;
    gap: 0.75em;
    align-items: center;
  }

  .next-button {
    padding: 1em 2em;
  }
}
</style>

