<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import type { KanjiQuestionType } from './types';

const props = defineProps<{
  question: KanjiQuestionType;
}>();

const emit = defineEmits<{
  answer: [payload: { correct: boolean }];
  next: [];
}>();

const textAnswer = ref('');
const wasCorrect = ref<boolean | null>(null);
const isComposing = ref(false);
const showHint = ref(false);
const showEnglish = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const isAnswered = computed(() => wasCorrect.value !== null);

const focusInput = () => {
  nextTick(() => {
    inputRef.value?.focus();
  });
};

onMounted(focusInput);
watch(() => props.question, () => {
  textAnswer.value = '';
  wasCorrect.value = null;
  showHint.value = false;
  showEnglish.value = false;
  focusInput();
});

const normalize = (val: string) => val.replace(/\s+/g, '');

const handleSubmit = () => {
  if (isAnswered.value || isComposing.value) return;
  const target = props.question.word.tango;
  const correct = normalize(textAnswer.value.trim()) === normalize(target);
  wasCorrect.value = correct;
  emit('answer', { correct });
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
  <div class="kanji-question">
    <div class="question-word">
      <h1>{{ question.word.yomi }}</h1>
      <div v-if="showHint" class="hint-content">
        <p class="definition-ja">{{ question.word.definition_ja }}</p>
        <p v-if="showEnglish" class="definition-en">{{ question.word.definition_en }}</p>
      </div>
    </div>

    <form class="text-answer" @submit.prevent="handleSubmit">
      <input
        ref="inputRef"
        type="text"
        v-model="textAnswer"
        placeholder="Type the kanji"
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
        {{ showHint ? 'Hide hint' : 'Show hint' }}
      </button>
      <button
        v-if="question.word.definition_en"
        type="button"
        class="hint-button secondary"
        @click="showEnglish = !showEnglish"
      >
        {{ showEnglish ? 'Hide English' : 'Show English' }}
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
.kanji-question {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2em;
  padding: 2em;

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

  .text-answer {
    display: flex;
    flex-direction: row;
    gap: 0.75em;
    align-items: center;
    justify-content: center;

    input {
      padding: 0.75em 1em;
      border: 1px solid #ccc;
      border-radius: 0.5em;
      min-width: 240px;
      font-size: 1.1em;
    }

    button {
      padding: 0.75em 1.5em;

      &:disabled {
        background-color: #696969;
        cursor: not-allowed;
      }
    }
  }

  .hint {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    align-items: center;
    text-align: center;

    .hint-content {
      display: flex;
      flex-direction: column;
      gap: 0.5em;
      max-width: 600px;
      color: #444;

      .definition-ja {
        font-size: 1.1em;
      }

      .definition-en {
        font-size: 1em;
        color: #666;
      }
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

