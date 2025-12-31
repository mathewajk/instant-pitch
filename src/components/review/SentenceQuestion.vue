<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import type { SentenceQuestionType } from './types';

const props = defineProps<{
  question: SentenceQuestionType;
}>();

const emit = defineEmits<{
  answer: [payload: { correct: boolean, sentence_id: string }];
  next: [];
}>();

const textAnswer = ref('');
const wasCorrect = ref<boolean | null>(null);
const showHint = ref(false);
const showGloss = ref(false);
const isComposing = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const isAnswered = computed(() => wasCorrect.value !== null);

const focusInput = () => nextTick(() => inputRef.value?.focus());

onMounted(focusInput);
watch(() => props.question, () => {
  textAnswer.value = '';
  wasCorrect.value = null;
  showHint.value = false;
  showGloss.value = false;
  focusInput();
});

const normalize = (val: string) => (val || '').replace(/\s+/g, '');

const targetWord = computed(() => props.question.words[props.question.blankIndex]);

const displayTokens = computed(() =>
  props.question.words.map((w, idx) => ({
    ...w,
    isBlank: idx === props.question.blankIndex,
  }))
);

const sentenceGloss = computed(() =>
  props.question.words
    .map((w) => w.gloss)
    .filter(Boolean)
    .join(' | ')
);

const handleSubmit = () => {
  if (isAnswered.value || isComposing.value) return;
  const target = normalize(targetWord.value?.tango || '');
  const correct = normalize(textAnswer.value.trim()) === target;
  wasCorrect.value = correct;
  emit('answer', { correct, sentence_id: props.question.sentence_id });
};

const handleNext = () => {
  if (!isAnswered.value) return;
  emit('next');
};

const handleKeydown = (event: KeyboardEvent) => {
  const isSpace = event.code === 'Space' || event.code === 'Spacebar';

  if (!isAnswered.value && isSpace) {
    event.preventDefault();
    showHint.value = !showHint.value;
    return;
  }
  if (!isAnswered.value && event.code === 'Enter') {
    if (event.isComposing || isComposing.value) return;
    event.preventDefault();
    handleSubmit();
    return;
  }
  if (isAnswered.value && isSpace) {
    event.preventDefault();
    handleNext();
  }
};

defineExpose({ handleKeydown });
</script>

<template>
  <div class="sentence-question">
    <div class="sentence-line">
      <div v-for="token in displayTokens" :key="`${token.word_id}-${token.position}`" class="token">
        <template v-if="token.isBlank && !isAnswered">
          <span class="blank"></span>
        </template>
        <template v-else-if="token.isBlank && isAnswered">
          <span :class="{ correct: wasCorrect, incorrect: wasCorrect === false }">{{ token.tango }}</span>
        </template>
        <template v-else>{{ token.tango }}</template>
        <span v-if="isAnswered" class="gloss">{{ token.gloss }}</span>
        <span v-else-if="showHint && token.isBlank" class="gloss">{{ token.gloss }}</span>
      </div>
    </div>

    <form class="text-answer" @submit.prevent="handleSubmit">
      <input
        ref="inputRef"
        type="text"
        v-model="textAnswer"
        placeholder="Type the missing word"
        :disabled="isAnswered"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false"
      />
      <button type="submit" :disabled="isAnswered || textAnswer.trim().length === 0">
        Submit
      </button>
    </form>

    <div class="hint">
      <button type="button" class="hint-button" @click="showHint = !showHint">
        {{ showHint ? 'Hide hint' : 'Show hint (Space)' }}
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
.sentence-question {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5em;
  padding: 1.5em;
  text-align: center;

  button {
    background-color: var(--button-dark, #333);
    color: white;
    border: none;
    border-radius: 0.5em;
    cursor: pointer;
    font-size: 1.05em;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--button-dark-hover, #555);
    }

    &:disabled {
      background-color: #999;
      cursor: not-allowed;
    }
  }

  .sentence-line {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35em;
    justify-content: center;
    font-size: 1.4rem;


      .token {
        padding: 0.15em 0.25em;
        display: flex;
        flex-direction: column;
        gap: 0.35em;
        justify-content: center;

        .correct {
            color: #4caf50;
        }

        .incorrect {
            color: #f44336;
        }

        .gloss {
          font-size: 0.8em;
        }
      }

    .blank {
      border-bottom: 2px solid #333;
      min-width: 4ch;
      display: inline-block;
    }
  }

  .text-answer {
    display: flex;
    flex-direction: row;
    gap: 0.75em;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    input {
      padding: 0.75em 1em;
      border: 1px solid #ccc;
      border-radius: 0.5em;
      min-width: 240px;
      font-size: 1.1em;
    }

    button {
      padding: 0.75em 1.5em;
    }
  }

  .hint {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    align-items: center;
  }

  .feedback {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    align-items: center;
  }

  .result {
    font-size: 1.2rem;
    font-weight: 600;

    &.correct {
      color: #4caf50;
    }

    &.incorrect {
      color: #f44336;
    }
  }

  .full-gloss {
    color: #555;
  }

  .next-button {
    padding: 0.9em 1.8em;
  }
}
</style>

